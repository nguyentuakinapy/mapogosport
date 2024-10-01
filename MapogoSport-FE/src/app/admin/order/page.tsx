'use client'
import Link from "next/link";
import { Form, Button, Table, Badge, Nav } from "react-bootstrap";
import '../adminStyle.scss';
import { useState } from "react";

const AdminOrder = () => {
    const [activeTab, setActiveTab] = useState<string>('all');

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return (
                    <div className="box-table-border mb-4">
                        <Table striped className="mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '120px' }}>Mã hóa đơn</th>
                                    <th style={{ width: '250px' }}>Họ và tên</th>
                                    <th>Ngày mua</th>
                                    <th>Tổng tiền</th>
                                    <th style={{ width: '300px' }}>Địa chỉ</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-start title">
                                        <Link href={"#"}>#1</Link>
                                    </td>
                                    <td>Nguyễn Phi Hùng</td>
                                    <td>30/9/2024</td>
                                    <td>100.000 ₫</td>
                                    <td className="title-brand">39/6, Nam Lân, Bà Điểm, Hóc Môn, Hồ Chí Minh</td>
                                    <td><Badge bg="badge-user">Đã hoàn thành</Badge></td>
                                    <td>
                                        <Link href="#">Xem</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                );
            case 'unpaid':
                return (
                    <div style={{ fontSize: '14px' }}>
                        cc1
                    </div>
                );
            case 'processing':
                return (
                    <div style={{ fontSize: '14px' }}>
                        chưa biết có gì bên trong
                    </div>
                );
            case 'shipping':
                return (
                    <div style={{ fontSize: '14px' }}>
                        chưa biết có gì bên trong
                    </div>
                );
            case 'cancel':
                return (
                    <div style={{ fontSize: '14px' }}>
                        chưa biết có gì bên trong
                    </div>
                );
            case 'complete':
                return (
                    <div style={{ fontSize: '14px' }}>
                        chưa biết có gì bên trong
                    </div>
                );
            default:
                return (
                    <div style={{ fontSize: '14px' }}>
                        chưa biết có gì bên trong
                    </div>
                );
        }
    };

    return (
        <div style={{ fontSize: '14px' }}>
            <div className="box-ultil">
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Hóa Đơn</b>
                <div>
                    <Form.Control type="text" placeholder="Tìm theo tên người dùng..." />
                </div>
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }}>Xuất File Excel</Button>
            </div>
            <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                <Nav.Item>
                    <Nav.Link eventKey="all" className="tab-link">Toàn bộ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="unpaid" className="tab-link">Chờ thanh toán</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="processing" className="tab-link">Đang xử lý</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="shipping" className="tab-link">Đang vận chuyển</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="cancel" className="tab-link">Đã hủy</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="complete" className="tab-link">Đã hoàn thành</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {renderContent()}
            </div>
        </div>
    )
}

export default AdminOrder;