'use client'
import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default function ChangePassword() {
    return (
        <>
            <div className="modal fade" id="changePassword" tabIndex={-1} aria-labelledby="changeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header border-0 ">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-0">
                            <div className="modal-title h2 text-uppercase text-center font-weight-bold pt-lg-3 pt-2">
                                Đổi mật khẩu
                            </div>
                            <form className="form-login-register" action="/member/ajax-login" method="post" autoComplete="off">
                                <div className="p-lg-5 p-4">

                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="floatingUsername" placeholder="Username" disabled />
                                        <label htmlFor="floatingUsername">Tên người dùng</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword"
                                            placeholder="Password" />
                                        <label htmlFor="floatingPassword">Mật khẩu cũ  <span className="text-danger">*</span></label>
                                    </div>

                                    <div className="form-floating mb-3 d-flex">
                                        <input type="password" className="form-control" id="floatingPassword"
                                            placeholder="Password" />
                                        <label htmlFor="floatingPassword">Mật khẩu mới <span className="text-danger">*</span></label>
                                    </div>
        
                                    <div className="form-floating mb-5">
                                        <input type="password" className="form-control" id="floatingPassword"
                                            placeholder="Password" />
                                        <label htmlFor="floatingPassword">Nhập lại mật khẩu  <span className="text-danger">*</span></label>
                                    </div>

                                    <button className="btn btn-submit w-100 ">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}