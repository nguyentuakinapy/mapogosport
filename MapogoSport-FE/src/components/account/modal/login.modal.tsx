'use client'

import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default function Login() {
    const [showModalCreate, setShowModalCreate] = useState(false);

    const handleCloseModal = () => setShowModalCreate(false);
    const handleShowModal = () => setShowModalCreate(true);

    return (
        <>
           <!-- Button to trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
        Mở Đăng Nhập
    </button>

    <!-- Modal structure -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <!-- Modal header -->
                <div class="modal-header border-0 ">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <!-- Modal body -->
                <div class="modal-body p-0">
                    <div class="modal-title h2 text-uppercase text-center font-weight-bold pt-lg-3 pt-2">
                        Đăng nhập
                    </div>
                    <form class="form-login-register" action="/member/ajax-login" method="post" autocomplete="off">
                        <div class="p-lg-5 p-4">
                            <!-- Login by google and zalo -->
                            <div class="row mx-n2">
                                <!-- Google -->
                                <div class="col-md-12 col-12 px-2">
                                    <span
                                        class="btn btn-submit d-flex align-items-center justify-content-center text-center mb-3">
                                        <svg class="mr-3 icon-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
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
                            <!-- Divider -->
                            <div class="text-line-through mb-3 text-center d-flex align-items-center">
                                <hr class="flex-grow-1" />
                                <span class="mx-3">Hoặc tài khoản</span>
                                <hr class="flex-grow-1" />
                            </div>
                            <!-- Username Input -->
                            <div class="form-group mb-4">
                                <input name="username" id="username" type="text" class="form-control required"
                                    placeholder="Email hoặc số điện thoại">
                            </div>
                            <!-- Password Input -->
                            <div class="form-group mb-4">
                                <input name="password" id="password" type="password" class="form-control required"
                                    placeholder="Mật khẩu">
                            </div>

                            <!-- Forgot Password and Register -->
                            <div class="d-flex justify-content-between align-items-center mt-3 mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                        Nhớ mật khẩu
                                    </label>
                                </div>
                                <a class="forgot d-block text-dark text-decoration-none" href="/forgot-password">
                                    Quên mật khẩu ?
                                </a>
                            </div>

                            <!-- Submit Button -->
                            <button class="btn btn-submit w-100 mb-3">
                                Đăng nhập
                            </button>

                            <div class="d-flex justify-content-center">
                                <span>Bạn chưa có tài khoản?</span>
                                <a href="/JSX,Components,Props/Register.html" class="fw-bold text-danger text-decoration-none">Đăng ký ngay!</a>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
        </>
    );
}
