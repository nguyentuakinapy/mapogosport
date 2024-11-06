import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface OrderProps {
    showModal: boolean;
    setShowModal: (v: boolean) => void;
    orderId: number | null; // orderId có thể là null nếu không có đơn hàng nào được chọn
    onHide: () => void; // Hàm đóng modal
}

const MyVerticallyCenteredModal = ({ showModal, setShowModal, orderId, onHide }: OrderProps) => {
    const [dataOrderDetail, setDataOrderDetail] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (orderId) { // Chỉ gọi API khi orderId không phải null
                try {
                    const response = await axios.get(`http://localhost:8080/rest/user/orders/detail/${orderId}`);
                    setDataOrderDetail(response.data);
                } catch (error) {
                    console.error('Error fetching order details:', error);
                }
            }
        };
        fetchData();
    }, [orderId]); // Thêm orderId vào dependency array để gọi lại khi orderId thay đổi

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
                            <div key={detail.orderDetailId}>
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
