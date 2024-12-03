import { hashPassword } from "@/components/Utils/Format";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
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

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleClose = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
    }

    const handleSave = async () => {
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
        const hashNewPass = hashPassword(newPassword);
        const res = await fetch(`${BASE_URL}rest/user/${userData.username}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...userData,
                password: hashNewPass
            }),
        });
        if (!res.ok) {
            toast.error(`Cập nhật mật khẩu không thành công! Vui lòng thử lại sau!`);
            return
        }
        handleClose();
        mutate(`${BASE_URL}rest/user/${userData.username}`);
        toast.success('Cập nhật mật khẩu thành công!');
        await fetch('${BASE_URL}rest/user/changePassword/sendMail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userData?.email
            })
        });
    };

    return (
        <Modal show={showChangePassword} centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title className="text-uppercase text-danger fw-bold d-flex m-auto">Cập nhật mật khẩu</Modal.Title>
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
    )
}

export default ModalChangePassword;