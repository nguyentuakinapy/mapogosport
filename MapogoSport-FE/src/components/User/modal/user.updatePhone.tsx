import { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface UserProps {
    showUpdatePhone: boolean;
    setShowUpdatePhone: (v: boolean) => void;
    userData: User | null;
}

const ModalUpdatePhone = (props: UserProps) => {
    const { showUpdatePhone, setShowUpdatePhone, userData } = props;
    const [otpValue, setOtpValue] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState(5);
    const [checkButton, setCheckButton] = useState<boolean>(false);
    const [newPhone, setNewPhone] = useState<string>("");
    const [page, setPage] = useState<boolean>(true);

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
        toast.success("Mã xác nhận đang được gửi về email!");
        const response = await fetch('http://localhost:8080/rest/user/sendMail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData?.email)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }

    const handleClose = () => {
        setShowUpdatePhone(false);
        setNewPhone('');
        setOtpValue('');
    }

    const handleSave = () => {
        if (!otpValue || !newPhone) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!")
            return;
        }
        fetch(`http://localhost:8080/rest/user/phoneNumber/${userData?.username}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{
                phoneNumber: { phoneNumber: newPhone }
            }]),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Thêm số điện thoại thành không thành công! Vui lòng thử lại sau!`);
                return
            }
            mutate(`http://localhost:8080/rest/user/${userData?.username}`);
            toast.success('Thêm số điện thoại thành công!');
            setPage(true);
        })
    }

    const handleDelete = (phoneNumberUserId: number) => {
        if (window.confirm('Bạn có chắc muốn xóa số điện thoại này?')) {
            fetch(`http://localhost:8080/rest/user/phoneNumber/${phoneNumberUserId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                }
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Xóa số điện thoại không thành công! Vui lòng thử lại sau!`);
                    return
                }
                mutate(`http://localhost:8080/rest/user/${userData?.username}`);
                toast.success('Xóa số điện thoại thành công!');
            })
        }
    }

    const handleUpdateActive = (phoneNumberUserId: number, activeState: boolean) => {
        fetch(`http://localhost:8080/rest/user/phoneNumber/${phoneNumberUserId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                active: activeState
            }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return
            }
            mutate(`http://localhost:8080/rest/user/${userData?.username}`);
            toast.success('Cập nhật thành công!');
        })
    };

    const handleClick = () => {
        setPage(false);
    }

    return (
        <Modal show={showUpdatePhone} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
            centered backdrop="static" keyboard={false}>
            {page ?
                <>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-uppercase text-danger">Danh sách số điện thoại</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button className="btn-profile mb-3 w-100" onClick={() => handleClick()}>
                            <i className="bi bi-plus-circle"></i> Thêm số điện thoại
                        </Button>
                        {userData && userData.phoneNumberUsers.length > 0 ?
                            userData.phoneNumberUsers.map(item => (
                                <div key={item.phoneNumberUserId} className="item-address" >
                                    <div className="item-left">
                                        <div><b>Số điện thoại:</b> {item.phoneNumber.phoneNumber}</div>
                                    </div>
                                    <div className="item-right">
                                        <div className="d-flex align-items-center">
                                            <OverlayTrigger overlay={<Tooltip>Chọn làm số mặc định?</Tooltip>}>
                                                <Form.Check type="switch" checked={item.active}
                                                    onChange={() => handleUpdateActive(item.phoneNumberUserId, !item.active)} />
                                            </OverlayTrigger>
                                            <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                                <div className="ms-4 btn-address" onClick={() => handleDelete(item.phoneNumberUserId)}>
                                                    <i className="bi bi-trash3-fill"></i>
                                                </div>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="item-address">Chưa có số điện thoại nào! Vui lòng thêm số điện thoại để trải nghiệm Website một cách hoàn hảo!</div>
                            )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose()}>Hủy</Button>
                        <Button style={{ backgroundColor: "#142239" }} onClick={handleClose}>Xác nhận</Button>

                    </Modal.Footer>
                </>
                :
                <>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-uppercase text-danger">Cập nhật số điện thoại</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Số điện thoại: <b className="text-danger">*</b></Form.Label>
                            <Form.Control type="email" placeholder="Nhập số điện thoại mới"
                                value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                        </Form.Group>
                        <InputGroup className="my-3">
                            <Form.Control type="email" placeholder="Mã OTP ######"
                                value={otpValue} onChange={(e) => setOtpValue(e.target.value)} />
                            <Button variant="btn btn-profile" onClick={() => { coolDownTime() }}
                                disabled={checkButton}>{checkButton ? timeLeft + 's' : 'Gửi mã'}</Button>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: "#142239" }} onClick={() => setPage(true)}>Quay lại</Button>
                        <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button>
                    </Modal.Footer>
                </>
            }
        </Modal >
    )
}

export default ModalUpdatePhone;