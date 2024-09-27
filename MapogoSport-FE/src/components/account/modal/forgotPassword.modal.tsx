'use client'
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
export default function ForgotPassword() {
    useEffect(() => {
        const sendCodeButton = document.getElementById('button-request');
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
            <div className="modal fade" id="forgotModal" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-custom">
                    <div className="modal-content">
                        <div className="modal-header border-0 ">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="modal-title h2 text-uppercase text-center font-weight-bold pt-lg-3 pt-2">
                                Quên mật khẩu
                            </div>
                            <form className="form-login-register" action="/member/ajax-login" method="post" autoComplete="off">
                                <div className="p-lg-5 p-4">
                                    <div className="row border border-danger rounded ms-1 mb-3 me-1">
                                        <div className="col-2 d-flex justify-content-center align-items-center">
                                            <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '36px', color: 'red' }} />                                        </div>
                                        <div className="col-10">
                                            <div className="fw-bold mt-2">Khôi phục mật khẩu qua email</div>
                                            <p>Mã sẽ gửi qua email bạn đăng ký để thay đổi mật khẩu</p>
                                        </div>
                                    </div>

                                    <div className="input-group mb-3">
                                        <input type="email" className="form-control" placeholder="Email *" aria-label="Email *"
                                            aria-describedby="button-request" />
                                        <button className="btn btn-dark" type="submit" id="button-request">Gửi mã</button>
                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="mxn" className="mb-2">Mã xác nhận <span className="text-danger">*</span></label>
                                        <div className="row verification d-flex justify-content-evenly">
                                            <input type="text" className="col-2" maxLength={1} />
                                            <input type="text" className="col-2" maxLength={1} />
                                            <input type="text" className="col-2" maxLength={1} />
                                            <input type="text" className="col-2" maxLength={1} />
                                            <input type="text" className="col-2" maxLength={1} />
                                        </div>
                                    </div>

                                    <button className="btn btn-submit w-100 mb-3">
                                        Đăng ký
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}