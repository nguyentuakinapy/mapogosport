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
    sport?: SportField;

}

const BookingModal = (props: OwnerProps) => {
    const { showViewOrEditBookingModal, setShowViewOrEditBookingModal, paymentMethod, sport
        , owner, checkDataStatus, setCheckDataStatus, startTimeKey, bookingDetailData, userData } = props;

    const [editBooking, setEditBooking] = useState<boolean>(true);
    const [dateBooking, setDateBooking] = useState<string>();
    const [idSportDetail, setIdSportDetail] = useState<number>();
    const [startTimeBooking, setStartTimeBooking] = useState<string>();
    const [endTimeBooking, setEndTimeBooking] = useState<string>();
    const today = new Date().toISOString().split("T")[0];


    useEffect(() => {
        setDateBooking(bookingDetailData?.date);
        setStartTimeBooking(bookingDetailData?.startTime);
        setEndTimeBooking(bookingDetailData?.endTime);
        setIdSportDetail(bookingDetailData?.sportFieldDetail.sportFielDetailId);
    }, [bookingDetailData])

    const handleCancelBookingDetail = () => {

        fetch(`http://localhost:8080/rest/booking/update/status/${bookingDetailData?.bookingDetailId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Hủy sân không thành công!`);
                return
            }
            setCheckDataStatus(!checkDataStatus);
            handleClose();
            toast.success('Hủy sân thành công!');
        })
    }

    const changeTime = (option: boolean, checkTime: boolean, time?: string) => {
        const timeStart = time && time.match(/(\d+)h(\d+)/);
        const startHours = timeStart ? Number(timeStart[1]) : 0;
        const startMinutes = timeStart ? Number(timeStart[2]) : 0;

        const today = new Date();
        const hourToday = today.getHours();
        const minuteToday = today.getMinutes() >= 30 ? 30 : 0;

        const timeOpen = sport && sport.opening.match(/(\d+)h(\d+)/);
        const hourOpen = timeOpen ? Number(timeOpen[1]) : 0;
        const minuteOpen = timeOpen ? Number(timeOpen[2]) : 0;

        const timeClose = sport && sport.closing.match(/(\d+)h(\d+)/);
        const hourClose = timeClose ? Number(timeClose[1]) : 0;
        const minuteClose = timeClose ? Number(timeClose[2]) : 0;

        const checkDay = dateBooking && new Date().setHours(0, 0, 0, 0) === new Date(dateBooking).setHours(0, 0, 0, 0);

        const timeBookingStart = startTimeBooking && startTimeBooking.match(/(\d+)h(\d+)/);
        const timeBookingEnd = endTimeBooking && endTimeBooking.match(/(\d+)h(\d+)/);

        if (option && time) {
            if (checkTime) {
                if (hourClose == startHours && minuteClose == startMinutes) {
                    toast.success("Vượt quá thời gian đóng cửa!")
                } else if (timeBookingStart && timeBookingEnd &&
                    (Number(timeBookingStart[1]) * 60 + Number(timeBookingStart[2]))
                    == (Number(timeBookingEnd[1]) * 60 + Number(timeBookingEnd[2]) - 30)) {
                    toast.success("Thời gian đặt cách nhau tối thiểu 30 phút!")
                } else {
                    setStartTimeBooking(increaseTime(time))
                }
            } else {
                if (hourClose == startHours && minuteClose == startMinutes) {
                    toast.success("Vượt quá thời gian đóng cửa!")
                } else {
                    setEndTimeBooking(increaseTime(time))
                }
            }
        } else if (time) {
            if (checkTime) {
                if (checkDay && startHours === hourToday && minuteToday === startMinutes) {
                    toast.success("Vượt quá thời gian cần đặt hiện tại!")
                } else if (hourOpen == startHours && minuteOpen == startMinutes) {
                    toast.success("Vượt quá thời gian mở cửa!")
                } else {
                    setStartTimeBooking(reduceTime(time))
                }
            } else {
                if (timeBookingStart && timeBookingEnd &&
                    (Number(timeBookingStart[1]) * 60 + Number(timeBookingStart[2]) + 30)
                    == (Number(timeBookingEnd[1]) * 60 + Number(timeBookingEnd[2]))) {
                    toast.success("Thời gian đặt cách nhau tối thiểu 30 phút!")
                } else {
                    setEndTimeBooking(reduceTime(time))
                }
            }
        }

    };

    const reduceTime = (timeBooking: string): string => {
        const getTime = timeBooking.match(/(\d+)h(\d+)/);
        let hours = getTime ? Number(getTime[1]) : 0;
        let minutes = getTime ? Number(getTime[2]) : 0;

        // Decrement by 30 minutes
        if (minutes === 0) {
            minutes = 30;
            hours = hours > 0 ? hours - 1 : 23; // Wrap to previous hour or day
        } else {
            minutes = 0;
        }
        return `${hours}h${minutes === 0 ? '00' : '30'}`;
    };

    const increaseTime = (timeBooking: string): string => {
        const getTime = timeBooking.match(/(\d+)h(\d+)/);
        let hours = getTime ? Number(getTime[1]) : 0;
        let minutes = getTime ? Number(getTime[2]) : 0;

        // Increment by 30 minutes
        if (minutes === 0) {
            minutes = 30;
        } else {
            minutes = 0;
            hours = hours < 23 ? hours + 1 : 0; // Wrap to next hour or day
        }
        return `${hours}h${minutes === 0 ? '00' : '30'}`;
    };


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
                                        new Date().getHours() < parseInt(bookingDetailData.endTime.split('h')[0]) ? (
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
                            <FloatingLabel controlId="floatingSelectTime" label="Chọn thời gian" className="mb-2">
                                <Form.Select
                                    value={idSportDetail}
                                    disabled={editBooking}

                                    onChange={(e) => setIdSportDetail(Number(e.target.value))}
                                    aria-label="Default select example"
                                >
                                    {sport && sport.sportFielDetails.map((item, index) => (
                                        <option key={index} value={item.sportFielDetailId}>{item.name}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
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
                                {!editBooking && (
                                    <>
                                        <Button disabled={editBooking} onClick={() => changeTime(false, true, startTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-up"></i>
                                        </Button>
                                        <Button disabled={editBooking} onClick={() => changeTime(true, true, startTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-down"></i>
                                        </Button>
                                    </>
                                )}
                                <FloatingLabel controlId="floatingDate" label="Giờ kết thúc!" className="ms-2 flex-grow-1 mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Giờ kết thúc!"
                                        value={endTimeBooking}
                                        disabled={editBooking}
                                    />
                                </FloatingLabel>
                                {!editBooking && (
                                    <>
                                        <Button disabled={editBooking} onClick={() => changeTime(false, false, endTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-up"></i>
                                        </Button>
                                        <Button disabled={editBooking} onClick={() => changeTime(true, false, endTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-down"></i>
                                        </Button>
                                    </>
                                )}
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
                                new Date().getHours() < parseInt(bookingDetailData.endTime.split('h')[0]) ? (
                                    !editBooking ? (
                                        <button className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                    ) :
                                        <button className="btn btn-danger m-auto" onClick={() => handleCancelBookingDetail()} style={{ width: '97%' }}>Hủy đặt sân</button>

                                ) : (
                                    new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                        !editBooking ? (
                                            <button className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                        ) :
                                            <button className="btn btn-danger m-auto" onClick={() => handleCancelBookingDetail()} style={{ width: '97%' }}>Hủy đặt sân</button>
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