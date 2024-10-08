'use client'
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Nav, Row } from "react-bootstrap";

export default function Owner({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<string>('all');

    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [username, setUsername] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [gender, setGender] = useState<string>("0");
    const [check, setCheck] = useState<boolean>(false);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUserData(parsedUserData);
            setUsername(parsedUserData.username);
            setFullName(parsedUserData.fullname);
            setGender(parsedUserData.gender); // Cập nhật giới tính
            setIsLoading(true);
        }
    }, []);


    useEffect(() => {
        console.log(gender)
        setCheck(true);
    }, [gender]);

    const searchParams = useSearchParams();
    const checkData = searchParams.get('check');
    useEffect(() => {
        if (checkData === 'withdraw') {
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
                                            value={fullName} onChange={(e) => setFullName(e.target.value)}
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
                                            <div>{userData?.username}<Link href="#" >(<i className="bi bi-pencil-square"></i> Cập nhật)</Link></div>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Giới tính">
                                                <select value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                    className="form-control">
                                                    <option value="0">-- Chọn giới tính --</option>
                                                    <option value="Nam">Nam</option>
                                                    <option value="Nữ">Nữ</option>
                                                    <option value="Khác">Khác</option>
                                                </select>
                                            </FloatingLabel>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Sổ địa chỉ</Form.Label>

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
            case 'withdraw':
                return (
                    <Row className="my-3" style={{ fontSize: '15px' }}>
                        <Col xs={4}>
                            <div className="card packageUpdate">
                                <b className="ms-3 mt-3 fs-5">Gói cơ bản</b>
                                <div className="body-package my-3">
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                </div>
                                <b className="text-danger ms-3">Miễn phí</b>
                                <Button className='btn-sub'>Sửa</Button>
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div className="card packageUpdate">
                                <b className="ms-3 mt-3 fs-5">Gói cơ bản</b>
                                <div className="body-package my-3">
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                </div>
                                <b className="text-danger ms-3">Miễn phí</b>
                                <Button className='btn-sub'>Sửa</Button>
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div className="card packageUpdate">
                                <b className="ms-3 mt-3 fs-5">Gói cơ bản</b>
                                <div className="body-package my-3">
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                    <div >
                                        <i className="bi bi-check-circle me-2">OKE</i>
                                    </div>
                                </div>
                                <b className="text-danger ms-3">Miễn phí</b>
                                <Button className='btn-sub'>Sửa</Button>
                            </div>
                        </Col>
                    </Row>
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
                        <h2>{userData?.fullname}</h2>
                        <p>Chào mừng bạn đến với hệ thống quản lý dành cho chủ sân của MapogoSport</p>
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
                            <Nav.Link eventKey="withdraw" className="tab-link">Gói nâng cấp</Nav.Link>
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