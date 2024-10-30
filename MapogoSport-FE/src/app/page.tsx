'use client'
import { Container, Carousel, Row, Col, Image, Button } from "react-bootstrap";
import { useEffect, useState } from 'react';
import HomeLayout from "@/components/HomeLayout";
import Link from "next/link";
import './user/types/user.scss'
import { formatPrice } from "@/components/Utils/Format";
import CreateOwnerModal from "@/components/Owner/modal/create-owner.modal";
import LoginModal from "@/components/account/modal/login.modal";
import { toast } from "react-toastify";
import RegisterModal from "@/components/account/modal/register.modal";
import ForgotPassword from "@/components/account/modal/forgotPassword.modal";
import ChangePasswordNew from "@/components/account/modal/change-password-new.modal";
import Popup from "@/components/User/modal/popup-voucher.modal";
import useSWR from "swr";

export default function Home() {
  const [rating, setRating] = useState<number>(1.5);
  const [sportFields, setSportFields] = useState<SportField[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [userData, setUserData] = useState<User>();

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [showChangePasswordNew, setShowChangePasswordNew] = useState<boolean>(false);
  const [showCreateOwnerModal, setShowCreateOwnerModal] = useState<boolean>(false);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5; // Kiểm tra nếu có nửa sao
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    }
    if (halfStar) {
      stars.push(<i key={fullStars} className="bi bi-star-half"></i>);
    }
    // Thêm sao trống
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
    return stars;
  };

  // Hiển thị khu vực sân
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/rest/sport_field');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setSportFields(data);
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };

    fetchData();
  }, []);

  // Fetch base product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/rest/products');
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.log("Lỗi khi gọi API: ", error);
      }
    };
    fetchData();
  }, []);

  const createOwnerSubmit = () => {
    const user = sessionStorage.getItem('user');
    if (user) {
      setShowCreateOwnerModal(true);
    } else {
      toast.warning("Bạn chưa đăng nhập, vui lòng đăng nhập hoặc đăng ký tài khoản!")
      setShowLoginModal(true);
    }

  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/rest/voucher/active`);
        const data = await response.json();
        setVouchers(data)
        console.log("voucher", data)
      } catch (error) {
        console.log("lỗi voucher", error)
      }
    }
    fetchData()
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
    }
  }, [data])

  const [hasOwnerRole, setHasOwnerRole] = useState(false);

  useEffect(() => {
    const authorities = userData?.authorities || [];
    const ownerRoleExists = authorities.some(item => item.role.name === "ROLE_OWNER");
    setHasOwnerRole(ownerRoleExists);
  }, [userData]);

  return (
    <HomeLayout>
      <div style={{
        minHeight: '500px',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/bannerSport.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div
          style={{
            width: '300px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            outline: 'none',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <input type="text" />
          <button></button>
        </div>
      </div>

      <Container className="pt-3">
        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item" data-bs-interval="2000">
              <img src="/images/bannerSport.png" className="d-block w-100" alt="..." />
              <Link href={'/categories/sport_field'} style={{
                position: 'absolute',
                top: '70%',
                left: '13%',
                transform: 'translate(-50%, -50%)',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '50px',
                zIndex: '1000'
              }} className="btn btn-danger">
                ĐẶT SÂN NGAY
              </Link>
            </div>
            <div className="carousel-item active" data-bs-interval="2000">
              <img src="/images/registerowner.png" className="w-100" alt="" />
              {hasOwnerRole ? (
                <a style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '50px',
                }} className="btn btn-danger" href="/owner">
                  QUẢN LÝ NGAY
                </a>
              ) : (
                <button style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '50px',
                }} className="btn btn-danger" onClick={() => createOwnerSubmit()}>
                  ĐĂNG KÝ NGAY
                </button>
              )}
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        {/*  */}
        <div className="row mt-2">
          <div className="col">
            <img src="https://img.thegioithethao.vn/media/banner/banner_gio_vang.png" className="w-100" alt="" />
          </div>
          <div className="col">
            <img src="https://img.thegioithethao.vn/media/banner/thi-cong-cai-tao.png" className="w-100" alt="" />
          </div>
        </div>
        {/* Deal hot cho bạn */}
        <div>
          <h3 className="text-center fw-bold mt-5">DEAL HOT CHO BẠN</h3>
          <div className="row">
            <div className="col">
              <img src="https://img.thegioithethao.vn/media/icon/thi-cong-cai-tao.webp" className="w-100" alt="" />
            </div>
            <div className="col">
              <img src="https://img.thegioithethao.vn/media/icon/thi-cong-cai-tao.webp" className="w-100" alt="" />
            </div>
            <div className="col">
              <img src="https://img.thegioithethao.vn/media/icon/thi-cong-cai-tao.webp" className="w-100" alt="" />
            </div>
            <div className="col">
              <img src="https://img.thegioithethao.vn/media/icon/thi-cong-cai-tao.webp" className="w-100" alt="" />
            </div>
          </div>
        </div>
        {/* Sale sốc */}
        <div>
          <h3 className="text-center fw-bold mt-5">SALE SỐC</h3>
          <div style={{ fontSize: '15px' }}>
            <Row className="my-3">
              <Col xs={4}>
                <div className="user-border">
                  <div className="mb-3">
                    <Link href={"#"}>
                      <Image src={"/images/ck3.jpg"} alt="Tên sản phẩm" />
                    </Link>
                  </div>
                  <div className="content">
                    <div className="mb-1 title">
                      <Link href={"#"}><b>Crusader King 3 - Royal Edition</b></Link>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div><b className="text-danger">Giá:</b> <b>1.000.000 ₫</b></div>
                      <div className="star-item text-warning">
                        {renderStars(rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="user-border">
                  <div className="mb-3">
                    <Link href={"#"}>
                      <Image src={"/images/ck3.jpg"} alt="Tên sản phẩm" />
                    </Link>
                  </div>
                  <div className="content">
                    <div className="mb-1 title">
                      <Link href={"#"}><b>Crusader King 3 - Royal Edition</b></Link>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div><b className="text-danger">Giá:</b> <b>1.000.000 ₫</b></div>
                      <div className="star-item text-warning">
                        {renderStars(rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="user-border">
                  <div className="mb-3">
                    <Link href={"#"}>
                      <Image src={"/images/ck3.jpg"} alt="Tên sản phẩm" />
                    </Link>
                  </div>
                  <div className="content">
                    <div className="mb-1 title">
                      <Link href={"#"}><b>Crusader King 3 - Royal Edition</b></Link>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div><b className="text-danger">Giá:</b> <b>1.000.000 ₫</b></div>
                      <div className="star-item text-warning">
                        {renderStars(rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        {/* Sân thể thao mới */}

        <div>
          <div className="row a-more">
            <h3 className="fw-bold col-10">SÂN THỂ THAO MỚI</h3>
            <div className="col-2 text-end">
              <a href="/categories/sport_field" className="see-more-link">Xem Thêm</a>
            </div>
          </div>
          <div style={{ fontSize: '15px' }}>
            <Row className="my-3">
              {sportFields.slice(0, 8).map((field: SportField) => (
                <Col xs={3} key={field.sportFieldId}>
                  <div className="user-border">
                    <div className="mb-3">
                      <Link href={"#"}>
                        <Image src={`/images/${field.image}`} alt={field.name} />
                      </Link>
                    </div>
                    <div className="content">
                      <div className="mb-1 title">
                        <Link href={"#"}><b>{field.name}</b></Link>
                      </div>
                      <div className="address mb-1">
                        <span className="me-2">Khu vực:</span>{field.address}
                        <span className="mx-2">-</span>Hồ Chí Minh
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>Số sân: {field.quantity}</div>
                        <div className="star-item text-warning">
                          {renderStars(rating)}
                        </div>
                      </div>
                      <Link href={`/sport-detail/${field.sportFieldId}`} className="btn btn-user mt-2">Đặt sân</Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* {sportFields.length > 8 && (
              <div className="text-end">
                <Link href="/more-sports" className="btn btn btn-dark">Xem thêm<i className="bi bi-chevron-compact-right"></i></Link>
              </div>
            )} */}
          </div>
        </div>
        {/* Sản phẩm mới */}
        <div>
          <div className="row a-more">
            <h3 className="fw-bold col-10">SẢN PHẨM MỚI</h3>
            <div className="col-2 text-end">
              <a href="/categories/products" className="see-more-link">Xem Thêm</a>
            </div>
          </div>
          <div style={{ fontSize: '15px' }}>
            <Row className="my-3">
              {products.slice(0, 8).map((product: Product) => (
                <Col xs={3} key={product.productId}>
                  <div className="user-border">
                    <div className="mb-3">
                      <Link href={"#"}>
                        <Image src={"/images/ck3.jpg"} alt={product.name} />
                      </Link>
                    </div>
                    <div className="content">
                      <div className="mb-1 title">
                        <Link href={"#"}><b>{product.name}</b></Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div> <b>{formatPrice(product.price)}</b></div>
                        <div className="star-item text-warning">
                          {renderStars(rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        {/* Thông tin nổi bật */}
        <div>
          <h3 className="text-center fw-bold mt-5">THÔNG TIN NỔI BẬT</h3>
          <div className="row">
            <div className="col">
              BLOG
            </div>
            <div className="col">
              BLOG
            </div>
            <div className="col">
              BLOG
            </div>
            <div className="col">
              BLOG
            </div>
          </div>
        </div>
        {/* VOUCHER */}

        <div className="App">
          <h1>Discount Popup Demo</h1>
          {vouchers.map((voucher) => (
            <Popup key={voucher.voucherId} voucher={voucher} />
          ))}
        </div>
      </Container>
      <CreateOwnerModal showCreateOwnerModal={showCreateOwnerModal}
        setShowCreateOwnerModal={setShowCreateOwnerModal} userData={userData} />
      <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}
        showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal}
        showForgotPassword={showForgotPassword} setShowForgotPassword={setShowForgotPassword}></LoginModal>
      <RegisterModal showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal} showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}></RegisterModal>
      <ForgotPassword showForgotPassword={showForgotPassword} setShowForgotPassword={setShowForgotPassword}
        showChangePasswordNew={showChangePasswordNew} setShowChangePasswordNew={setShowChangePasswordNew}
      ></ForgotPassword>
      <ChangePasswordNew showChangePasswordNew={showChangePasswordNew} setShowChangePasswordNew={setShowChangePasswordNew} showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}></ChangePasswordNew>

    </HomeLayout>
  )
}
