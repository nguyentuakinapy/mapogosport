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
        window.location.href = "/";
    }
    function handleChange() {
        setShowOrderSuccessModal(false);
        window.location.href = `/user/orders/detail/${orderId}`;
    }

    return (
        <>
            <Modal show={showOrderSuccessModal} onHide={handleClose} centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-danger fw-bold m-auto">Cảm ơn bạn đã đặt hàng!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <span style={{
                        fontSize: '16px'
                    }}>Chúng tôi sẽ cố gắng giao hàng đến bạn sớm nhất có thể!</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                    <Button variant=""
                        style={{
                            backgroundColor: '#142239',
                            color: 'white'
                        }}
                        onClick={handleChange}>Xem hóa đơn</Button>
                </Modal.Footer >
            </Modal >
        </>
    );
};

export default ModalOrderSuccess;
