import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface CancelBookingDetail {
    showCancelBooking: boolean;
    setShowCancelBooking: (v: boolean) => void;
    aBookingDetail: BookingDetailMap | null;
    bookingId?: number;
}

const CancelBookingDetailModal = (props: CancelBookingDetail) => {
    const { showCancelBooking, setShowCancelBooking, aBookingDetail, bookingId } = props;
    const [reason, setReason] = useState<string>("");
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleClose = () => {
        setShowCancelBooking(false);
    };

    const handleSave = async () => {
        if (!aBookingDetail) {
            console.error("Không tìm thấy booking");
            return;
        }
        const currentDateTime = new Date();
        const formattedTime = aBookingDetail.startTime.replace('h', ':').padStart(5, '0');
        const bookingDateTime = new Date(`${aBookingDetail.date}T${formattedTime}:00`);
        const diffMinutes = (bookingDateTime.getTime() - currentDateTime.getTime()) / (1000 * 60);

        let refundAmount = 0;

        if (reason === "Hủy bởi yêu cầu của khách hàng") {
            if (diffMinutes >= 120) {
                if (aBookingDetail.statusBooking === "Chờ thanh toán") {
                    refundAmount = aBookingDetail.price * (aBookingDetail.deposit / 100);
                } else {
                    refundAmount = aBookingDetail.price;
                }
            } else if (diffMinutes > 0) {
                if (aBookingDetail.statusBooking === "Chờ thanh toán") {
                    refundAmount = aBookingDetail.price * (aBookingDetail.deposit / 100) * 0.75;
                } else {
                    refundAmount = aBookingDetail.price * 0.75;
                }
            } else {
                refundAmount = 0;
            }
        } else {
            if (aBookingDetail.statusBooking === "Chờ thanh toán") {
                refundAmount = aBookingDetail.price * (aBookingDetail.deposit / 100);
            } else {
                refundAmount = aBookingDetail.price;
            }
        }

        await fetch(`${BASE_URL}rest/owner/bookingDetail/update`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingDetailId: aBookingDetail.bookingDetailId, status: "Đã hủy", refundAmount }),
        }).then((res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return;
            }
            mutate(`${BASE_URL}rest/user/booking/detail/${bookingId}`);
            mutate(`${BASE_URL}rest/user/booking/${bookingId}`);
            toast.success('Cập nhật thành công!');
            handleClose();
        });
    };

    return (
        <Modal show={showCancelBooking} onHide={() => handleClose()} centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title className="m-auto text-danger text-uppercase"><b>Lý do hủy sân</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <div>
                            {["Hủy bởi yêu cầu của khách hàng", "Hủy bởi chủ sân"].map((option, index) => (
                                <Form.Check key={index} type="radio" className="mb-3" id={`reason-${index}`}
                                    label={option} value={option} onChange={(e) => setReason(e.target.value)} checked={reason === option} />
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>Đóng</Button>
                <Button variant="danger" disabled={!reason} onClick={handleSave}>Xác nhận</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelBookingDetailModal;
