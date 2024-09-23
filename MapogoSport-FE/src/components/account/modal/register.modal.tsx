'use client'

import { Modal } from "react-bootstrap"

export default function login() {

    const showModalCreate = true;
    const handleCloseModal = () =>{

    }
    return (
        <>
         <!-- Button to trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
        Mở Đăng Ký
    </button>

    <!-- Modal structure -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-custom">
            <div class="modal-content">
                <!-- Modal header -->
                <div class="modal-header border-0 ">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <!-- Modal body -->
                <div class="modal-body p-0">
                    <div class="modal-title h2 text-uppercase text-center font-weight-bold pt-lg-3 pt-2">
                        Đăng Ký
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
                            <!-- Fullname  -->
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="floatingInput" placeholder="Hoàng Thành">
                                <label for="floatingInput">Họ và tên <span class="text-danger">*</span></label>
                            </div>
                            <!-- PhoneNumber and Email -->
                            <div class="row mb-3">
                                <div class="form-floating col-6">
                                    <input type="text" class="form-control" id="floatingPassword"
                                        placeholder="0888888888888">
                                    <label class="ms-3" for="floatingPassword">Số điện thoại <span class="text-danger">*</span></label>
                                </div>
                                <div class="form-floating col-6">
                                    <input type="email" class="form-control" id="floatingPassword"
                                        placeholder="thanhPt@gmail.com">
                                    <label class="ms-3" for="floatingPassword">Email <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <!-- Password and Repassword -->
                            <div class="row mb-3">
                                <div class="form-floating col-6">
                                    <input type="password" class="form-control" id="floatingPassword"
                                        placeholder="Password">
                                    <label class="ms-3" for="floatingPassword">Mật khẩu <span class="text-danger">*</span></label>
                                </div>
                                <div class="form-floating col-6">
                                    <input type="password" class="form-control" id="floatingPassword"
                                        placeholder="Password">
                                    <label class="ms-3" for="floatingPassword">Xác nhận mật khẩu <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <!-- OTP ### -->
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="Mã OTP #####"
                                    aria-label="Mã OTP #####" aria-describedby="button-addon2">
                                <button class="btn btn-dark" type="submit" id="button-addon2">Gửi mã</button>
                            </div>

                            <!-- Submit Button -->
                            <button class="btn btn-submit w-100 mb-3">
                                Đăng ký
                            </button>

                            <!-- form login -->
                            <div class="d-flex justify-content-center">
                                <span>Bạn đã có tài khoản?</span>
                                <a href="/JSX,Components,Props//Login.html" class="fw-bold text-danger text-decoration-none">Đăng nhập ngay!</a>
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