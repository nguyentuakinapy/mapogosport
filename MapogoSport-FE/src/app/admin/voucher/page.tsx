'use client'
import Link from "next/link";
import { Badge, Button, Nav, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import '../adminStyle.scss';
import { useState } from "react";
import VoucherAddNew from "@/components/Admin/Modal/voucher.addNew";

const VoucherPage = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [showAddVoucher, setShowAddVoucher] = useState<boolean>(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return (
                    <div className="box-table-border mb-4">
                        <Table striped className="mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th style={{ width: '250px' }}>Code</th>
                                    <th>Giảm</th>
                                    <th>Số lượng</th>
                                    <th>Ngày tạo</th>
                                    <th>Hết hạn</th>
                                    <th>Trạng thái</th>
                                    <th>Người tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td className="text-start title">CodeNek</td>
                                    <td>10%</td>
                                    <td>10</td>
                                    <td>30/9/2024</td>
                                    <td>1/10/2024</td>
                                    <td><Badge bg="badge-user">Đang hoạt động</Badge></td>
                                    <td>admin1</td>
                                    <td>
                                        <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                            <Link className="btn-edit me-3" href={"#"}><i className="bi bi-pencil-square"></i></Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                            <Link className="btn-edit" href={"#"}><i className="bi bi-trash3"></i></Link>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                );
            case 'activited':
                return (
                    <div style={{ fontSize: '14px' }}>
                        cc1
                    </div>
                );
            case 'expired':
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
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={() => setShowAddVoucher(true)}>
                    <i className="bi bi-plus-circle me-2"></i>Tạo Voucher
                </Button>
            </div>
            <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                <Nav.Item>
                    <Nav.Link eventKey="all" className="tab-link">Toàn bộ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="activited" className="tab-link">Đang hoạt động</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="expired" className="tab-link">Đã hết hạn</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {renderContent()}
            </div>
            <VoucherAddNew showAddVoucher={showAddVoucher} setShowAddVoucher={setShowAddVoucher} />
        </div>
    )
}

export default VoucherPage;