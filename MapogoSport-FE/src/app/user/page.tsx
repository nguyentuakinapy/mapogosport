'use client'
import { ReactNode, useRef, useState } from 'react'
import { Container, Row, Col, Nav, Collapse, Button } from 'react-bootstrap'
import './types/user.scss'
import Link from 'next/link'

export default function RootLayout({ children }: { children: ReactNode }) {
    const [openUser, setOpenUser] = useState(false)
    const [openLike, setOpenLike] = useState(false)
    const [openPurse, setOpenPurse] = useState(false)

    return (
        <div className="pb-5" style={{ background: "#f3f3f3" }}>
            <Container className='mt-4'>
                <Row>
                    <Col xs={12} md={3}>
                        <div className="bg-white">
                            <div className="text-center">
                                <div className="avatar-upload">
                                    <div className="avatar-edit">
                                        <input type="file" name="avatar" id="imageUpload"
                                            accept="image/jpeg, image/png" style={{ display: 'none' }} />
                                        <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                                    </div>

                                    <div className="avatar-preview">
                                        <div style={{ backgroundImage: `url("/images/avatar-init.gif")` }}></div>
                                    </div>
                                </div>
                                <div className="text-dark fw-bold mb-3">Nguyễn Phi Hùng</div>
                            </div>
                            <Nav className="flex-column">
                                <Nav.Link onClick={() => setOpenUser(!openUser)}
                                    aria-controls="collapse-user" aria-expanded={openUser} className="item">
                                    Quản lý tài khoản <i className={`bi bi-caret-${openUser ? 'down' : 'right'}-fill`}></i>
                                </Nav.Link>
                                <Collapse in={openUser}>
                                    <Nav className="flex-column ms-3">
                                        <Nav.Link as="div">
                                            <Link href="/user/profile">Thông tin cá nhân</Link>
                                        </Nav.Link>
                                        <Nav.Link as="div">
                                            <Link href="/user/address">Địa chỉ</Link>
                                        </Nav.Link>
                                        <Nav.Link as="div">
                                            <Link href="#">Đơn hàng của tôi</Link>
                                        </Nav.Link>
                                        <Nav.Link as="div">
                                            <Link href="#">Danh sách đặt sân</Link>
                                        </Nav.Link>
                                    </Nav>
                                </Collapse>
                                <Nav.Link
                                    onClick={() => setOpenLike(!openLike)}
                                    aria-controls="collapse-like"
                                    aria-expanded={openLike}
                                    className="item"
                                >
                                    Yêu thích
                                    <i className={`bi bi-caret-${openLike ? 'down' : 'right'}-fill`}></i>
                                </Nav.Link>
                                <Collapse in={openLike}>
                                    <Nav className="flex-column ms-3">
                                        <Nav.Link as="div">
                                            <Link href="#">Sân yêu thích</Link>
                                        </Nav.Link>
                                        <Nav.Link as="div">
                                            <Link href="#">Sản phẩm yêu thích</Link>
                                        </Nav.Link>
                                        <Nav.Link as="div">
                                            <Link href="#">Bình luận và đánh giá</Link>
                                        </Nav.Link>
                                    </Nav>
                                </Collapse>
                                <Nav.Link onClick={() => setOpenPurse(!openPurse)}
                                    aria-controls="collapse-purse" aria-expanded={openPurse} className="item">
                                    Ví và mã giảm giá <i className={`bi bi-caret-${openPurse ? 'down' : 'right'}-fill`}></i>
                                </Nav.Link>
                                <Collapse in={openPurse}>
                                    <Nav className="flex-column ms-3">
                                        <Nav.Link as="div">
                                            <Link href="#">Ví của bạn</Link>
                                        </Nav.Link>
                                        <Nav.Link as="div">
                                            <Link href="#">Phiếu giảm giá</Link>
                                        </Nav.Link>
                                    </Nav>
                                </Collapse>
                            </Nav>
                        </div>
                        <Button variant="danger" className='mt-2' style={{ width: "100%" }}>Đăng xuất</Button>
                    </Col>
                    <Col xs={12} md={9}>
                        {children}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
