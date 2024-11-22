'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import LoginModal from './account/modal/login.modal';
import RegisterModal from './account/modal/register.modal';
import useSWR from 'swr';

import ForgotPassword from './account/modal/forgotPassword.modal';
import ChangePasswordNew from './account/modal/change-password-new.modal';
import { useData } from '@/app/context/UserContext';
import { logOut } from '@/app/utils/Log-Out';




const CartBadge = ({ username }: { username: string }) => {
    const [cartCount, setCartCount] = useState(0); // Initialize cart count to 0

    const fetcher = (url: string) => fetch(url).then((res) => res.json());


    const { data, error, isLoading } = useSWR(
        username == "" ? null : `http://localhost:8080/rest/cart/count/${username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        const cartCount = data; // assuming the API returns the count directly
        setCartCount(cartCount); // Update the cart count in the state
    }, [data])



    return (
        <span className="position-absolute ms-1 top-1 start-100 translate-middle badge rounded-pill bg-danger">
            {cartCount}
            <span className="visually-hidden">items in cart</span>
        </span>
    );
};

interface HeaderProps {
    setRefreshKey: (v: number) => void;
    refreshKey: number;
}

const Header = (props: HeaderProps) => {
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [showChangePasswordNew, setShowChangePasswordNew] = useState<boolean>(false);
    const { setRefreshKey, refreshKey } = props;

    const userData = useData();

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');

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

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Chạy một lần khi component được mount

    return (
        <main className='header-area' style={{ position: 'sticky', zIndex: '1001' }}>
            <Navbar expand="lg" style={{
                position: 'sticky', zIndex: '1001', backgroundColor: '#090e1e', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
            }}>
                <Container>
                    <Navbar><Link href={'/'} ><img src="/images/logo-black.png" style={{ width: '80px' }} alt="" /></Link></Navbar>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        {/* <Form className="d-flex m-auto">
                            <div className="input-group">
                                <input type="search" className='form-control border border-white ' placeholder="Tìm kiếm sân hoặc sản phẩm..." aria-label="Search"
                                    style={{ width: '300px' }} />
                                <Button variant="outline-light"><i className="bi bi-search"></i></Button>
                            </div>
                        </Form> */}
                        <Nav
                            className="ms-auto my-2 my-lg-0 d-flex justify-content-center align-items-center nav-home"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Link href="/blog" className='head-hv-nav text-decoration-none'><i className="bi bi-book-fill me-2"></i>Bài viết</Link>
                            <Link href="/categories/products" className='head-hv-nav text-decoration-none'><i className="bi bi-tools me-2"></i>Sản phẩm</Link>
                            <Link href="/categories/sport_field" className='head-hv-nav text-decoration-none'><i className="bi bi-trophy-fill me-2"></i>Sân thể thao</Link>
                            <div className="dropdown">
                                <span className="dropdown-toggle head-hv-nav text-decoration-none demo" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-person-fill me-2"></i>{userData ? userData?.fullname : 'Tài khoản'}
                                </span>
                                <ul className="dropdown-menu">
                                    <a className={`dropdown-item ${userData ? 'd-none' : ''}`} onClick={() => setShowLoginModal(true)} style={{ cursor: 'pointer' }} >Đăng nhập</a>
                                    <a className={`dropdown-item ${userData ? 'd-none' : ''}`} onClick={() => setShowRegisterModal(true)} style={{ cursor: 'pointer' }}>Đăng ký</a>
                                    {/* <a className={`dropdown-item ${userData ? 'd-none' : ''}`} data-bs-toggle="modal" data-bs-target="#changeEmail" style={{ cursor: 'pointer' }}>Thay đổi Email</a> */}
                                    {/* <a className={`dropdown-item ${userData ? 'd-none' : ''}`} data-bs-target="#changePassword" style={{ cursor: 'pointer' }}>Thay đổi mật khẩu</a> */}
                                    <a className={`dropdown-item ${userData ? 'd-none' : ''}`} onClick={() => setShowForgotPassword(true)} style={{ cursor: 'pointer' }}>Quên mật khẩu</a>
                                    {/* <hr className='m-0' /> */}
                                    <Link href='/user/profile' className={`dropdown-item text-decoration-none text-dark ${userData ? '' : 'd-none'}`}>Thông tin tài khoản</Link>
                                    {userData && userData.authorities.map((item, index) => {
                                        if (item.role.name === "ROLE_USER") {
                                            return null;
                                        }
                                        if (item.role.name === "ROLE_OWNER") {
                                            return (
                                                <a key={index} href='/owner' className={`dropdown-item text-decoration-none text-dark`}>Chủ sân</a>
                                            );
                                        }
                                        if (item.role.name === "ROLE_ADMIN") {
                                            return (
                                                <a key={index} href='/admin' className={`dropdown-item text-decoration-none text-dark`}>Quản trị viên</a>
                                            );
                                        } else if (item.role.name === "ROLE_STAFF") {
                                            return (
                                                <a key={index} href='/admin' className={`dropdown-item text-decoration-none text-dark`}>Nhân viên</a>
                                            );
                                        }
                                        return null;
                                    })}

                                    <a className={`dropdown-item ${userData ? '' : 'd-none'}`} onClick={() => logOut()} style={{ cursor: 'pointer' }}>Đăng xuất</a>
                                </ul>
                            </div>
                            <Nav className='position-relative'>
                                <Link href="/cart" className='head-hv-nav text-decoration-none'><i className="bi bi-cart me-2"></i>Giỏ hàng</Link>
                                <span className="position-absolute ms-1 top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                    0
                                    <span className="visually-hidden">unread messages</span>
                                </span>
                                {userData && <CartBadge username={userData.username} />}
                            </Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* <Navbar className="bg-body-secondary" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Container>
                    {categoryFields.map((categoryFields: CategoryField) => (
                        <Nav className='hv-nav' key={categoryFields.categoriesFieldId}>
                            <Link href="#" className="hv-link text-decoration-none">
                                {categoryFields.name}
                            </Link>
                        </Nav>
                    ))}
                </Container>
            </Navbar> */}
            <LoginModal setRefreshKey={setRefreshKey} refreshKey={refreshKey}
                showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}
                showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal}
                showForgotPassword={showForgotPassword} setShowForgotPassword={setShowForgotPassword}>
            </LoginModal>
            <RegisterModal setRefreshKey={setRefreshKey} refreshKey={refreshKey} showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal} showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}></RegisterModal>
            <ForgotPassword showForgotPassword={showForgotPassword} setShowForgotPassword={setShowForgotPassword}
                showChangePasswordNew={showChangePasswordNew} setShowChangePasswordNew={setShowChangePasswordNew}
            ></ForgotPassword>
            <ChangePasswordNew showChangePasswordNew={showChangePasswordNew} setShowChangePasswordNew={setShowChangePasswordNew} showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}></ChangePasswordNew>
        </main >
    );
}

export default Header;