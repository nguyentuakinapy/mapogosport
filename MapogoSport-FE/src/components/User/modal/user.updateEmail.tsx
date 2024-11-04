import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
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

    const handleClose = () => {
        setShowUpdateEmail(false);
        setNewEmail('');
        setOtpValue('');
    }

    const handleSave = () => {
        if (!otpValue || !newEmail) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!")
            return;
        }
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            fetch(`http://localhost:8080/rest/user/${parsedUserData.username}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    email: newEmail
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Cập nhật địa chỉ email không thành công! Vui lòng thử lại sau!`);
                    return
                }
                handleClose();
                mutate(`http://localhost:8080/rest/user/${parsedUserData.username}`);
                toast.success('Cập nhật địa chỉ email thành công!');
                fetch('http://localhost:8080/rest/user/updateEmail/sendMail', {
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
    }

    const coolDownTime = async () => {
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
        toast.success(`Mã xác nhận đang được gửi về email ${userData?.email}!`);
        const response = await fetch('http://localhost:8080/rest/user/sendMail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData?.email)
        });
        if (!response.ok) {
            throw new Error('Đã xảy ra lỗi trong quá trình gửi mã, vui lòng thử lại sau!');
        }
    }

    return (
        <>
            <Modal show={showUpdateEmail} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Cập nhật Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-verify">
                            <div className="border border-2 mb-2">
                                <Row>
                                    <Col xs={2}><i className="bi bi-envelope-at-fill fs-3 ms-4"></i></Col>
                                    <Col xs={10}>
                                        <div style={{ color: "#142239" }} className="fw-bold">Lấy mã xác nhận qua Email</div>
                                        <div className="fw-bold text-danger">Email: {userData?.email}</div>
                                    </Col>
                                </Row>
                            </div>
                            <Button style={{ width: "100%", background: "#142239" }} type="submit" onClick={() => { coolDownTime() }}
                                disabled={checkButton}>{checkButton ? timeLeft + 's' : 'Gửi mã'}</Button>
                        </div>
                        <Form.Group className="my-3">
                            <Form.Label>Mã xác nhận: <b className="text-danger">*</b></Form.Label>
                            <Form.Control type="email" placeholder="Mã OTP ######"
                                value={otpValue} onChange={(e) => setOtpValue(e.target.value)} />
                        </Form.Group>
                        <div className="form-change">
                            <Form.Group className="mt-3">
                                <Form.Label>Email mới: <b className="text-danger">*</b></Form.Label>
                                <Form.Control type="email" placeholder="Nhập email mới"
                                    value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>Hủy</Button>
                    <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default ModalUpdateEmail;