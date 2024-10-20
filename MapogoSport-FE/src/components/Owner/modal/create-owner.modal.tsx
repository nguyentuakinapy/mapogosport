import { useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";

interface OwnerProps {
    showCreateOwnerModal: boolean;
    setShowCreateOwnerModal: (v: boolean) => void;
}

const CreateOwnerModal = (props: OwnerProps) => {
    const { showCreateOwnerModal, setShowCreateOwnerModal } = props;

    const [username, setUsername] = useState<string>();
    
    const handleClose = () => {
        setShowCreateOwnerModal(false);
    }

    const handleSave = () => {
        toast.success(username)
        // handleClose();
    }

    return (
        <>
            <Modal show={showCreateOwnerModal} onHide={() => handleClose()} size="xl" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">ĐĂNG KÝ TÀI KHOẢN CHỦ SÂN</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="my-3" style={{ fontSize: '15px' }}>
                        <Col xs={4}>
                            <div className="card packageUpdate">
                                <b className="ms-3 mt-3 fs-5">Gói miễn phí</b>
                                <div className="body-package my-3">
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Miễn phí một khu vực sân.
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Giới hạn 15 lượt đặt sân mỗi tháng.
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                    </div>
                                </div>
                                <b className="text-danger ms-3">Miễn phí</b>
                                <Button className='btn-sub'>Đăng ký ngay</Button>
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div className="card packageUpdate">
                                <b className="ms-3 mt-3 fs-5">Gói cơ bản</b>
                                <div className="body-package my-3">
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Hai khu vực sân.
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Không giới hạn lượt đặt sân mỗi tháng.
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                    </div>
                                </div>
                                <b className="text-danger ms-3">100.000đ / 1 tháng</b>
                                <Button className='btn-sub'>Đăng ký ngay</Button>
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div className="card packageUpdate">
                                <b className="ms-3 mt-3 fs-5">Gói nâng cao</b>
                                <div className="body-package my-3">
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Năm khu vực sân.
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Không giới hạn lượt đặt sân mỗi tháng.
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Được tạo giải đấu và đăng bài viết về sân.
                                    </div>
                                </div>
                                <b className="text-danger ms-3">200.000đ / 1 tháng</b>
                                <Button className='btn-sub'>Đăng ký ngay</Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Hủy
                    </Button>
                    {/* <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button> */}
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default CreateOwnerModal;