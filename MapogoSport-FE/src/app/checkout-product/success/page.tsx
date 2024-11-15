'use client'

import OrdersDetail from "@/app/user/orders/detail/[id]/page";
import { formatPrice } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import useSWR from "swr";

interface OrderProps {
    showOrderSuccessModal: boolean;
    setShowOrderSuccessModal: (v: boolean) => void;
    order1: any | undefined;
    orderId: number;
}
const ModalOrderSuccess = (props: OrderProps) => {
    const { showOrderSuccessModal, setShowOrderSuccessModal, order1, orderId } = props;
    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [order, setOrder] = useState<Order>();

    const fetchOrderDetails = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/rest/order-detail-by-order/${id}`);
            const data = await response.json();
            setOrderDetails(data);
        } catch (err) {
            console.error("Error fetching order details:", err);
        }
    };

    useEffect(() => {
        if (order1) {
            setOrder(order1);
            fetchOrderDetails(order1?.orderId);
        }
    }, [order1, showOrderSuccessModal]);

    useEffect(() => {
        const fetchOrder = async () => {
            console.log("Fetching order with ID:", orderId);
            try {
                const response = await fetch(`http://localhost:8080/rest/order/getByOrderId/${orderId}`);
                const data = await response.json();
                setOrder(data);
                console.log("Fetched data:", data);
            } catch (err) {
                console.error("Error fetching order:", err);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    console.log("order: ", order);  


    function handleClose() {
        setShowOrderSuccessModal(false);
        window.location.href = "http://localhost:3000";
    }
    return (
        <>
            <Modal show={showOrderSuccessModal} onHide={handleClose} size="xl" centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger fw-bold">Cảm ơn bạn đã đặt hàng! <br />
                        Chúng tôi sẽ cố gắng giao hàng đến bạn sớm nhất có thể!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col className="bill-booking">
                        <Row>
                            <Col xs={6}>
                                <span className="text-secondary fw-bold me-2">Họ tên:</span>
                                <b>{order?.user?.fullname}</b>
                                <br /> <br />
                                <span className="text-secondary mb-3 fw-bold me-2">Địa chỉ:</span>
                                <b>{order?.address}</b>
                            </Col>
                            <Col xs={6}>
                                <span className="text-secondary mb-2 fw-bold me-2">Số điện thoại</span>
                                <b>{order?.phoneNumber}</b>
                                <br /> <br />
                                <span className="text-secondary mb-2 fw-bold me-2">Ngày đặt</span>
                                <b>{new Date(order?.date).toLocaleDateString('en-GB')}</b>
                            </Col>
                        </Row>
                        <Table className="my-3">
                            <thead>
                                <tr>
                                    <th className="text-secondary">STT</th>
                                    <th className="text-secondary">Sản phẩm</th>
                                    <th className="text-secondary">Giá</th>
                                    <th className="text-secondary">Số lượng</th>
                                    <th className="text-secondary">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails && orderDetails.map((orderDetail, index: number) => (
                                    <tr key={orderDetail?.orderDetailId}>
                                        {/* <td>{new Date(order?.date).toLocaleDateString('en-GB')}</td> */}
                                        <td>{index + 1}</td>
                                        <td>{orderDetail?.productDetailSize?.productDetail?.product?.name}</td>
                                        <td>{formatPrice(orderDetail?.productDetailSize?.price)}</td>
                                        <td>{orderDetail?.quantity}</td>
                                        <td>{formatPrice(orderDetail?.productDetailSize?.price * orderDetail?.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                        <footer>
                            <span className="text-secondary mb-2 fw-bold me-2">Tổng cộng: </span>
                            <b>{formatPrice(order?.amount)}</b>
                        </footer>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalOrderSuccess;
