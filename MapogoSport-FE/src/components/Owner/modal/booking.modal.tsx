import { useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";

interface OwnerProps {
    showBookingModal: boolean;
    setShowBookingModal: (v: boolean) => void;
    sportDetail?: SportFieldDetail;
    timeStart: string;
    dayStartBooking: string;
    sport?: SportField;
}

const ModalAddAddress = (props: OwnerProps) => {
    const { showBookingModal, setShowBookingModal, sportDetail, timeStart, dayStartBooking, sport } = props;

    const [username, setUsername] = useState<string>();
    const handleClose = () => {
        setShowBookingModal(false);
    }

    const handleSave = () => {
        toast.success(username)
        // handleClose();
    }

    return (
        <>
            <Modal show={showBookingModal} onHide={() => handleClose()} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">đặt Sân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin {sportDetail && sportDetail.name}</h6>
                            <ul>
                                <li><span className="fw-bold">Giá đặt sân / 1h:</span> {sportDetail && sportDetail.price}.</li>
                                <li><span className="fw-bold">Giá đặt sân giờ vàng / 1h:</span> {sportDetail && sportDetail.peakHourPrices}.</li>
                                <li><span className="fw-bold">Giờ vàng:</span> {sportDetail && sportDetail.peakHour}.</li>
                                <li><span className="fw-bold">Kích thước sân:</span> {sportDetail && sportDetail.size}.</li>
                                <li><span className="fw-bold">Trạng thái:</span> {sport && sport.status}.</li>
                                <li><span className="fw-bold">Địa chỉ:</span> {sport && sport.address}.</li>
                            </ul>
                        </Col>
                        <Col>
                            <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</h6>
                            <Form.Group className="mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Vui long nhập tên đăng nhập!"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <select
                                className="form-select mb-2" aria-label="Default select example">
                                <option value="0">Chọn giờ đặt *</option>
                                <option value="0">1h</option>
                                <option value="1">1h30p</option>
                            </select>
                            <select
                                className="form-select" aria-label="Default select example">
                                <option value="0">Phương thức thanh toán *</option>
                                <option value="0">1h</option>
                                <option value="1">1h30p</option>
                            </select>
                        </Col>
                    </Row>
                    <h6 className="text-uppercase text-danger fw-bold text-center my-2">Thông tin đặt sân</h6>
                    <Row>
                        <Col className="px-5 text-center">
                            <span><b> Ngày đặt: </b>{dayStartBooking}. </span><br />
                            <span><b> Giờ bắt đầu: </b>{timeStart}. </span><br />
                            <span><b> Giờ kết thúc: </b>{timeStart}.</span>
                        </Col>
                        <Col className="px-5 text-center">
                            <span><b>Đơn giá: </b> <em className="text-danger">120000đ</em>. </span><br />
                            <span><b>Tổng tiền: </b><em className="text-danger">200000đ</em>. </span><br />
                        </Col>
                    </Row>
                    <Form.Group className="mt-3 px-4">
                        <Form.Control as="textarea" rows={3}
                            type="text"
                            placeholder="Ghi chú!"
                        // value={username}
                        // onChange={(e) => setUsername(e.target.value)}
                        />
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

export default ModalAddAddress;