'use client'

import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap"
import { toast } from "react-toastify";
import "./account.scss"
import { encodeJson, encodeString, hashPassword } from "@/components/Utils/Format";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";


interface RegisterProps {
    showRegisterModal: boolean;
    setShowRegisterModal: (v: boolean) => void;
    showLoginModal: boolean;
    setShowLoginModal: (v: boolean) => void;
    refreshKey: number;
    setRefreshKey: (v: number) => void;
}

export default function Register(props: RegisterProps) {
    const { showRegisterModal, setShowRegisterModal } = props;
    const { setShowLoginModal, setRefreshKey, refreshKey } = props;

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [createPassword, setCreatePassword] = useState<string>("");
    const authority = 4;

    const [otp, setOtp] = useState<string>("");
    const [otpValue, setOtpValue] = useState<string>("");

    const [timeLeft, setTimeLeft] = useState(5);
    const [checkButton, setCheckButton] = useState<boolean>(false);

    useEffect(() => {
        setPassword(hashPassword(createPassword));
    }, [createPassword])

    const handleSubmit = async () => {
        if (!username) {
            toast.warning("Vui lòng nhập tên đăng nhập!")
            return;
        }

        try {
            await fetch(`http://localhost:8080/rest/user/${username}`);
            toast.warning("Tên đăng nhập đã tồn tại!");
            return;
        } catch (error) {

        }


        if (!fullName) {
            toast.warning("Vui lòng nhập họ và tên!")
            return;
        } else if (!email) {
            toast.warning("Vui lòng nhập email!")
            return;
        } else if (!password) {
            toast.warning("Vui lòng nhập mật khẩu!")
            return;
        } else if (!newPassword) {
            toast.warning("Vui lòng xác nhận mật khẩu!")
            return;
        } else if (createPassword != newPassword) {
            toast.warning("Mật khẩu bạn nhập không chính xác!")
            return;
        } else if (!otp) {
            toast.warning("Vui lòng nhập OTP!")
            return;
        } else if (otp != otpValue) {
            toast.warning("OTP Bạn nhập không chính xác!")
            return;
        }
        try {
            // Create user
            const responseUser = await fetch('http://localhost:8080/rest/user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, fullname: fullName, password, email })
            });
            if (!responseUser.ok) {
                throw new Error('Network response was not ok');
            }
            const resUser = await responseUser.json(); // Đọc responseUser ở đây

            const responseAuth = await fetch('http://localhost:8080/rest/authority', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: {
                        roleId: authority // Role phải có ID
                    },
                    user: {
                        username: username // User phải có username
                    }
                })
            });
            if (!responseAuth.ok) {
                throw new Error('Network response was not ok');
            }
            const resAuth = await responseAuth.json(); // Sửa lại dòng này

            if (resAuth && resUser) {
                toast.info("Đăng ký thành công!...");
                handleClose();
                setShowLoginModal(true);
            }

        } catch (error) {
            console.error("Error during fetch:", error);
            toast.error("Create failed!");
        }
    }

    const coolDownTime = async () => {
        if (email) {
            try {
                const responseEmail = await fetch(`http://localhost:8080/rest/user/getbyemail/${email}`);
                const dataUser = await responseEmail.json();
                if (dataUser.email == email) {
                    toast.warning("Email bạn nhập đã tồn tại!")!
                }
            } catch (error) {
                setCheckButton(true);
                if (timeLeft) {
                    clearInterval(timeLeft);
                }

                setTimeLeft(60);

                const newTimerId = setInterval(() => {
                    setTimeLeft((prevTime) => {
                        if (prevTime === 1) {
                            clearInterval(newTimerId); // Dừng bộ đếm khi thời gian bằng 0
                            setCheckButton(false);
                        }
                        return prevTime - 1;
                    });
                }, 1000);
                toast.success("Mã xác nhận đang được gửi về email!");
                const response = await fetch('http://localhost:8080/rest/user/sendMail', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(email)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const res = await response.text(); // Bạn đang trả về chuỗi OTP từ backend
                setOtp(res);
                // toast.success(`OTP is: ${res}`);
            }


        } else {
            toast.warning("Vui lòng nhập Email!");
        }
    }

    const handleClose = () => {
        setShowRegisterModal(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setFullName("");
        setNewPassword("");
        setOtp("");
        setOtpValue("");
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
        // console.log("Token received:", token);

        const user = decodeJWT(token!) as JwtGoogleAccount;
        if (user) {
            // console.log("User Info:", user);
            try {
                const responseUser = await fetch(`http://localhost:8080/rest/user/${user.sub}`);
                if (!responseUser.ok) {
                    throw new Error('Error fetching data');
                }
                const dataUser = await responseUser.json() as User;

                if (parseInt(dataUser.password) === 123) {

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
                try {
                    // Create user
                    const responseUser = await fetch('http://localhost:8080/rest/user', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: user.sub,
                            fullname: user.name,
                            password: 123,
                            email: user.email
                        })
                    });
                    if (!responseUser.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const resUser = await responseUser.json(); // Đọc responseUser ở đây

                    const responseAuth = await fetch('http://localhost:8080/rest/authority', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            role: {
                                roleId: authority // Role phải có ID
                            },
                            user: {
                                username: user.sub // User phải có username
                            }
                        })
                    });
                    if (!responseAuth.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const resAuth = await responseAuth.json(); // Sửa lại dòng này

                    if (resAuth && resUser) {
                        toast.success("Đăng ký thành công!...");
                        const usernameLocal = resUser.username.replace(/['"]+/g, '');
                        localStorage.setItem('username', encodeString(usernameLocal));
                        sessionStorage.setItem('user', JSON.stringify(encodeJson(resUser)));
                        setRefreshKey(refreshKey + 1);
                        await fetch('/api/auth', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(resUser),

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
                    }

                } catch (error) {
                    console.error("Error during fetch:", error);
                    toast.error("Create failed!");
                }
            }

        }
    };


    return (
        <>
            <Modal
                show={showRegisterModal}
                onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}
            >
                <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <button type="button" className="btn-close" onClick={() => handleClose()}></button>
                    </div>
                    <div className="modal-body p-0">
                        <div className="modal-title h2 text-uppercase text-center font-weight-bold">
                            Đăng Ký
                        </div>
                        <div className="form-login-register" >
                            <div className="p-lg-4 p-4">
                                <div className="row mx-n2">
                                    <div className="col-md-12 col-12 px-2">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <GoogleOAuthProvider clientId="291618476125-v61qth68ave5pfk18b2hg5qjtdbkjd94.apps.googleusercontent.com">
                                                <GoogleLogin onSuccess={handleLoginSuccess} />
                                            </GoogleOAuthProvider>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-line-through mb-3 text-center d-flex align-items-center">
                                    <hr className="flex-grow-1" />
                                    <span className="mx-3">Hoặc tài khoản</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <div className="form-group mb-3">
                                    <input type="text" className={`form-control  border border-dark`} placeholder="Tên đăng nhập *"
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <input type="text" className={`form-control  border border-dark`} placeholder="Họ và tên *"
                                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    {/* <div className="form-group col-6">
                                        <input type="text" className="form-control" id="floatingPassword"
                                        placeholder="Số điện thoại *" />
                                        </div> */}
                                    <div className="form-group">
                                        <input type="email" className="form-control border border-dark"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email *" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="form-group col-6">
                                        <input type="password" className="form-control border border-dark"
                                            value={createPassword} onChange={(e) => setCreatePassword(e.target.value)}
                                            placeholder="Mật khẩu *" />
                                    </div>
                                    <div className="form-group col-6">
                                        <input type="password" className="form-control border border-dark"
                                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Nhập lại mật khẩu *" />
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control border border-dark" placeholder="Mã OTP ######"
                                        value={otpValue} onChange={(e) => setOtpValue(e.target.value)}
                                        aria-label="Mã OTP ######" aria-describedby="button-addon2" />
                                    <button onClick={() => {
                                        coolDownTime();
                                    }}
                                        disabled={checkButton}
                                        className="btn btn-dark " type="submit"
                                        style={{ width: '100px' }} id="button-addon2"> {checkButton ? timeLeft + 's' : 'Gửi mã'}</button>
                                </div>

                                <button className="btn btn-submit w-100 mb-3" onClick={handleSubmit}>
                                    Đăng ký
                                </button>

                                <div className="d-flex justify-content-center">
                                    <span>Bạn đã có tài khoản?</span>
                                    <a onClick={() => {
                                        setShowRegisterModal(false);
                                        setShowLoginModal(true);
                                    }} style={{ cursor: 'pointer' }} className="ms-2 fw-bold text-danger text-decoration-none">Đăng nhập ngay!</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal >
        </>
    );
}
