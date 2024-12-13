import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import React from 'react';
import useSWR from 'swr';

interface OrderProps {
    showModal: boolean;
    setShowModal: (v: boolean) => void;
    orderId: number | null; // orderId can be null if no order is selected
    onHide: () => void; // Function to close modal
}

const MyVerticallyCenteredModal = ({ showModal, orderId, onHide }: OrderProps) => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const { data } = useSWR<OrderDetail[]>(`${BASE_URL}rest/order-detail-by-order/${orderId}`, fetcher);

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
                {data && data.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Size</th>
                                <th>Màu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((detail, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{detail.productDetailSize.productDetail.product.name}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.productDetailSize.size.sizeName}</td>
                                    <td>{detail.productDetailSize.productDetail.color}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
