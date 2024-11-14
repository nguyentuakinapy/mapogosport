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
import { useData, UserProvider } from "./context/UserContext";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export default function Home() {
  const [rating, setRating] = useState<number>(1.5);
  const [sportFields, setSportFields] = useState<SportField[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(999);

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
    const user = localStorage.getItem('username');
    if (user) {
      setShowCreateOwnerModal(true);
    } else {
      toast.warning("Bạn chưa đăng nhập, vui lòng đăng nhập hoặc đăng ký tài khoản!")
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

  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      setUserData(JSON.parse(userSession) as User);
    }
  }, [])

  const [hasOwnerRole, setHasOwnerRole] = useState(false);

  useEffect(() => {
    const authorities = userData?.authorities || [];
    const ownerRoleExists = authorities.some(item => item.role.name === "ROLE_OWNER");
    setHasOwnerRole(ownerRoleExists);
  }, [userData]);

  const [categoryFields, setCategoryFields] = useState<CategoryField[]>([]);

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

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws'); // Địa chỉ endpoint WebSocket
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/login', (message) => {
        const userSession = sessionStorage.getItem('user');
        if (userSession && message.body == localStorage.getItem('username')) {
          setUserData(JSON.parse(userSession) as User);
        }
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);


  return (
    <HomeLayout>
      <div className="search-sport">
        <div className="body-search-sport " >
          <div className="m-auto text-center">
            <h1 className="text-white fw-bold">HỆ THỐNG HỖ TRỢ TÌM KIẾM SÂN BÃI NHANH</h1>
            <hr className="border border-info border-4 opacity-75 m-auto my-4" style={{ maxWidth: '10%' }} />
            <b className="text-white fs-11 text-center">Dữ liệu được MapogoSport cập nhật thường xuyên giúp cho người dùng tìm được sân một cách nhanh nhất</b>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <div className="input-group" style={{ width: '70%', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '8px', padding: '10px' }}>
              <select defaultValue={0} className="form-control" style={{ borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'black' }}>
                <option value={'0'}>Lọc theo loại sân</option>
                {categoryFields.map(item => (
                  <option key={item.categoriesFieldId} value={item.categoriesFieldId}>{item.name}</option>
                ))}
              </select>
              <input type="text" className="form-control" placeholder="Nhập tên sân hoặc địa chỉ" style={{ borderWidth: '0 1px 0 1px', borderStyle: 'solid', borderColor: 'black' }} />
              <input type="text" className="form-control" placeholder="Nhập khu vực" style={{ borderWidth: '0 0 0 1px', borderStyle: 'solid', borderColor: 'black' }} />
              <div className="input-group-append">
                <button className="btn btn-warning" type="button" style={{ height: '50px', borderRadius: '4px', fontWeight: 'bold' }}>
                  Tìm kiếm <i className="bi bi-search fw-bold"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Container className="mt-3">
        <Row>
          <Col className="text-center">
            <img className="p-4" src="/images/timsan.png" alt="" />
            <h6 className="fw-bold">Tìm kiếm vị trí sân</h6>
            <p style={{ fontSize: '12px' }}>Dữ liệu sân đấu dồi dào, liên tục cập nhật, giúp bạn dễ dàng tìm kiếm theo khu vực mong muốn</p>
          </Col>
          <Col className="text-center position-relative custom-border">
            <img className="p-3" src="/images/datsan.png" alt="" />
            <h6 className="fw-bold mt-1">Đặt lịch online</h6>
            <p style={{ fontSize: '12px' }}>Không cần đến trực tiếp, không cần gọi điện đặt lịch, bạn hoàn toàn có thể đặt sân ở bất kì đâu có internet</p>
          </Col>
          <Col className="text-center">
            <img className="p-4" src="/images/timsan.png" alt="" />
            <h6 className="fw-bold">Đa dạng sản phẩm</h6>
            <p style={{ fontSize: '12px' }}>Tìm kiếm, mua sắn sản phẩm, dụng cụ liên quan đến thể thao, giao hàng toàn quốc đến khu vực bạn mong muốn</p>
          </Col>
        </Row>
      </Container>
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
                        <Image src={`${field.image}`} alt={field.name} />
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
              {/* {products.slice(0, 8).map((product: Product) => (
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
              ))} */}
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
          <Popup />
        </div>
      </Container>
      <CreateOwnerModal showCreateOwnerModal={showCreateOwnerModal}
        setShowCreateOwnerModal={setShowCreateOwnerModal} userData={userData || undefined} />
    </HomeLayout>
  )
}
