import { hashPassword } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface UserProps {
    showChangePassword: boolean;
    setShowChangePassword: (v: boolean) => void;
    userData: User | null;
}

const ModalChangePassword = (props: UserProps) => {
    const { showChangePassword, setShowChangePassword, userData } = props;

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleClose = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
    }

    const handleSave = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Hãy điền đầy đủ thông tin!");
            return;
        }
        if (hashPassword(currentPassword) !== userData?.password) {
            toast.error("Mật khẩu hiện tại không đúng!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            return;
        }
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!*@%])[A-Za-z\d!*@%]{6,}$/;
        if (!newPassword.match(regex)) {
            setNewPassword('');
            setConfirmPassword('');
            toast.error("Mật khẩu phải có ít nhất 6 ký tự, đồng thời bao gồm cả chữ số, chữ cái và ký tự đặc biệt (!*@%).")
            return;
        }
        if (newPassword !== confirmPassword) {
            setNewPassword('');
            setConfirmPassword('');
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            const hashNewPass = hashPassword(newPassword);
            fetch(`http://localhost:8080/rest/user/${parsedUserData.username}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    password: hashNewPass
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Cập nhật mật khẩu không thành công! Vui lòng thử lại sau!`);
                    return
                }
                handleClose();
                mutate(`http://localhost:8080/rest/user/${parsedUserData.username}`);
                toast.success('Cập nhật mật khẩu thành công!');
                fetch('http://localhost:8080/rest/user/changePassword/sendMail', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userData?.email
                    })
                });
            })
        }
    };

    return (
        <>
            <Modal show={showChangePassword} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Cập nhật mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontSize: '14px' }}>Mật khẩu của bạn phải có tối thiểu 6 ký tự, đồng thời bao gồm cả chữ số, chữ cái và ký tự đặc biệt (!*@%).</p>
                    <Form.Group className="mb-3">
                        <Form.Floating className="mb-3">
                            <Form.Control size="sm" type="password" placeholder="Mật khẩu hiện tại"
                                value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            <Form.Label>Mật khẩu hiện tại <b className='text-danger'>*</b></Form.Label>
                        </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Floating className="mb-3">
                            <Form.Control size="sm" type="password" placeholder="Mật khẩu mới"
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <Form.Label>Mật khẩu mới <b className='text-danger'>*</b></Form.Label>
                        </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Floating className="mb-3">
                            <Form.Control size="sm" type="password" placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <Form.Label>Xác nhận mật khẩu mới <b className='text-danger'>*</b></Form.Label>
                        </Form.Floating>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Hủy
                    </Button>
                    <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default ModalChangePassword;