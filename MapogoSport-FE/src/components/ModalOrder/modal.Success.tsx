'use client'
import { Button, Modal } from "react-bootstrap";

interface OrderProps {
    showOrderSuccessModal: boolean;
    setShowOrderSuccessModal: (v: boolean) => void;
    orderId?: number;
}
const ModalOrderSuccess = (props: OrderProps) => {
    const { showOrderSuccessModal, setShowOrderSuccessModal, orderId } = props;

    function handleClose() {
        setShowOrderSuccessModal(false);
        window.location.href = "http://localhost:3000";
    }
    function handleChange() {
        setShowOrderSuccessModal(false);
        window.location.href = `http://localhost:3000/user/orders/detail/${orderId}`;
    }

    return (
        <>
            <Modal show={showOrderSuccessModal} onHide={handleClose} size="xl" centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger fw-bold">Cảm ơn bạn đã đặt hàng! <br />
                        Chúng tôi sẽ cố gắng giao hàng đến bạn sớm nhất có thể!</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                    <Button variant="success" onClick={handleChange}>Xem hóa đơn</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalOrderSuccess;
