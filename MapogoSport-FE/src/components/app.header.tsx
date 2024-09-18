'use client'
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
    return (
        <>
            <Navbar expand="lg" >
                <Container>
                    <Navbar.Brand href="#"><img src="/images/logo.png" style={{ width: '100px' }} alt="" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Form className="d-flex m-auto">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                style={{ width: '300px' }}
                            />
                            <Button variant="outline-dark"><i className="bi bi-search"></i></Button>
                        </Form>
                        <Nav
                            className="ms-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="#" className='head-hv-nav'>
                                <i className="bi bi-tools me-2"></i> Dụng cụ
                            </Nav.Link>
                            <Nav.Link href="#" className='head-hv-nav'>
                                <i className="bi bi-trophy me-2"></i>Sân thể thao
                            </Nav.Link>
                            <NavDropdown title={<><Link href="#" className='head-hv-nav text-decoration-none'><i className="bi bi-person me-2"></i>Tài khoản</Link></>} id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action5">
                                    Something else here
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#" className='head-hv-nav'>
                                <i className="bi bi-cart me-2"></i>
                                Giỏ hàng
                            </Nav.Link>
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
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Gym
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Bơi
                        </Link>
                    </Nav>
                    <Nav className='hv-nav'>
                        <Link href="#" className="hv-link text-decoration-none">
                            Thiết kế & thi công
                        </Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;