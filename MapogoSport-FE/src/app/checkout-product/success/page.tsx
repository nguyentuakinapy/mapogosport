'use client'

import { useEffect } from "react";
import { Button, Col, Modal, Table } from "react-bootstrap";

interface OrderProps {
    showOrderSuccessModal: boolean;
    setShowOrderSuccessModal: (v: boolean) => void;
    order: any;
}
const ModalOrderSuccess = (props: OrderProps) => {
    const { showOrderSuccessModal, setShowOrderSuccessModal,
        order
    } = props;

    useEffect(() => {
        if (order) {
            console.log("order: ", order);

        }
    }, [showOrderSuccessModal, order]);

    function handleClose() {
        setShowOrderSuccessModal(false);

    }
    return (
        <>
            <Modal show={showOrderSuccessModal} onHide={handleClose} size="xl" centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Cảm ơn bạn đã đặt hàng! <br />
                        Chúng tôi sẽ cố gắng giao hàng đến bạn sớm nhất có thể!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    cc
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalOrderSuccess;
