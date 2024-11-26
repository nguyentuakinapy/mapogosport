import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface OrderProps {
    showModal: boolean;
    setShowModal: (v: boolean) => void;
    orderId: number | null; // orderId can be null if no order is selected
    onHide: () => void; // Function to close modal
}

const MyVerticallyCenteredModal = ({ showModal, orderId, onHide }: OrderProps) => {
    const [dataOrderDetail, setDataOrderDetail] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (orderId) { // Call API only when orderId is not null
                try {
                    const response = await axios.get(`http://localhost:8080/rest/order-detail-by-order/${orderId}`);
                    setDataOrderDetail(response.data);
                } catch (error) {
                    console.error('Error fetching order details:', error);
                }
            }
        };
        fetchData();
    }, [orderId]); // Add orderId to dependency array to re-fetch when it changes

    return (
        <Modal
            show={showModal}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thông tin đơn hàng
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Thông tin chi tiết</h4>
                {dataOrderDetail.length > 0 ? (
                    <ul>
                        {dataOrderDetail.map((detail, index) => (
                            <div key={index}>
                                <p>Sản phẩm: {detail.productDetailSize.productDetail.product.name}</p>
                                <p>Số Lượng: {detail.quantity}</p>
                                <p>Size: {detail.productDetailSize.size.sizeName}</p>
                                <p>Màu: {detail.productDetailSize.productDetail.color}</p>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>Không có chi tiết đơn hàng.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MyVerticallyCenteredModal;
