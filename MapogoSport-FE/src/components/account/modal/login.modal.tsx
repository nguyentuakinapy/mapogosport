'use client'
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

interface LoginProps {
    showLoginModal: boolean;
    setShowLoginModal: (v: boolean) => void;
    showRegisterModal: boolean;
    setShowRegisterModal: (v: boolean) => void;
    showForgotPassword: boolean;
    setShowForgotPassword: (v: boolean) => void;
}

export default function Login(props: LoginProps) {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checkRememberMe, setCheckRememberMe] = useState<boolean>(false);
    // Data auto fet khi update data
    // const fetcher = (url: string) => fetch(url).then((res) => res.json());

    // const { data, error, isLoading } = useSWR(
    //     `http://localhost:8080/rest/user/${username}`,
    //     fetcher,
    //     {
    //         revalidateIfStale: false,
    //         revalidateOnFocus: false,
    //         revalidateOnReconnect: false
    //     }
    // );

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const parsedUserData = JSON.parse(userCookie);
            setUsername(parsedUserData.username);
            setPassword(parsedUserData.password);
            setCheckRememberMe(true);
            console.log("Dữ liệu người dùng từ cookie:", parsedUserData);
        } else {
            console.log("Không có dữ liệu người dùng trong cookie.");
        }
    }, []);

    const handleSubmit = async () => {
        if (!username) {
            toast.warning("Vui lòng nhập thông tin!");
            return;
        } else if (!password) {
            toast.warning("Vui lòng nhập thông tin!");
        } else {
            try {
                const responseUser = await fetch(`http://localhost:8080/rest/user/${username}`);
                if (!responseUser.ok) {
                    throw new Error('Error fetching data');
                }
                const dataUser = await responseUser.json();
                if (dataUser.password == password) {
                    if (checkRememberMe) {
                        const user = { username, password };
                        Cookies.set('user', JSON.stringify(user), { expires: 7 });
                    } else {
                        Cookies.remove('user');
                    }
                    handleClose();
                    sessionStorage.setItem('user', JSON.stringify(dataUser));
                    if (dataUser.authorities[0].role.name == "ROLE_ADMIN") {
                        window.location.href = "/admin";
                    } else if (dataUser.authorities[0].role.name == "ROLE_STAFF") {
                        window.location.href = "/admin";
                    } else if (dataUser.authorities[0].role.name == "ROLE_OWNER") {
                        window.location.href = "/owner";
                    } else {
                        window.location.href = "/";
                    }
                } else {
                    toast.error("Thông tin đăng nhập không đúng!");
                }
            } catch (error: any) {
                toast.error("Thông tin đăng nhập không đúng!!! " + error);
            }
        }

    }
    const { showLoginModal, setShowLoginModal } = props;
    const { showRegisterModal, setShowRegisterModal } = props;
    const { showForgotPassword, setShowForgotPassword } = props;

    const handleClose = () => {
        setShowLoginModal(false);
        setUsername("");
        setPassword("");
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const parsedUserData = JSON.parse(userCookie);
            setUsername(parsedUserData.username);
            setPassword(parsedUserData.password);
            setCheckRememberMe(true);
            console.log("Dữ liệu người dùng từ cookie:", parsedUserData);
        } else {
            console.log("Không có dữ liệu người dùng trong cookie.");
        }
    }

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
                            <span className="btn btn-submit d-flex align-items-center justify-content-center text-center">
                                Đăng nhập Google
                            </span>
                        </div>
                        <div className="text-line-through mb-3 text-center d-flex align-items-center">
                            <hr className="flex-grow-1" />
                            <span className="mx-3">Hoặc tài khoản</span>
                            <hr className="flex-grow-1" />
                        </div>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
                                placeholder="Vui long nhập Email!"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="password"
                                placeholder="Vui long nhập mật khẩu!"
                                value={password}
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
