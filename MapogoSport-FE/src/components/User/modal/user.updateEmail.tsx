import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface UserProps {
    showUpdateEmail: boolean;
    setShowUpdateEmail: (v: boolean) => void;
    userData: User | null;
}

const ModalUpdateEmail = (props: UserProps) => {
    const { showUpdateEmail, setShowUpdateEmail, userData } = props;
    const [otpValue, setOtpValue] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState(5);
    const [checkButton, setCheckButton] = useState<boolean>(false);
    const [newEmail, setNewEmail] = useState<string>("");
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleClose = () => {
        setShowUpdateEmail(false);
        setNewEmail('');
        setOtpValue('');
    }

    const handleSave = async () => {
        if (!otpValue || !newEmail) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!")
            return;
        }
        if (!newEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            toast.warning("Vui lòng nhập đúng định dạng email!")
            return;
        }
        const res = await fetch(`${BASE_URL}rest/user/${userData?.username}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...userData,
                email: newEmail
            }),
        });
        if (!res.ok) {
            toast.error(`Cập nhật địa chỉ email không thành công! Vui lòng thử lại sau!`);
            return
        }
        handleClose();
        mutate(`${BASE_URL}rest/user/${userData?.username}`);
        toast.success('Cập nhật địa chỉ email thành công!');
        await fetch(`${BASE_URL}rest/user/updateEmail/sendMail`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userData?.email
            })
        });
    }

    const coolDownTime = async () => {
        if (!newEmail) {
            toast.warning("Vui lòng nhập email mới!");
            return;
        }
        setCheckButton(true);
        if (timeLeft) {
            clearInterval(timeLeft);
        }
        setTimeLeft(60);
        const newTimerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 1) {
                    clearInterval(newTimerId); // Dừng bộ đếm khi thời gian bằng 0
                    setCheckButton(false);
                }
                return prevTime - 1;
            });
        }, 1000);
        toast.success(`Mã xác nhận đang được gửi về email ${newEmail}!`);
        const response = await fetch(`${BASE_URL}rest/user/sendMail`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEmail)
        });
        if (!response.ok) {
            throw new Error('Đã xảy ra lỗi trong quá trình gửi mã, vui lòng thử lại sau!');
        }
    }

    return (
        <Modal show={showUpdateEmail} centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title className="text-uppercase text-danger fw-bold d-flex m-auto">Cập nhật Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Email mới: <b className="text-danger">*</b></Form.Label>
                    <Form.Control type="email" placeholder="Nhập địa chỉ email mới"
                        value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </Form.Group>
                <div className="my-3">
                    <Form.Label>Mã xác nhận: <b className="text-danger">*</b></Form.Label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Mã OTP ######"
                            value={otpValue} onChange={(e) => setOtpValue(e.target.value)} />
                        <Button variant="btn btn-profile" onClick={() => { coolDownTime() }}
                            disabled={checkButton}>{checkButton ? timeLeft + 's' : 'Gửi mã'}</Button>
                    </InputGroup>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>Hủy</Button>
                <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default ModalUpdateEmail;