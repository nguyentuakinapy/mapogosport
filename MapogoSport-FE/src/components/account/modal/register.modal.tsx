'use client'

import { useEffect } from "react";
import { Modal } from "react-bootstrap"

export default function login() {
    useEffect(() => {
        const sendCodeButton = document.getElementById('button-addon2');
        let countdown: NodeJS.Timeout;

        if (sendCodeButton) {
            sendCodeButton.addEventListener('click', function (event) {
                event.preventDefault();
                startCountdown();
            });
        }

        function startCountdown() {
            let timeLeft = 45;
            if (sendCodeButton) {
                (sendCodeButton as HTMLButtonElement).disabled = true;
                (sendCodeButton as HTMLButtonElement).innerText = `Gửi lại mã (${timeLeft}s)`;

                countdown = setInterval(function () {
                    timeLeft--;
                    if (sendCodeButton) {
                        sendCodeButton.innerText = `Gửi lại mã (${timeLeft}s)`;
                    }

                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        if (sendCodeButton) {
                            (sendCodeButton as HTMLButtonElement).disabled = false;
                            (sendCodeButton as HTMLButtonElement).innerText = 'Gửi lại mã';
                        }
                    }
                }, 1000);
            }
        }

        return () => {
            if (sendCodeButton) {
                sendCodeButton.removeEventListener('click', startCountdown);
            }
            clearInterval(countdown);
        };
    }, []);

    return (
        <>
            <div className="modal fade" id="registerModal" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-custom">
                    <div className="modal-content">
                        <div className="modal-header border-0 ">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="modal-title h2 text-uppercase text-center font-weight-bold">
                                Đăng Ký
                            </div>
                            <form className="form-login-register" action="/member/ajax-login" method="post" autoComplete="off">
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
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="floatingInput" placeholder="Hoàng Thành" />
                                        <label htmlFor="floatingInput">Họ và tên <span className="text-danger">*</span></label>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="form-floating col-6">
                                            <input type="text" className="form-control" id="floatingPassword"
                                                placeholder="0888888888888" />
                                            <label className="ms-3" htmlFor="floatingPassword">Số điện thoại <span className="text-danger">*</span></label>
                                        </div>
                                        <div className="form-floating col-6">
                                            <input type="email" className="form-control" id="floatingPassword"
                                                placeholder="thanhPt@gmail.com" />
                                            <label className="ms-3" htmlFor="floatingPassword">Email <span className="text-danger">*</span></label>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="form-floating col-6">
                                            <input type="password" className="form-control" id="floatingPassword"
                                                placeholder="Password" />
                                            <label className="ms-3" htmlFor="floatingPassword">Mật khẩu <span className="text-danger">*</span></label>
                                        </div>
                                        <div className="form-floating col-6">
                                            <input type="password" className="form-control" id="floatingPassword"
                                                placeholder="Password" />
                                            <label className="ms-3" htmlFor="floatingPassword">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                                        </div>
                                    </div>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="Mã OTP #####"
                                            aria-label="Mã OTP #####" aria-describedby="button-addon2" />
                                        <button className="btn btn-dark" type="submit" id="button-addon2">Gửi mã</button>
                                    </div>

                                    <button className="btn btn-submit w-100 mb-3">
                                        Đăng ký
                                    </button>

                                    <div className="d-flex justify-content-center">
                                        <span>Bạn đã có tài khoản?</span>
                                        <a data-bs-toggle="modal" data-bs-target="#loginModal" style={{ cursor: 'pointer' }} className="ms-2 fw-bold text-danger text-decoration-none">Đăng nhập ngay!</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}