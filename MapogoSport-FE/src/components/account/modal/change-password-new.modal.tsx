'use client'

import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap"
import { toast } from "react-toastify";
import "./account.scss"
interface ChangeNewPasswordProps {
    showChangePasswordNew: boolean;
    setShowChangePasswordNew: (v: boolean) => void;
}
export default function ChangePasswordNew(props: ChangeNewPasswordProps) {
    const { showChangePasswordNew, setShowChangePasswordNew } = props;

    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const handleSubmit = async () => {
        const username = sessionStorage.getItem('usernameNewPass');
        if (username) {
            const responseUser = await fetch(`http://localhost:8080/rest/user/${username}`);
            if (!responseUser.ok) {
                throw new Error('Error fetching data');
            }
            const dataUser = await responseUser.json();

            if (!password) {
                toast.warning(`Vui lòng nhâp mật khẩu!`);
            } else if (!newPassword) {
                toast.warning(`Vui lòng nhâp lại mật khẩu mới!`);
            } else if (password == newPassword) {
                dataUser.password = newPassword;
                fetch(`http://localhost:8080/rest/user/${username}`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataUser),
                }).then(async (res) => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        toast.error(`Cập nhật không thành công! Chi tiết lỗi: ${errorText}`);
                        return
                    }
                    toast.success('Đổi mật khẩu thành công!');
                    sessionStorage.removeItem('usernameNewPass');
                    window.location.href = "/";
                }).catch((error) => {
                    toast.error(`Đã xảy ra lỗi: ${error.message}`);
                });
            } else {
                toast.warning(`Mật khẩu bạn nhập không khớp!`);
            }
        }

    }
    const handleClose = () => {
        setShowChangePasswordNew(false);
    }

    return (
        <>
            <Modal
                show={showChangePasswordNew}
                onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}
            >
                <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <button type="button" className="btn-close" onClick={() => handleClose()}></button>
                    </div>
                    <div className="modal-body p-0">
                        <div className="modal-title h4 text-uppercase text-center font-weight-bold">
                            Thay đổi mật khẩu
                        </div>
                        <div className="form-login-register" >
                            <div className="p-lg-4 p-4">
                                <div className="row mb-3">
                                    <div className="form-group">
                                        <input type="password" className="form-control border border-dark"
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mật khẩu mới*" />
                                    </div>

                                </div>
                                <div className="row mb-3">
                                    <div className="form-group">
                                        <input type="password" className="form-control border border-dark"
                                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Nhập lại mật khẩu mới *" />
                                    </div>
                                </div>
                                <button className="btn btn-submit w-100 mb-3"
                                    onClick={() => handleSubmit()}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal >
        </>
    );
}
