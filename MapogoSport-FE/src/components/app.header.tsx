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
import axios from 'axios';
import useSWR from 'swr';

import ForgotPassword from './account/modal/forgotPassword.modal';
import ChangePasswordNew from './account/modal/change-password-new.modal';




const CartBadge = ({ username }: { username: string }) => {
    const [cartCount, setCartCount] = useState(0); // Initialize cart count to 0

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    // // Function to fetch the cart count
    // const countCartItem = async () => {
    //     if (!username) return; // Don't fetch if no user is logged in

    //     // const response = await axios.get(`http://localhost:8080/rest/cart/count/${username}`);
    // };
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

    // // Fetch cart count on component mount and when the user changes
    // useEffect(() => {
    //     countCartItem();
    // }, [username]);

    return (
        <span className="position-absolute ms-1 top-1 start-100 translate-middle badge rounded-pill bg-danger">
            {cartCount} {/* Display the cart count here */}
            <span className="visually-hidden">items in cart</span>
        </span>
    );
};

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [showChangePasswordNew, setShowChangePasswordNew] = useState<boolean>(false);
    const [categoryFields, setCategoryFields] = useState<CategoryField[]>([]);


    const [userData, setUserData] = useState<User | null>(null);

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

    // Fetch CategoryField

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reponse = await fetch('http://localhost:8080/rest/category_field')
                const data = await reponse.json();
                setCategoryFields(data)
            } catch (error) {
                console.log("Lỗi call Api rồi: ", error)
            }
        }
        fetchData();
    }, [])

    const [username, setUsername] = useState<string>("");
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsername(parsedUserData.username);
            // console.log(parsedUserData); // Kiểm tra dữ liệu
        }
    })

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        username == "" ? null : `http://localhost:8080/rest/user/${username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setUserData(data);
            console.log(data);
        }
    }, [data])

    const logOut = () => {
        sessionStorage.removeItem('user');
        window.location.href = "/";
    }

    return (
        <main className='header-area' style={{ position: 'sticky', zIndex: '1001' }}>
            <Navbar expand="lg" className='header-area bg-light' style={{ position: 'sticky', zIndex: '1001' }}>
                <Container>
                    <Navbar><Link href={'/'} ><img src="/images/logo.png" style={{ width: '100px' }} alt="" /></Link></Navbar>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Form className="d-flex m-auto">
                            <div className="input-group">
                                <input type="search" className='form-control border border-dark' placeholder="Tìm kiếm sân hoặc sản phẩm..." aria-label="Search"
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
                                <a href="/categories" className='head-hv-nav text-decoration-none '><i className="bi bi-tools me-2"></i>Sản phẩm</a>
                            </Nav>
                            <Nav>
                                <Link href="/product-detail" className='head-hv-nav text-decoration-none'><i className="bi bi-trophy me-2"></i>Sân thể thao</Link>
                            </Nav>
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
                                    <Link href='/owner' className={`dropdown-item text-decoration-none text-dark ${userData ? userData?.authorities[0].role.name == 'ROLE_OWNER' ? '' : 'd-none' : 'd-none'}`}>Chủ sân</Link>
                                    <Link href='/admin' className={`dropdown-item text-decoration-none text-dark ${userData ? userData?.authorities[0].role.name == 'ROLE_ADMIN' ? '' : 'd-none' : 'd-none'}`}>Admin</Link>
                                    <a className={`dropdown-item ${userData ? '' : 'd-none'}`} onClick={() => logOut()} style={{ cursor: 'pointer' }}>Đăng xuất</a>
                                </ul>
                            </div>
                            <Nav className='position-relative'>
                                <a href="/cart" className='head-hv-nav text-decoration-none'><i className="bi bi-cart me-2"></i>Giỏ hàng</a>
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
            <Navbar className="bg-body-secondary" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Container>
                    {categoryFields.map((categoryFields: CategoryField) => (
                        <Nav className='hv-nav' key={categoryFields.categoriesFieldId}>
                            <Link href="#" className="hv-link text-decoration-none">
                                {categoryFields.name}
                            </Link>
                        </Nav>
                    ))}
                </Container>
            </Navbar>
            <LoginModal
                showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}
                showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal}
                showForgotPassword={showForgotPassword} setShowForgotPassword={setShowForgotPassword}>
            </LoginModal>
            <RegisterModal showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal} showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}></RegisterModal>
            <ForgotPassword showForgotPassword={showForgotPassword} setShowForgotPassword={setShowForgotPassword}
                showChangePasswordNew={showChangePasswordNew} setShowChangePasswordNew={setShowChangePasswordNew}
            ></ForgotPassword>
            <ChangePasswordNew showChangePasswordNew={showChangePasswordNew} setShowChangePasswordNew={setShowChangePasswordNew}></ChangePasswordNew>
        </main >
    );
}

export default Header;