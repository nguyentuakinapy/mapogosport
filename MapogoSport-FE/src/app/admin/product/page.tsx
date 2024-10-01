'use client'
import Link from "next/link";
import { Row, Col, Form, Button, Table, Badge, Image, OverlayTrigger, Tooltip, Nav } from "react-bootstrap";
import '../adminStyle.scss';
import { useState } from "react";
import ProductAddNew from "@/components/Admin/Modal/product.addNew";

const AdminProduct = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [showAddProduct, setShowAddProduct] = useState<boolean>(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return (
                    <div className="box-table-border mb-4">
                        <Table striped className="mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th style={{ width: '300px' }}>Tên sản phẩm</th>
                                    <th>Ngày cập nhật</th>
                                    <th>Trạng thái</th>
                                    <th>Loại</th>
                                    <th style={{ width: '200px' }}>Hãng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td className="text-start title">
                                        <Link href={"#"}>
                                            <Image src="/images/ck3.jpg" width={"15%"} className="mx-2"></Image>
                                            Crusader King 3 - Royal Edition
                                        </Link>
                                    </td>
                                    <td>30/09/2024</td>
                                    <td><Badge bg="badge-user">Còn hàng</Badge></td>
                                    <td>Bóng đá</td>
                                    <td className="title-brand">Paradox Interactive</td>
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
            case 'inStock':
                return (
                    <div style={{ fontSize: '14px' }}>
                        cc1
                    </div>
                );
            case 'outStock':
                return (
                    <div style={{ fontSize: '14px' }}>
                        chưa biết có gì bên trong
                    </div>
                );
            default:
                return (
                    <div style={{ fontSize: '14px' }}>
                        Đang tải...
                    </div>
                );
        }
    }
    return (
        <div style={{ fontSize: '14px' }}>
            <div className="box-ultil">
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Sản Phẩm</b>
                <div>
                    <Form.Control type="text" placeholder="Tìm theo tên sản phẩm..." />
                </div>
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={() => setShowAddProduct(true)}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm Sản Phẩm
                </Button>
            </div>
            <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                <Nav.Item>
                    <Nav.Link eventKey="all" className="tab-link">Toàn bộ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="inStock" className="tab-link">Còn hàng</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="outStock" className="tab-link">Hết hàng</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {renderContent()}
            </div>
            <ProductAddNew showAddProduct={showAddProduct} setShowAddProduct={setShowAddProduct} />
        </div>
    )
}

export default AdminProduct;