'use client'
import Link from 'next/link';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    useEffect(() => {
        // Kiểm tra nếu đang chạy ở phía client
        if (typeof window !== 'undefined') {
            const handleScroll = () => {
                const header = document.querySelector('.header-area');
                const main = document.querySelector('.main-area') as HTMLElement | null;
                const scrollPosition = window.scrollY;

                if (scrollPosition > 230) {
                    header?.classList.add('sticky-header');
                    if (main) {
                        main.style.marginTop = '20px';
                    }
                } else {
                    header?.classList.remove('sticky-header');
                    if (main) {
                        main.style.marginTop = '0px';
                    }
                }
            };

            // Lắng nghe sự kiện scroll khi component được mount
            window.addEventListener('scroll', handleScroll);

            // Dọn dẹp sự kiện khi component bị unmount
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []); // Chỉ chạy một lần khi component được mount

    return (
        <main className='header-area' style={{ position: 'sticky', zIndex: '1001' }}>
            <Navbar expand="lg" className='header-area bg-light' style={{ position: 'sticky', zIndex: '1001' }}>
                <Container>
                    <Navbar><Link href={'/'} ><img src="/images/logo.png" style={{ width: '100px' }} alt="" /></Link></Navbar>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Form className="d-flex m-auto">
                            <div className="input-group">
                                <input type="search" className='form-control' placeholder="Tìm kiếm sân hoặc sản phẩm..." aria-label="Search"
                                    style={{ width: '300px' }} />
                                <Button variant="outline-dark"><i className="bi bi-search"></i></Button>
                            </div>
                        </Form>
                        <Nav
                            className="ms-auto my-2 my-lg-0 d-flex justify-content-center align-items-center"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav>
                                <Link href="#" className='head-hv-nav text-decoration-none'><i className="bi bi-tools me-2"></i>Sản phẩm</Link>
                            </Nav>
                            <Nav>
                                <Link href="#" className='head-hv-nav text-decoration-none'><i className="bi bi-trophy me-2"></i>Sân thể thao</Link>
                            </Nav>
                            <NavDropdown title={<><span className='head-hv-nav text-decoration-none demo'><i className="bi bi-person-fill me-2"></i>Tài khoản</span></>} id="navbarScrollingDropdown">
                                <NavDropdown.Item data-bs-toggle="modal" data-bs-target="#loginModal">Đăng nhập</NavDropdown.Item>
                                <NavDropdown.Item data-bs-toggle="modal" data-bs-target="#registerModal">
                                    Đăng ký
                                </NavDropdown.Item>
                                <NavDropdown.Item data-bs-toggle="modal" data-bs-target="#changeEmail">
                                    Thay đổi Email
                                </NavDropdown.Item>
                                <NavDropdown.Item data-bs-toggle="modal" data-bs-target="#changePassword">
                                    Thay đổi Password
                                </NavDropdown.Item>
                                <NavDropdown.Item data-bs-toggle="modal" data-bs-target="#forgotModal">
                                    Quên mật khẩu
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item>
                                    <Link href={'/user/profile'} className='text-decoration-none text-dark'>Thông tin tài khoản</Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Link href={'/owner'} className='text-decoration-none text-dark'>Chủ sân</Link>
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav className='position-relative'>
                                <Link href="/cart" className='head-hv-nav text-decoration-none'><i className="bi bi-cart me-2"></i>Giỏ hàng</Link>
                                <span className="position-absolute ms-1 top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                    0
                                    <span className="visually-hidden">unread messages</span>
                                </span>
                            </Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Navbar className="bg-body-secondary" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Container>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Bóng đá
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Cầu lông
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Pickleball
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Bóng bàn
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Bóng rổ
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Tenis
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Bóng chuyền
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Golf
                        </Link>
                    </Nav>

                </Container>
            </Navbar>
        </main>
    );
}

export default Header;