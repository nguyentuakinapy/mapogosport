'use client'

import { useEffect, useState } from "react";
import { Form, InputGroup, Modal } from "react-bootstrap"
import { toast } from "react-toastify";
import "./account.scss"
import { hashPassword } from "@/components/Utils/Format";
interface ChangeNewPasswordProps {
    showChangePasswordNew: boolean;
    setShowChangePasswordNew: (v: boolean) => void;
    showLoginModal: boolean;
    setShowLoginModal: (v: boolean) => void;
}
export default function ChangePasswordNew(props: ChangeNewPasswordProps) {
    const { showChangePasswordNew, setShowChangePasswordNew } = props;
    const { setShowLoginModal } = props;
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [createPassword, setCreatePassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [hidePassword, setHidePassword] = useState<boolean>(true);

    useEffect(() => {
        setPassword(hashPassword(createPassword));
    }, [createPassword])

    const handleSubmit = async () => {
        const username = sessionStorage.getItem('usernameNewPass');
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!*@%])[A-Za-z\d!*@%]{6,}$/;

        if (username) {
            const responseUser = await fetch(`${BASE_URL}rest/user/${username}`);
            if (!responseUser.ok) {
                throw new Error('Error fetching data');
            }
            const dataUser = await responseUser.json();

            if (!createPassword) {
                toast.warning(`Vui lòng nhâp mật khẩu!`);
                return
            } else if (!newPassword) {
                toast.warning(`Vui lòng nhâp lại mật khẩu mới!`);
                return
            } else if (!createPassword.match(regex) || !newPassword.match(regex)) {
                toast.error("Mật khẩu phải có ít nhất 6 ký tự, đồng thời bao gồm cả chữ số, chữ cái và ký tự đặc biệt (!*@%).")
                return
            } else if (createPassword == newPassword) {
                dataUser.password = password;
                fetch(`${BASE_URL}rest/user/${username}`, {
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
                    setShowChangePasswordNew(false);
                    setShowLoginModal(true);
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
                                <InputGroup className="mb-4" style={{
                                    border: '1px solid', borderRadius: '5px 5px'
                                }}>
                                    <Form.Control style={{
                                        width: '92%', border: 'none'
                                    }}
                                        type={hidePassword ? 'password' : 'text'}
                                        placeholder="Mật khẩu mới *!"
                                        value={createPassword} onChange={(e) => setCreatePassword(e.target.value)}
                                    />
                                    <InputGroup.Text className="bg-white" style={{
                                        width: '8%', border: 'none', cursor: 'pointer'
                                    }} id="basic-addon1" onClick={() => setHidePassword(prev => !prev)}>
                                        {hidePassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                                    </InputGroup.Text>
                                </InputGroup>
                                <InputGroup className="mb-4" style={{
                                    border: '1px solid', borderRadius: '5px 5px'
                                }}>
                                    <Form.Control style={{
                                        width: '92%', border: 'none'
                                    }}
                                        type={hidePassword ? 'password' : 'text'}
                                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới *"
                                    />
                                    <InputGroup.Text className="bg-white" style={{
                                        width: '8%', border: 'none', cursor: 'pointer'
                                    }} id="basic-addon1" onClick={() => setHidePassword(prev => !prev)}>
                                        {hidePassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                                    </InputGroup.Text>
                                </InputGroup>
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
