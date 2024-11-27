'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import LoginModal from './account/modal/login.modal';
import RegisterModal from './account/modal/register.modal';
import useSWR from 'swr';

import ForgotPassword from './account/modal/forgotPassword.modal';
import ChangePasswordNew from './account/modal/change-password-new.modal';
import { useData } from '@/app/context/UserContext';
import { logOut } from '@/app/utils/Log-Out';
import { formatTimeNoDate } from './Utils/Format';
import './userStyle.scss'
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';


const CartBadge = ({ username }: { username: string }) => {
    const [cartCount, setCartCount] = useState(0); // Initialize cart count to 0

    const fetcher = (url: string) => fetch(url).then((res) => res.json());


    const { data } = useSWR(
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

    // Của QA 26/11
    const [hideNotification, setHideNotification] = useState<boolean>(false);
    const [notification, setNotification] = useState<NotificationUser[]>();
    const [checkNotification, setCheckNotification] = useState<number>(1);
useEffect(() => {
    if (userData) {
        getNotification(userData.username)
    }
}, [userData, checkNotification]);

const getNotification = async (username: string) => {
    const response = await fetch(`http://localhost:8080/rest/user/findByUser_UsernameContainingAndTypeContaining/${username}/notifyMess`);
    if (!response.ok) return;
    const notification = await response.json() as NotificationUser[];
    setNotification(notification);
}
useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws'); // Địa chỉ endpoint WebSocket
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        // stompClient.subscribe('/topic/notification/username', (message) => {
        //     toast.success("Bạn vừa có thông báo mơí!")
        //     setCheckNotification(prev => prev + 1);
        // });

        // chạy được chức năng đã đọc cập nhật lại liền được
        stompClient.subscribe('/topic/notification/isRead', (message) => {
            if (message.body === localStorage.getItem('username')) {
                setCheckNotification(prev => prev + 1);
                getNotification(message.body);
            }
        });

        // stompClient.subscribe('/topic/username', (message) => {
        //     if (message.body === localStorage.getItem('username')) {
        //         toast.success("Bạn vừa có thông báo mơí!")
        //     }
        //     getNotification(message.body);
        // });

      

        stompClient.subscribe('/topic/notification/username', (message) => {
            if (message.body === localStorage.getItem('username')) {
                // toast.success("Bạn vừa có thông báo mới! nè cậu");
                setCheckNotification(prev => prev + 1);
                getNotification(message.body);
            }
        });

        // chạy được chức năng đã đọc all cập nhật lại liền được
        stompClient.subscribe('/topic/notification/isReadAll/username', (message) => {
            if (message.body === localStorage.getItem('username')) {
                setCheckNotification(prev => prev + 1);
                getNotification(message.body);
            }
        });
        // đccc
        stompClient.subscribe('/topic/notification/delete/username', (message) => {
            if (message.body === localStorage.getItem('username')) {
                setCheckNotification(prev => prev + 1);
                getNotification(message.body);
            }
        });
    });

    return () => {
        stompClient.disconnect();
    };
}, []);

  const handleIsReadNotification = (notificationId: number) => {
    fetch(`http://localhost:8080/rest/user/notification/is/read/${notificationId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    }).then(async (res) => {
        if (!res.ok) {
            toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
            return
        }
    })
}


const handleViewNotification = (username: string) => {
    fetch(`http://localhost:8080/rest/user/notification/setViewNotificationTypeNotifyMess/${username}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    }).then(async (res) => {
        if (!res.ok) {
            toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
            return;
        }
      
    }).catch((error) => {
        toast.error(`Đã xảy ra lỗi khi cập nhật thông báo: ${error.message}`);
    });
}

const handleDeleteNotification = (username: string) => {
    fetch(`http://localhost:8080/rest/user/notification/deleteNotificationHaveTypeNotifyMess/${username}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    }).then(async (res) => {
        if (!res.ok) {
            toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
            return
        }
        toast.success('Cập nhật thành công!');
    })
}



    
    //

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
                           
<Nav className="d-flex align-items-center">

<Nav.Item className="position-relative">
  <Link
    href="#"
    passHref
    onClick={(e) => {
      e.preventDefault(); // Ngừng hành động mặc định của thẻ <a>
      setHideNotification(!hideNotification);
    }}
    className='head-hv-nav text-decoration-none '
  >
    <span
    className='fw-bold text-light'>
      <i className="bi bi-bell-fill me-1" style={{ fontSize: 'large' }} />
     Thông báo
    </span>
  </Link>


  <span  onClick={() => setHideNotification(!hideNotification)}
   className="position-absolute translate-middle badge rounded-pill bg-danger">
    {notification ? notification.filter(item => !item.isRead).length : 0}
     <span className="visually-hidden">unread messages</span>
    </span>

  <div className={`notification ${hideNotification ? 'd-block' : 'd-none'}`}>
    <div className="d-flex align-items-center">
      <h4 className="fw-bold text-danger">Thông báo</h4>
      <i
        onClick={() => {
          userData && handleDeleteNotification(userData.username);
        }}
        style={{ cursor: 'pointer', fontSize: '28px' }}
        className="ms-auto bi bi-trash3-fill"
      ></i>
    </div>
    <button
      onClick={() => {
        userData && handleViewNotification(userData.username);
      }}
      style={{ backgroundColor: '#142239' }}
      className="btn w-100 ms-auto mb-2"
    >
      Đánh dấu tất cả là đã đọc
    </button>

    {notification && notification.length > 0 ? (
      notification
        .sort((a, b) => b.notificationId - a.notificationId)
        .map((item) => (
          <div
            key={item.notificationId}
            className="box-comment-container mb-2"
            style={{
              backgroundColor: item.isRead ? '#f5f5f5' : '#142239',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <Link
               onClick={() => handleIsReadNotification(item.notificationId)}
                href='#'
                className="box-comment"
                style={{
                  fontSize: '15px',
                  color: item.isRead ? 'black' : undefined,
                }}
              >
                <b>{item.title}</b>
                <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                  <div>{item.message}</div>
                  <div className="ms-auto">{formatTimeNoDate(new Date( item.createdAt))}</div>
                </div>
              </Link>
            </div>
          </div>
        ))
    ) : (
      <div className="my-5 text-center">
        <b>BẠN CHƯA CÓ THÔNG BÁO NÀO</b>
      </div>
    )}
  </div>
</Nav.Item>

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