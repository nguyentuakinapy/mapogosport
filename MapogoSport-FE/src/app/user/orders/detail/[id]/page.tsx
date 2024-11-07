'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Table, Image, Row, Col, Button } from "react-bootstrap";
import '../../../types/user.scss';
import { useEffect, useState } from "react";
import useSWR from "swr";

const OrdersDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/user/orders/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([]);
    const [order, setOrder] = useState<OrderMap | null>(null);

    useEffect(() => {
        if (data) {
            setOrderDetail(data);
        }
    }, [data]);

    useEffect(() => {
        const selectedOrder = sessionStorage.getItem('selectedOrder');
        if (selectedOrder) {
            const parsedOrder = JSON.parse(selectedOrder) as OrderMap;
            setOrder(parsedOrder);
        }
    }, []);

    const totalAmount = orderDetail.reduce((sum: number, order: any) => {
        return sum + (order.productDetailSize.price * order.quantity);
    }, 0);

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Chi tiết đơn hàng</b>
            <div className="my-3">
                <div className="box-table-border">
                    <Table striped className="mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: '400px' }}>Tên sản phẩm</th>
                                <th>Màu</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="detail-order">
                            {orderDetail.length > 0 && (
                                orderDetail.map((detail) => (
                                    <tr key={detail.orderDetailId}>
                                        <td className="text-start title">
                                            <Link href={"#"}>
                                                <Image src={`${detail.productDetailSize.productDetail.product.image}`} width={"15%"} className="mx-2"></Image>
                                                {detail.productDetailSize.productDetail.product.name}
                                            </Link>
                                        </td>
                                        <td>{detail.productDetailSize.productDetail.color}</td>
                                        <td>{detail.productDetailSize.price.toLocaleString()} ₫</td>
                                        <td>{detail.quantity}</td>
                                        <td>{(detail.productDetailSize.price * detail.quantity).toLocaleString()} ₫</td>
                                    </tr>
                                ))
                            )}
                            <tr className="total-money">
                                <td colSpan={4}>Tổng thành tiền</td>
                                <td>{totalAmount.toLocaleString()} ₫</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
            <b className='text-danger' style={{ fontSize: '20px' }}>Địa chỉ nhận hàng</b>
            <div className='p-3' style={{ fontSize: '15px' }}>
                <Row className='item-order'>
                    <Col xs={12} md={5}>
                        <p><i className="bi bi-person-vcard"></i> <b>Họ và tên: </b>{order?.fullname}</p>
                        <p><i className="bi bi-telephone-fill"></i> <b>Số điện thoại:</b> {order?.phoneNumber}</p>
                    </Col>
                    <Col xs={12} md={7}>
                        <p><i className="bi bi-geo-alt-fill"></i> <b>Địa chỉ: </b>{order?.address || "Chưa cập nhật địa chỉ"}</p>
                    </Col>
                </Row>
            </div>
            {order?.status === 'Đã hoàn thành' ? (
                <div className="btn-layout"><Button className="btn-buyAgain">Tiếp tục mua hàng</Button></div>
            ) : order?.status === 'Đã hủy' ? (
                <div className="btn-layout"><Button className="btn-buyAgain">Mua lại</Button></div>
            ) : <div className="btn-layout"><Button className="btn-cancel">Hủy hóa đơn</Button></div>}
        </UserLayout>
    )
}

export default OrdersDetail;