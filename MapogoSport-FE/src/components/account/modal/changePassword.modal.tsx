'use client';
import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChangePassword() {

    // State để lưu trữ
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    
    // xử lý input thay đổi
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Xóa rỗng form khi mà close 
    const handleModalClose = () => {
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    return (
        <>
            <div className="modal fade" id="changePassword" tabIndex={-1} aria-labelledby="changeModalLabel" aria-hidden="true"
                data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header border-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}></button>
                        </div>

                        <div className="modal-body p-0">
                            <div className="modal-title h2 text-uppercase text-center font-weight-bold pt-lg-3 pt-2">
                                Đổi mật khẩu
                            </div>
                            <form className="form-login-register" action="/member/ajax-login" method="post" autoComplete="off">
                                <div className="p-lg-5 p-4">

                                    <div className="form-group mb-4">
                                        <input type="text" className="form-control" id="floatingUsername" placeholder="Tên người dùng" disabled />
                                    </div>

                                    <div className="form-group mb-4">
                                        <input
                                            name="oldPassword"
                                            id="oldPassword"
                                            type="password"
                                            className="form-control required"
                                            placeholder="Mật khẩu cũ"
                                            value={formData.oldPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <input
                                            name="newPassword"
                                            id="newPassword"
                                            type="password"
                                            className="form-control required"
                                            placeholder="Mật khẩu mới"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <input
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            type="password"
                                            className="form-control required"
                                            placeholder="Nhập lại mật khẩu"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <button className="btn btn-submit w-100">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
