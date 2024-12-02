'use client'
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { decodeJson, encodeJson, encodeString, hashPassword } from "@/components/Utils/Format";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from 'next/navigation'; // Để kiểm tra đường dẫn

interface LoginProps {
    showLoginModal: boolean;
    setShowLoginModal: (v: boolean) => void;
    showRegisterModal: boolean;
    setShowRegisterModal: (v: boolean) => void;
    showForgotPassword: boolean;
    setShowForgotPassword: (v: boolean) => void;
    refreshKey: number;
    setRefreshKey: (v: number) => void;
}

export default function Login(props: LoginProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checkRememberMe, setCheckRememberMe] = useState<boolean>(false);
    const { setRefreshKey, refreshKey } = props;
    const { showLoginModal, setShowLoginModal, setShowRegisterModal, setShowForgotPassword } = props;
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const parsedUserData = JSON.parse(decodeJson(userCookie));
            setUsername(parsedUserData.username);
            setPassword(parsedUserData.password);
            setCheckRememberMe(true);
        }
    }, []);

    const handleSubmit = async () => {
        if (!username || !password) {
            toast.warning("Vui lòng nhập thông tin!");
            return;
        } else {
            try {
                const responseUser = await fetch(`${BASE_URL}rest/user/${username}`);
                if (!responseUser.ok) {
                    throw new Error('Error fetching data');
                }
                const dataUser = await responseUser.json() as User;
                // console.log(hashPassword(password));
                if (dataUser.password == hashPassword(password)) {
                    if (!dataUser.enabled) {
                        toast.error("Tài khoản đã vô hiệu hóa!")
                        return;
                    }

                    if (checkRememberMe) {
                        const user = { username, password };
                        Cookies.set('user', JSON.stringify(encodeJson(user)), { expires: 7 });
                    } else {
                        Cookies.remove('user');
                    }
                    handleClose();

                    const usernameLocal = dataUser.username.replace(/['"]+/g, '');

                    localStorage.setItem('username', encodeString(usernameLocal));
                    sessionStorage.setItem('user', JSON.stringify(encodeJson(dataUser)));

                    setRefreshKey(refreshKey + 1);
                    toast.success("Đăng nhập thành công!");

                    await fetch('/api/auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataUser),

                    }).then(async (response) => {
                        const payload = await response.json();
                        const data = {
                            status: response.status,
                            payload
                        }
                        if (!response.ok) {
                            throw data
                        }
                        return data
                    })
                } else {
                    toast.error("Thông tin đăng nhập không đúng!");
                }
            } catch (error) {
                toast.error("Thông tin đăng nhập không đúng! ");
            }
        }
    }

    let path;
    if (typeof window !== 'undefined') {
        path = window.location.href
    }


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);

            const notLoggedIn = params.get('notLoggedIn');
            const noRights = params.get('noRights');

            // Check if the 'notLoggedIn' query parameter exists and equals 'true'
            if (notLoggedIn === 'true') {
                setShowLoginModal(true);
                toast.error("Bạn chưa đăng nhập!");

                // Update the URL by removing the query parameter without reloading the page
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('notLoggedIn');

                // Corrected usage of router.replace
                router.replace(newUrl.toString());
            }

            if (noRights === 'true') {
                setShowLoginModal(true);
                toast.error("Bạn không có quyền truy cập!");

                // Update the URL by removing the query parameter without reloading the page
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('noRights');

                // Corrected usage of router.replace
                router.replace(newUrl.toString());
            }
        }
    }, [path, router, setShowLoginModal]);

    const handleClose = () => {
        setShowLoginModal(false);
        setUsername("");
        setPassword("");
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const parsedUserData = JSON.parse(decodeJson(userCookie));
            setUsername(parsedUserData.username);
            setPassword(parsedUserData.password);
            setCheckRememberMe(true);
            console.log("Dữ liệu người dùng từ cookie:", parsedUserData);
        } else {
            console.log("Không có dữ liệu người dùng trong cookie.");
        }
    }

    useEffect(() => {
        console.log("Client-side code running");
    }, []);

    const decodeJWT = (token: string) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return null;
        }
    };

    const handleLoginSuccess = async (response: CredentialResponse) => {
        const token = response.credential;
        console.log("Token received:", token);

        const user = decodeJWT(token!) as JwtGoogleAccount;
        if (user) {
            console.log("User Info:", user);
            try {
                const responseUser = await fetch(`${BASE_URL}rest/user/${user.sub}`);
                if (!responseUser.ok) {
                    throw new Error('Error fetching data');
                }
                const dataUser = await responseUser.json() as User;

                if (parseInt(dataUser.password) === 123) {
                    if (!dataUser.enabled) {
                        toast.error("Tài khoản đã vô hiệu hóa!")
                        return;
                    }

                    const usernameLocal = dataUser.username.replace(/['"]+/g, '');
                    localStorage.setItem('username', encodeString(usernameLocal));
                    sessionStorage.setItem('user', JSON.stringify(encodeJson(dataUser)));
                    setRefreshKey(refreshKey + 1);

                    toast.success("Đăng nhập thành công!");
                    await fetch('/api/auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataUser),

                    }).then(async (response) => {
                        const payload = await response.json();
                        const data = {
                            status: response.status,
                            payload
                        }
                        if (!response.ok) {
                            throw data
                        }
                        return data
                    })


                    handleClose();
                } else {
                    toast.error("Đăng nhập không thành công!");
                }
            } catch (error) {
                toast.error("Đăng nhập không thành công!");
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <>
            <Modal show={showLoginModal} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Đăng nhập</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="text-center mb-3">
                            {/* <a onClick={handleLoginClick} href="#" className="btn btn-submit d-flex align-items-center justify-content-center text-center">
                                    Đăng nhập Google
                                </a> */}
                            <div className="d-flex align-items-center justify-content-center">
                                <GoogleOAuthProvider clientId="291618476125-v61qth68ave5pfk18b2hg5qjtdbkjd94.apps.googleusercontent.com">
                                    <GoogleLogin onSuccess={handleLoginSuccess} />
                                </GoogleOAuthProvider>
                            </div>

                        </div>
                        <div className="text-line-through mb-3 text-center d-flex align-items-center">
                            <hr className="flex-grow-1" />
                            <span className="mx-3">Hoặc tài khoản</span>
                            <hr className="flex-grow-1" />
                        </div>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
                                placeholder="Vui long nhập tên đăng nhập!"
                                value={username} onKeyDown={handleKeyDown}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="password"
                                placeholder="Vui long nhập mật khẩu!"
                                value={password} onKeyDown={handleKeyDown}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                            <Form.Check type="checkbox" label="Nhớ mật khẩu" checked={checkRememberMe}
                                onChange={(e) => setCheckRememberMe(e.target.checked)} />
                            <a className="forgot d-block text-dark text-decoration-none"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setShowForgotPassword(true);
                                    setShowLoginModal(false);
                                }}>
                                Quên mật khẩu?
                            </a>
                        </div>
                        <Button className="btn btn-submit w-100 mb-3" onClick={handleSubmit}>
                            Đăng nhập
                        </Button>
                        <div className="d-flex justify-content-center">
                            <span>Bạn chưa có tài khoản?</span>
                            <a
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setShowLoginModal(false);
                                    setShowRegisterModal(true);
                                }}
                                className="fw-bold text-danger ms-2 text-decoration-none"
                            >
                                Đăng ký ngay!
                            </a>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
