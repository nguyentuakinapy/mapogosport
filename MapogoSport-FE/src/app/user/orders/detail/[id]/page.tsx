'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Table, Image, Row, Col } from "react-bootstrap";
import '../../../types/user.scss';

const OrdersDetail = () => {
    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Chi tiết đơn hàng</b>
            <div className="my-3">
                <div className="box-table-border">
                    <Table striped className="mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: '500px' }}>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="detail-order">
                            <tr>
                                <td className="text-start title">
                                    <Link href={"#"}>
                                        <Image src="/images/ck3.jpg" width={"15%"} className="mx-2"></Image>
                                        Crusader Kings III 3 Royal Edition
                                    </Link>
                                </td>
                                <td>1.918.573 ₫</td>
                                <td>1</td>
                                <td>1.918.573 ₫</td>
                            </tr>
                            <tr className="total-money">
                                <td colSpan={3}>Tổng thành tiền</td>
                                <td>1.918.573 ₫</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
            <b className='text-danger' style={{ fontSize: '20px' }}>Địa chỉ nhận hàng</b>
            <div className='p-3' style={{ fontSize: '15px' }}>
                <Row className='item-address'>
                    <Col xs={12} md={5}>
                        <p><i className="bi bi-person-vcard"></i> <b>Họ và tên: </b>Nguyễn Phi Hùng</p>
                        <p><i className="bi bi-telephone-fill"></i> <b>Số điện thoại:</b> 0963861480</p>
                    </Col>
                    <Col xs={12} md={7}>
                        <p><i className="bi bi-envelope-at-fill"></i> <b>Email: </b>phihung.devka@gmail.com</p>
                        <p><i className="bi bi-geo-alt-fill"></i> <b>Địa chỉ: </b>39/6, Nam Lân, Xã Bà Điểm, Huyện Hóc Môn, Hồ Chí Minh</p>
                    </Col>
                </Row>
            </div>
        </UserLayout>
    )
}

export default OrdersDetail;