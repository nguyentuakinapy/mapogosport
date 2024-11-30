'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Table, Image, Row, Col, Button } from "react-bootstrap";
import '../../../types/user.scss';
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import CancelOrderModal from "../../CancelOrderModal";
import { toast } from "react-toastify";

type OrderInfo = {
    fullname: string,
    phoneNumber: string,
    address: string,
    status: string
}

const OrdersDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/user/orders/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [orderDetail, setOrderDetail] = useState<OrderDetailMap[]>([]);
    const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

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

    // const handleStatusChange = () => {
    //     fetch(`http://localhost:8080/rest/admin/order/update`, {
    //         method: 'PUT',
    //         headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ orderId: Number(params.id), status: "Đã hủy" }),
    //     }).then(async (res) => {
    //         if (!res.ok) {
    //             toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
    //             return;
    //         }
    //         mutate(`http://localhost:8080/rest/user/orders/detail/${params.id}`);
    //         toast.success('Cập nhật thành công!');
    //     });
    // };

    const totalAmount = orderDetail.reduce((sum: number, order: any) => {
        return sum + (order.productPrice * order.quantity);
    }, 0);

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;


    const handleCancelOrder = (reason: string) => {
        console.log("Lý do hủy:", reason);
        fetch(`http://localhost:8080/rest/order/cancel`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: params.id, status: "Đã hủy", reason: reason }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Hủy đơn hàng không thành công! Vui lòng thử lại sau!`);
                return;
            }
            mutate(`http://localhost:8080/rest/user/orders/detail/${params.id}`);
            toast.success('Hủy đơn hàng thành công!');

        });
    };

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
            {orderInfo?.status === 'Đã hoàn thành' ? (
                <div className="btn-layout"><Button className="btn-buyAgain">Tiếp tục mua hàng</Button></div>
            ) : orderInfo?.status === 'Đã hủy' ? (
                <div className="btn-layout"><Button className="btn-buyAgain">Mua lại</Button></div>
            ) : <div className="btn-layout"><Button className="btn-cancel" disabled={orderInfo?.status === "Đang vận chuyển"}
                onClick={() => setShowCancelModal(true)} >Hủy đơn hàng</Button></div>}
            <CancelOrderModal
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
            />
        </UserLayout>
    )
}

export default OrdersDetail;