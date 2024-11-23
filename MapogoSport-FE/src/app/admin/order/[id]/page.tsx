'use client'
import Link from "next/link";
import { Table, Image, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import useSWR from "swr";

const OrderDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/user/orders/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [orderDetail, setOrderDetail] = useState<OrderDetailMap[]>([]);
    const [orderInfo, setOrderInfo] = useState<any>(null);

    useEffect(() => {
        if (data) {
            setOrderDetail(data.orderDetails);
            setOrderInfo({
                fullname: data.fullname,
                phoneNumber: data.phoneNumber,
                address: data.address,
                status: data.status
            });
        }
    }, [data]);

    const totalAmount = orderDetail.reduce((sum: number, order: any) => {
        return sum + (order.productPrice * order.quantity);
    }, 0);

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <>
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
                                                <Image src={`${detail.productImage}`} width={"15%"} className="mx-2"></Image>
                                                {detail.productName}
                                            </Link>
                                        </td>
                                        <td>{detail.productColor}</td>
                                        <td>{detail.productPrice.toLocaleString()} ₫</td>
                                        <td>{detail.quantity}</td>
                                        <td>{(detail.productPrice * detail.quantity).toLocaleString()} ₫</td>
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
                <Row className='item-address'>
                    <Col xs={12} md={5}>
                        <p><i className="bi bi-person-vcard"></i> <b>Họ và tên: </b>{orderInfo?.fullname}</p>
                        <p><i className="bi bi-telephone-fill"></i> <b>Số điện thoại:</b> {orderInfo?.phoneNumber}</p>
                    </Col>
                    <Col xs={12} md={7}>
                        <p><i className="bi bi-geo-alt-fill"></i> <b>Địa chỉ: </b>{orderInfo?.address || "Chưa cập nhật địa chỉ"}</p>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default OrderDetail;