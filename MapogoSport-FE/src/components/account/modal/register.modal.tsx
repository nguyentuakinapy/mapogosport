'use client'

import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap"
import { toast } from "react-toastify";
import "./account.scss"


interface RegisterProps {
    showRegisterModal: boolean;
    setShowRegisterModal: (v: boolean) => void;
    showLoginModal: boolean;
    setShowLoginModal: (v: boolean) => void;
}

export default function Register(props: RegisterProps) {
    const { showRegisterModal, setShowRegisterModal } = props;
    const { showLoginModal, setShowLoginModal } = props;

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [authority, setAuthority] = useState<number>(4);

    const [otp, setOtp] = useState<string>("");
    const [otpValue, setOtpValue] = useState<string>("");

    const [errorFullName, setErrorFullName] = useState<boolean>(false);
    const [errorUsername, setErrorUsername] = useState<boolean>(false);
    const [errorPassword, setErrorPassword] = useState<boolean>(false);
    const [errorForgotPassword, setErrorForgotPassword] = useState<boolean>(false);
    const [errorOtp, setErrorOtp] = useState<boolean>(false);

    const [timeLeft, setTimeLeft] = useState(5);
    const [checkButton, setCheckButton] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!username) {
            toast.warning("Vui lòng nhập tên đăng nhập!")
            return;
        } else if (!fullName) {
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
        } else if (password != newPassword) {
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

            // // Get New Id Authority
            // const response = await fetch(`http://localhost:8080/rest/authority`);
            // if (!response.ok) {
            //     throw new Error('Error fetching data');
            // }
            // const dataAuth = await response.json();
            // if (!dataAuth.length) {
            //     toast.error("No authority data available");
            //     return;
            // }
            // const newAuthorityId = dataAuth[dataAuth.length - 1]?.authorityId + 1 || 1;

            // Create Authority
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
                                        <span
                                            className="btn btn-submit d-flex align-items-center justify-content-center text-center mb-3">
                                            <svg className="mr-3 me-2 icon-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                width="24" height="24" viewBox="0 0 50 50">
                                                <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188
                                                 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 
                                                 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063
                                                 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 
                                                 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 
                                                 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 
                                                 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 
                                                 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969
                                                  C 39.238281 45.53125 33.457031 48 25.996094 48 Z">
                                                </path>
                                            </svg>
                                            Đăng nhập Google
                                        </span>
                                    </div>
                                </div>
                                <div className="text-line-through mb-3 text-center d-flex align-items-center">
                                    <hr className="flex-grow-1" />
                                    <span className="mx-3">Hoặc tài khoản</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <div className="form-group mb-3">
                                    <input type="text" className={`form-control ${errorFullName ? 'error' : ''} border border-dark`} placeholder="Tên đăng nhập *"
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <input type="text" className={`form-control ${errorFullName ? 'error' : ''} border border-dark`} placeholder="Họ và tên *"
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
                                            value={password} onChange={(e) => setPassword(e.target.value)}
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
