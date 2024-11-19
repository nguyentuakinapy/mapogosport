import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface CancelOrderModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (reason: string) => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ show, onHide, onConfirm }) => {
    const [reason, setReason] = useState<string>("");  // Lý do đã chọn
    const [otherReason, setOtherReason] = useState<string>("");  // Lý do khác

    const handleConfirm = () => {
        if (reason.trim()) {
            if (reason === 'Lý do khác') {
                onConfirm(`Lý do khác: ${otherReason}`);
            } else {
                onConfirm(reason);
            }
            setReason("");  // Reset lý do đã chọn
            setOtherReason("");  // Reset lý do khác
            onHide();  // Đóng modal
        } else {
            alert("Vui lòng nhập lý do hủy đơn hàng!");  // Thông báo nếu không có lý do
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Vui lòng chọn lý do hủy đơn hàng!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <div>
                            {["Thay đổi ý định mua hàng", "Sản phẩm không đáp ứng kỳ vọng", "Thời gian giao hàng quá lâu", "Đã mua ở nơi khác", "Lý do khác"].map((option, index) => (
                                <Form.Check
                                    key={index}
                                    type="radio" className="mb-3"
                                    id={`reason-${index}`}
                                    label={option}
                                    value={option}
                                    name="cancelReason"
                                    onChange={(e) => setReason(e.target.value)}  // Cập nhật lý do khi chọn radio
                                    checked={reason === option}  // Kiểm tra nếu lựa chọn khớp với lý do
                                />
                            ))}
                        </div>

                        {/* Nếu chọn "Lý do khác" thì hiển thị ô nhập lý do */}
                        {reason === "Lý do khác" && (
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Vui lòng nhập lý do..."
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}  // Cập nhật lý do khi chọn radio
                            />
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    Xác nhận hủy
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelOrderModal;
