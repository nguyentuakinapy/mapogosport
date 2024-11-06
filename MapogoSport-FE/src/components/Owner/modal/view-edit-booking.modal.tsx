import { formatPrice } from "@/components/Utils/Format";
import { use, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { safeMultipleDatesFormat } from "react-datepicker/dist/date_utils";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface OwnerProps {
    showViewOrEditBookingModal: boolean;
    setShowViewOrEditBookingModal: (v: boolean) => void;
    owner?: Owner;
    checkDataStatus: boolean
    setCheckDataStatus: (v: boolean) => void;
    startTimeKey: boolean;
    bookingDetailData?: BookingDetail;
    userData?: User;
    paymentMethod?: PaymentMethod
}

const BookingModal = (props: OwnerProps) => {
    const { showViewOrEditBookingModal, setShowViewOrEditBookingModal, paymentMethod
        , owner, checkDataStatus, setCheckDataStatus, startTimeKey, bookingDetailData, userData } = props;

    const [editBooking, setEditBooking] = useState<boolean>(true);
    const [dateBooking, setDateBooking] = useState<string>();
    const [startTimeBooking, setStartTimeBooking] = useState<string>();
    const [endTimeBooking, setEndTimeBooking] = useState<string>();
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        setDateBooking(bookingDetailData?.date);
        setStartTimeBooking(bookingDetailData?.startTime);
        setEndTimeBooking(bookingDetailData?.endTime);
    }, [bookingDetailData])

    const handleClose = () => {
        setEditBooking(true);
        setShowViewOrEditBookingModal(false);
    }


    return (
        <>
            <Modal show={showViewOrEditBookingModal} onHide={() => handleClose()} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">XEM VÀ CHỈNH SỬA THÔNG TIN ĐẶT SÂN </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin đặt - {bookingDetailData?.sportFieldDetail.name}
                                {bookingDetailData &&
                                    new Date().setHours(0, 0, 0, 0) <= new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                        new Date().getHours() <= parseInt(bookingDetailData.endTime.split('h')[0]) ? (
                                            <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                                <i
                                                    className="bi bi-pencil-square ms-2 text-dark"
                                                    onClick={() => setEditBooking(!editBooking)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </OverlayTrigger>
                                        ) : (
                                            new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                                <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                                    <i
                                                        className="bi bi-pencil-square ms-2 text-dark"
                                                        onClick={() => setEditBooking(!editBooking)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </OverlayTrigger>
                                            )
                                        )
                                    )}
                            </h6>
                            <FloatingLabel controlId="floatingDate" label="Ngày đặt!" className="flex-grow-1 mb-2">
                                <Form.Control
                                    type="date"
                                    placeholder="Ngày đặt!"
                                    value={dateBooking}
                                    onChange={(e) => setDateBooking(e.target.value)}
                                    min={today}
                                    disabled={editBooking}
                                />
                            </FloatingLabel>
                            <InputGroup>
                                <FloatingLabel controlId="floatingDate" label="Giờ bắt đầu!" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Giờ bắt đầu!"
                                        value={startTimeBooking}
                                        disabled={editBooking}
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingDate" label="Giờ kết thúc!" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Giờ kết thúc!"
                                        value={endTimeBooking}
                                        disabled={editBooking}
                                    />
                                </FloatingLabel>

                            </InputGroup>
                            <FloatingLabel controlId="floatingDate" label="Tổng tiền!" className="flex-grow-1 mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Giờ kết thúc!"
                                    value={formatPrice(bookingDetailData?.price)}
                                    disabled={editBooking}
                                />
                            </FloatingLabel>
                            {userData?.fullname == "Offline" && (
                                <FloatingLabel controlId="floatingUsername" label="Phương thức thanh toán *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        value={paymentMethod?.name}
                                        type="text"
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel>
                            )}
                        </Col>
                        {userData?.fullname != "Offline" && (
                            <Col>
                                <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</h6>
                                <FloatingLabel controlId="floatingUsername" label="Họ và tên *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        value={userData?.fullname}
                                        type="text"
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingUsername" label="Số điện thoại *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        type="text"
                                        value={userData?.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber}
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel> <FloatingLabel controlId="floatingUsername" label="Phương thức thanh toán *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        value={paymentMethod?.name}
                                        type="text"
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel>

                                {/* <FloatingLabel controlId="floatingSelectTime" label="Chọn thời gian" className="mb-2">
                                <Form.Select

                                    aria-label="Default select example"
                                >
                                    <option value="Chọn thời gian">Chọn thời gian</option>

                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingPaymentMethod" label="Phương thức thanh toán *">
                                <Form.Select
                                    aria-label="Default select example"
                                >
                                    <option value="0">Phương thức thanh toán *</option>

                                </Form.Select>
                            </FloatingLabel> */}
                            </Col>
                        )}
                        {bookingDetailData &&
                            new Date().setHours(0, 0, 0, 0) <= new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                new Date().getHours() <= parseInt(bookingDetailData.endTime.split('h')[0]) ? (
                                    !editBooking ? (
                                        <button className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                    ) :
                                        <button className="btn btn-danger m-auto" style={{ width: '97%' }}>Hủy đặt sân</button>

                                ) : (
                                    new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                        !editBooking ? (
                                            <button className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                        ) :
                                            <button className="btn btn-danger m-auto" style={{ width: '97%' }}>Hủy đặt sân</button>
                                    )
                                )
                            )}
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default BookingModal;