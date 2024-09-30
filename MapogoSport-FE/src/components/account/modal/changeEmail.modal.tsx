'use client'
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default function ChangeEmail() {
    

    return (
        <>
            <div className="modal fade" id="changeEmail" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-custom">
                    <div className="modal-content">

                        <div className="modal-header border-0 ">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-0">
                            <div className="modal-title h2 text-uppercase text-center font-weight-bold pt-lg-3 pt-2">
                                Thay đổi Email
                            </div>
                            <form className="form-login-register" action="/member/ajax-login" method="post" autoComplete="off">
                                <div className="p-lg-5 p-4">
                                    <div className="row border border-danger rounded ms-1 mb-3 me-1">
                                        <div className="col-2 d-flex justify-content-center align-items-center">
                                            <i className="fa-solid fa-envelope" style={{ fontSize: '36px', color: 'red' }}></i>
                                        </div>
                                        <div className="col-10">
                                            <div className="fw-bold">Lấy mã xác nhận qua Email</div>
                                            <div className="d-flex">
                                                <span className="fw-bold">Email: </span>
                                                <span className="text-danger">hoanghuuthanh.sd@gmail.com</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button id="button-addon-confirm" className="btn btn-submit w-100 mb-3 ">
                                        Nhận mã
                                    </button>

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

                                    <div className="mb-4">
                                        <label htmlFor="exampleInputEmail1" className="form-label">Email mới <span
                                            className="text-danger">*</span></label>
                                        <input type="email" className="form-control" id="exampleInputEmail1"
                                            aria-describedby="emailHelp" />
                                    </div>

                                    <button className="btn btn-submit w-100 mb-3 p-2">
                                        Xác nhận
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