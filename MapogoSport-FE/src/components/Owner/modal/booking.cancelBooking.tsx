import { useData } from "@/app/context/UserContext";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface CancelBooking {
    showCancelBooking: boolean;
    setShowCancelBooking: (v: boolean) => void;
    booking: BookingFindAll | null;
}

const CancelBookingModal = (props: CancelBooking) => {
    const { showCancelBooking, setShowCancelBooking, booking } = props;
    const [reason, setReason] = useState<string>("");
    const user = useData();

    const handleClose = () => {
        setShowCancelBooking(false);
    };

    const handleSave = () => {
        if (!booking) {
            console.error("Không tìm thấy booking");
            return;
        }
        const startedDetails = booking.bookingDetails.filter(detail => detail.bookingDetailStatus !== "Chưa bắt đầu");
        const notStartedDetails = booking.bookingDetails.filter(detail => detail.bookingDetailStatus === "Chưa bắt đầu");

        const subtract = startedDetails.reduce((total, detail) => total + Number(detail.price || 0), 0);

        const currentDateTime = new Date();
        const formattedTime = notStartedDetails[0]?.startTime.replace('h', ':').padStart(5, '0');
        const bookingDateTime = new Date(`${notStartedDetails[0]?.bookingDetailDate}T${formattedTime}:00`);

        const diffMinutes = (bookingDateTime.getTime() - currentDateTime.getTime()) / (1000 * 60);

        const refundAmount = booking.totalAmount * (booking.percentDeposit / 100);

        let finalAmount = 0;
        if (reason === "Hủy bởi yêu cầu của khách hàng") {
            if (diffMinutes >= 120) {
                if (booking.status === "Chờ thanh toán") {
                    finalAmount = refundAmount - subtract * (booking.percentDeposit / 100);
                } else {
                    finalAmount = booking.totalAmount - subtract;
                }
            } else {
                if (booking.status === "Chờ thanh toán") {
                    finalAmount = (refundAmount - subtract * (booking.percentDeposit / 100)) * 0.75;
                } else {
                    finalAmount = (booking.totalAmount - subtract) * 0.75;
                }
            }
        } else {
            if (booking.status === "Chờ thanh toán") {
                finalAmount = refundAmount - subtract * (booking.percentDeposit / 100);
            } else {
                finalAmount = booking.totalAmount - subtract;
            }
        }

        fetch(`http://localhost:8080/rest/owner/booking/update`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingId: booking.bookingId, status: "Đã hủy", refundAmount: finalAmount, note: reason }),
        }).then((res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return;
            }
            mutate(`http://localhost:8080/rest/owner/booking/findAll/${user?.username}`);
            mutate(`http://localhost:8080/rest/user/booking/detail/${booking.bookingId}`);
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

export default CancelBookingModal;
