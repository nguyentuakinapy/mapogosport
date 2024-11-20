'use client'
import { Container, Row, Col, Image, Form, Button, Carousel } from "react-bootstrap";
import { useEffect, useState } from 'react';
import HomeLayout from "@/components/HomeLayout";
import Link from "next/link";
import './user/types/user.scss'
import CreateOwnerModal from "@/components/Owner/modal/create-owner.modal";
import { toast } from "react-toastify";
import Popup from "@/components/User/modal/popup-voucher.modal";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { formatPrice } from "@/components/Utils/Format";

export default function Home() {
  const [rating, setRating] = useState<number>(1.5);
  const [sportFields, setSportFields] = useState<SportField[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(999);
  const [showCreateOwnerModal, setShowCreateOwnerModal] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<any>(null);
  const [nameFilter, setNameFilter] = useState<any>(null);

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

  const handleSearch = () => {
    const searchData = {
      name: nameFilter,
      type: typeFilter,
    };
    sessionStorage.setItem('searchFilters', JSON.stringify(searchData));
    window.location.href = "/categories/sport_field";
  };

  // VOUCHER
  const [voucher, setVoucher] = useState<Voucher[]>([])

  useEffect(() => {

    fetchDataVoucher()
  }, [])

  const fetchDataVoucher = async () => {
    try {
      const response = await fetch(`http://localhost:8080/rest/voucher/findAll`);
      const data = await response.json();
      setVoucher(data);
      console.log("Voucher", data)
    } catch (error) {
      console.log("Error fetch voucher data", error)
    }
  }
  //Handel select voucher khi active
  const filterVouchers = (vouchers: Voucher[]) => {
    const currentTime = new Date().getTime();
    return vouchers.filter(voucher => {
      const activeTime = new Date(voucher.activeDate).getTime();
      const endTime = new Date(voucher.endDate).getTime();
      return currentTime >= activeTime && currentTime <= endTime;
    });
  };

  const filteredVouchers = filterVouchers(voucher);

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
              <Form.Select onChange={(e) => setTypeFilter(e.target.value)} style={{ borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'black' }}>
                <option value={'0'}>Lọc theo loại sân</option>
                {categoryFields.map(item => (
                  <option key={item.categoriesFieldId} value={item.categoriesFieldId}>{item.name}</option>
                ))}
              </Form.Select>
              <Form.Control onChange={(e) => setNameFilter(e.target.value)} type="text" placeholder="Nhập tên sân hoặc địa chỉ"
                style={{ borderWidth: '0 1px 0 1px', borderStyle: 'solid', borderColor: 'black' }} />
              <div className="input-group-append">
                <Button onClick={handleSearch} variant="warning" style={{ height: '50px', borderRadius: '4px', fontWeight: 'bold' }}>
                  Tìm kiếm <i className="bi bi-search fw-bold"></i>
                </Button>
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
      {/* GIỚI THIỆU VỀ CHỦ SÂN */}

      {/* SÂN THỂ THAO MỚI  */}
      <Container className="pt-5">
        <div className="row a-more">
          <h3 className="fw-bold col-10">SÂN THỂ THAO MỚI</h3>
          <div className="col-2 text-end">
            <a href="/categories/sport_field" className="see-more-link">Xem Thêm</a>
          </div>
        </div>
        <div style={{ fontSize: '15px' }}>
          <Row className="">
            {sportFields.slice(0, 4).map((field: SportField) => (
              <Col xs={3} key={field.sportFieldId}>
                <div className="user-border">
                  <div className="mb-3">
                    <Link href={"#"}>
                      <Image
                        src={`${field.image}`}
                        alt={field.name}
                        style={{
                          maxHeight: "200px",
                          maxWidth: "450px",
                          minHeight: "200px",
                          objectFit: "cover"
                        }}
                      />
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
        </div>
        {/* VOUCHER */}
        <div className="row a-more mt-5">
          <h3 className="fw-bold col-10">MÃ GIẢM GIÁ SẢN PHẨM</h3>
          <div className="col-2 text-end">
            <a href="/voucher" className="see-more-link">Xem Thêm</a>
          </div>
        </div>
        <div style={{ fontSize: '15px' }}>
          <div className="d-flex m-auto">
            {filteredVouchers.slice(0, 3).map((voucher, index) => (
              <div key={index} className="voucher-item p-2 mx-3">
                <div className="voucher-info text-center col-4 border-end">
                  <div className="circle">
                    <span className="brand-name">Mapogo</span>
                  </div>
                </div>
                <div className="voucher-discount text-center col-6 ">
                  <span className="discount">Giảm giá {voucher.discountPercent} %</span>
                  <span className="expiry">HSD: {new Date(voucher.endDate).toLocaleDateString('en-GB')}</span> <br />
                  <em className='text-secondary' style={{ fontSize: "12px" }}>Số lượng: {voucher.quantity}</em>
                </div>
                <div className="get col-2 text-center ">
                  <button type="button" className="btn btn-dark text-center "
                    // onClick={() => handelSubmitGetVoucher(voucher.voucherId)}
                    disabled={voucher.quantity === 0}
                  >Nhận</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* SẢN PHẨM */}
        <div className="row a-more mt-5">
          <h3 className="fw-bold col-10">SẢN PHẨM MỚI</h3>
          <div className="col-2 text-end">
            <a href="/categories/products" className="see-more-link">Xem Thêm</a>
          </div>
        </div>
        <Row>
          {products.slice(0, 4).map((product, index) => {
            const reviews = product.productReviews || [];
            const reviewCount = reviews.length; // Total number of reviews
            const averageRating = reviewCount > 0
              ? (reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1)
              : "0.0"; // Calculate average rating to one decimal place or set to "0.0" if no reviews

            const fullStars = Math.floor(parseFloat(averageRating)); // Full stars based on integer part of averageRating
            const hasHalfStar = parseFloat(averageRating) - fullStars >= 0.5; // Determine if a half star is needed
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars are empty stars

            return (
              <Col key={product.productId} lg={3} md={4} sm={6} xs={12} className="mb-4">
                <div nh-product={product.productId} className="product-item card border">
                  <div className="inner-image mb-3">
                    <div className="product-status">
                      <div className="onsale"></div>
                    </div>
                    <Link href={`/product-detail/${product.productId}`}>
                      <img
                        className="w-100 h-100 p-1"
                        style={{
                          aspectRatio: "1 / 0.8", // Tạo tỷ lệ vuông
                          maxWidth: "350px",
                          maxHeight: "250px",
                          objectFit: "cover",
                          borderRadius: '10px'
                        }}
                        alt={product.name}
                        src={`${typeof product.image === 'string' ? product.image : ''}`}
                      />

                    </Link>
                  </div>

                  <div className="inner-content">
                    <div className="product-title ms-1" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                      <Link href={`/product-detail/${product.productId}`}>{product.name}</Link>
                    </div>
                    <div className="product-category ms-1">
                      <Link href={`/product-detail/${product.productId}`}>{product.categoryProduct.name}</Link>
                    </div>
                    <div className="price">
                      <span className="price-amount ms-1">{formatPrice(product.price)}</span>
                    </div>

                    {/* Average rating stars */}
                    <div className="star-item star d-flex mt-1 ms-1">
                      <div className="icon text-warning mb-2">
                        {[...Array(fullStars)].map((_, i) => (
                          <i key={`full-${i}`} className="bi bi-star-fill"></i>
                        ))}
                        {hasHalfStar && <i className="bi bi-star-half"></i>}
                        {[...Array(emptyStars)].map((_, i) => (
                          <i key={`empty-${i}`} className="bi bi-star"></i>
                        ))}
                      </div>
                      {/* Display average rating and review count */}
                      <div className="number ms-1">({averageRating} stars, {reviewCount} reviews)</div>
                    </div>

                  </div>
                </div>
              </Col>
            );
          })}
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
