'use client'
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Col, FloatingLabel, Form, Nav, Row } from "react-bootstrap";

export default function Owner({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<string>('all');

    const searchParams = useSearchParams();
    const check = searchParams.get('check');
    useEffect(() => {
        if (check === 'withdraw') {
            setActiveTab('withdraw');
        }
    }, [check]);

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return (
                    <div className="font-14">
                        <div style={{ fontSize: '14px' }}>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Floating className="mb-3">
                                        <Form.Control size="sm" type="text" placeholder="Họ và tên"
                                        />
                                        <Form.Label>Họ và tên <b className='text-danger'>*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>

                                <Row>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control size="sm" type="date" placeholder="Ngày sinh"
                                                />
                                                <Form.Label>Ngày sinh</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email:</Form.Label>
                                            <div>nguyentuakina@gmail.com<Link href="#" >(<i className="bi bi-pencil-square"></i> Cập nhật)</Link></div>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel controlId="district" label="Giới tính">
                                                <Form.Select aria-label="Floating label select example">
                                                    <option>-- Nhấn để chọn --</option>
                                                    <option value="1">Nam</option>
                                                    <option value="2">Nữ</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Số điện thoại</Form.Label>

                                            <div>
                                                Chưa có thông tin
                                                <Link href="#" >(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                                            </div>

                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Link href={"#"} className='btn btn-profile' type="submit" >
                                    <i className="bi bi-floppy2"></i> Lưu
                                </Link>
                            </Form>
                        </div>
                    </div>
                );
            case 'deposit':
                return (
                    <div className="font-14">
                        chưa biết có gì bên trong
                    </div>
                );
            default:
                return (
                    <div className="font-14">
                        Loading...
                    </div>
                );
        }
    };
    if (!children) {
        return (
            <>
                <div className="profile-header">
                    <div className="profile-info">
                        <h2>Nguyễn Tú Akina</h2>
                        <p>Thằng nào có tiền thì nạp vào DONATE cho tao</p>
                        <div className="stats">
                            <span>0 Bài Viết</span>
                            <span>0 Sân</span>
                            <span>0 Được thích</span>
                            <span>Gói cơ bản</span>
                        </div>
                    </div>
                </div>
                <div className="font-14">
                    <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="all" className="tab-link">Thông tin cá nhân</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="deposit" className="tab-link">Bài viết</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="withdraw" className="tab-link">Phân quyền</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="mt-3">
                        {renderContent()}
                    </div>
                </div>
            </>
        )
    }
    return (
        <>{children}</>
    )

}