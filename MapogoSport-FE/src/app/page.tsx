'use client'
import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";
import { useEffect, useState } from 'react';
import HomeLayout from "@/components/HomeLayout";
import Link from "next/link";
import './user/types/user.scss'
import './categories/products/Product.scss'
import CreateOwnerModal from "@/components/Owner/modal/create-owner.modal";
import { toast } from "react-toastify";
import Popup from "@/components/User/modal/popup-voucher.modal";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { decodeJson, decodeString, formatPrice } from "@/components/Utils/Format";
import useSWR, { mutate } from "swr";
import Loading from "../components/loading";
import { useRouter } from "next/navigation";

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const rating = 1.5;
  const [pageSportField, setPageSportField] = useState<number>(1);
  const [pageProduct, setPageProduct] = useState<number>(1);
  const [pageVoucher, setPageVoucher] = useState<number>(1);
  const [showCreateOwnerModal, setShowCreateOwnerModal] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<number>(0);
  const [nameFilter, setNameFilter] = useState<string>("");
  const router = useRouter();

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

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: sportFields } = useSWR<SportField[]>(`${BASE_URL}rest/sport_field`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: products } = useSWR<Product[]>(`${BASE_URL}rest/products`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: categoryFields } = useSWR<CategoryField[]>(`${BASE_URL}rest/category_field`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: voucher } = useSWR<Voucher[]>(`${BASE_URL}rest/voucher/findAll`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const createOwnerSubmit = () => {
    const user = localStorage.getItem('username');
    if (user) {
      setShowCreateOwnerModal(true);
    } else {
      toast.warning("Bạn chưa đăng nhập, vui lòng đăng nhập hoặc đăng ký tài khoản!")
    }
  }

  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      setUserData(JSON.parse(decodeJson(userSession)) as User);
    }
  }, [])

  const [hasOwnerRole, setHasOwnerRole] = useState(false);

  useEffect(() => {
    const authorities = userData?.authorities || [];
    const ownerRoleExists = authorities.some(item => item.role.name === "ROLE_OWNER");
    setHasOwnerRole(ownerRoleExists);
  }, [userData]);

  useEffect(() => {
    const socket = new SockJS('${BASE_URL}ws'); // Địa chỉ endpoint WebSocket
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/login', (message) => {
        const userSession = sessionStorage.getItem('user');
        if (userSession && message.body == decodeString(String(localStorage.getItem('username')))) {
          setUserData(JSON.parse(decodeJson(userSession)) as User);
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
    router.push("/categories/sport_field");
  };

  const handelSubmitGetVoucher = async (voucherId: number) => {

    const username = decodeString(String(localStorage.getItem("username")));

    if (!username) {
      toast.warning("Bạn chưa đăng nhập!");
      return;
    }

    const checkResponse = await fetch(`${BASE_URL}rest/userVoucher/check/${username}/${voucherId}`);
    const alreadyHasVoucher = await checkResponse.json();

    if (alreadyHasVoucher) {
      toast.warning("Bạn đã nhận Voucher này rồi!");
      return;
    }
    const UserVoucher = {
      user: {
        username: username,
      },
      voucher: {
        voucherId: voucherId
      },
      status: 'Đang còn hạn',
      date: new Date(),
    };


    try {
      await fetch(`${BASE_URL}rest/userVoucher/create/${UserVoucher.voucher.voucherId}/${username}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
      });
      mutate(`${BASE_URL}rest/voucher/findAll`);
      toast.success("Nhận Voucher giá thành công!");
    } catch (error) {
      console.error("Lỗi khi nhận Voucher:", error);
      alert("Có lỗi xảy ra khi nhận Voucher. Vui lòng thử lại sau.");
    }
  };


  //Handel select voucher khi active
  const filterVouchers = (vouchers: Voucher[]) => {
    const currentTime = new Date().getTime();
    return vouchers.filter(voucher => {
      const activeTime = new Date(voucher.activeDate).getTime();
      const endTime = new Date(voucher.endDate).getTime();
      return currentTime >= activeTime && currentTime <= endTime;
    });
  };
  let filteredVouchers: Voucher[] = [];
  if (voucher) {
    filteredVouchers = filterVouchers(voucher);
  }


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
              <Form.Select onChange={(e) => setTypeFilter(Number(e.target.value))} style={{ borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'black' }}>
                <option value={'0'}>Lọc theo loại sân</option>
                {categoryFields && categoryFields.map(item => (
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
            <Image width={134} height={134} className="p-4" src="/images/timsan.png" alt="" />
            <h6 className="fw-bold">Tìm kiếm vị trí sân</h6>
            <p style={{ fontSize: '12px' }}>Dữ liệu sân đấu dồi dào, liên tục cập nhật, giúp bạn dễ dàng tìm kiếm theo khu vực mong muốn</p>
          </Col>
          <Col className="text-center position-relative custom-border">
            <Image width={134} height={134} className="p-3" src="/images/datsan.png" alt="" />
            <h6 className="fw-bold mt-1">Đặt lịch online</h6>
            <p style={{ fontSize: '12px' }}>Không cần đến trực tiếp, không cần gọi điện đặt lịch, bạn hoàn toàn có thể đặt sân ở bất kì đâu có internet</p>
          </Col>
          <Col className="text-center">
            <Image width={134} height={134} className="p-4" src="/images/timsan.png" alt="" />
            <h6 className="fw-bold">Đa dạng sản phẩm</h6>
            <p style={{ fontSize: '12px' }}>Tìm kiếm, mua sắn sản phẩm, dụng cụ liên quan đến thể thao, giao hàng toàn quốc đến khu vực bạn mong muốn</p>
          </Col>
        </Row>
      </Container>
      {/* GIỚI THIỆU VỀ CHỦ SÂN */}
      <Container className="pt-3">
        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item" data-bs-interval="2000">
              <Image width={1296} height={419} src="/images/bannerSport.png" className="d-block w-100" alt="..." />
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
              <Image width={1296} height={419} src="/images/registerowner.png" className="w-100" alt="" />
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
        {/* VOUCHER */}
        <div className="App">
          <Popup />
        </div>
      </Container>
      {/* SÂN THỂ THAO MỚI  */}
      <Container className="pt-5">
        <div className="row a-more">
          <h3 className="fw-bold col-10">SÂN THỂ THAO MỚI</h3>
          <div className="col-2 text-end">
            <a href="/categories/sport_field" className="see-more-link">Xem Thêm</a>
          </div>
        </div>
        <Row style={{ fontSize: '15px' }}>
          {!sportFields ?
            <Loading></Loading>
            : sportFields && sportFields.slice(pageSportField - 1, pageSportField + 3).map((field: SportField) => (
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
                    <Link href={`/categories/sport_field/detail/${field.sportFieldId}`} className="btn btn-user mt-2">Đặt sân</Link>
                  </div>
                </div>
              </Col>
            ))}
          {sportFields && (
            <div className="d-flex justify-content-between">
              <button className="btn btn-danger" onClick={() => {
                if (pageSportField === 1) {
                  setPageSportField(sportFields.length - 3);
                } else {
                  setPageSportField(prev => prev - 1);
                }
              }}>
                <i className="bi bi-arrow-left-short"></i>
              </button>
              <span className="text-danger fw-bold">{pageSportField}/{sportFields.length - 3}</span>
              <button className="btn btn-danger" onClick={() => {
                if (pageSportField === sportFields.length - 3) {
                  setPageSportField(1);
                } else {
                  setPageSportField(prev => prev + 1);
                }
              }}>
                <i className="bi bi-arrow-right-short"></i>
              </button>
            </div>
          )}
        </Row>
        {/* VOUCHER */}
        <div className="row a-more mt-5">
          <h3 className="fw-bold col-10">MÃ GIẢM GIÁ SẢN PHẨM</h3>
          <div className="col-2 text-end">
            <a href="/voucher" className="see-more-link">Xem Thêm</a>
          </div>
        </div>
        <div style={{ fontSize: '15px' }}>
          <div className="d-flex m-auto">
            {!voucher ?
              <div className="m-auto">
                <Loading></Loading>
              </div>
              :
              filteredVouchers.slice(pageVoucher - 1, pageVoucher + 2).map((voucher, index) => (
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
                      onClick={() => handelSubmitGetVoucher(voucher.voucherId)}
                      disabled={voucher.quantity === 0}
                    >Nhận</button>
                  </div>
                </div>
              ))}
          </div>
          {voucher && (
            <div className="d-flex justify-content-between">
              <button className="btn btn-danger" onClick={() => {
                if (pageVoucher === 1) {
                  setPageVoucher(filteredVouchers.length - 2);
                } else {
                  setPageVoucher(prev => prev - 1);
                }
              }}>
                <i className="bi bi-arrow-left-short"></i>
              </button>
              <span className="text-danger fw-bold">{pageVoucher}/{filteredVouchers.length - 2}</span>
              <button className="btn btn-danger" onClick={() => {
                if (pageVoucher === filteredVouchers.length - 2) {
                  setPageVoucher(1);
                } else {
                  setPageVoucher(prev => prev + 1);
                }
              }}>
                <i className="bi bi-arrow-right-short"></i>
              </button>
            </div>
          )}
        </div>
        {/* SẢN PHẨM */}
        <div className="row a-more mt-5">
          <h3 className="fw-bold col-10">SẢN PHẨM MỚI</h3>
          <div className="col-2 text-end">
            <a href="/categories/products" className="see-more-link">Xem Thêm</a>
          </div>
        </div>
        <Row>
          {!products ?
            <Loading></Loading>
            :
            products.slice(pageProduct - 1, pageProduct + 3).map((product) => {
              const reviews = product.productReviews || [];
              const reviewCount = reviews.length;
              const averageRating = reviewCount > 0
                ? (reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1)
                : "0.0";

              const fullStars = Math.floor(parseFloat(averageRating));
              const hasHalfStar = parseFloat(averageRating) - fullStars >= 0.5;
              const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

              return (
                <Col key={product.productId} lg={3} md={4} sm={6} xs={12} >
                  <div className='product-card bg-light'>
                    <Link href={`/categories/products/detail/${product.productId}`} >
                      <div className='product-card-inner'>
                        <Image className="image-front" alt={product.name} width={300} height={300} src={String(product.image)} />
                        <h4 className='product-category'>{product.categoryProduct.name}</h4>
                        <h3 className='product-title'>{product.name}</h3>
                        <div className='product-price'>{formatPrice(product.price)}</div>
                        <div className="star-item d-flex mt-1">
                          <div className="icon text-warning">
                            {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="bi bi-star-fill"></i>)}
                            {hasHalfStar && <i className="bi bi-star-half"></i>}
                            {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="bi bi-star"></i>)}
                          </div>
                        </div>
                      </div>
                      <div className='product-card-action px-1'>
                        <Link className='button-ajax' href={`/categories/products/detail/${product.productId}`}>Xem</Link>
                      </div>
                    </Link>
                  </div>
                </Col>
              );
            })}
          {products && (
            <div className="d-flex justify-content-between">
              <button className="btn btn-danger" onClick={() => {
                if (pageProduct === 1) {
                  setPageProduct(products.length - 3);
                } else {
                  setPageProduct(prev => prev - 1);
                }
              }}>
                <i className="bi bi-arrow-left-short"></i>
              </button>
              <span className="text-danger fw-bold">{pageProduct}/{products.length - 3}</span>
              <button className="btn btn-danger" onClick={() => {
                if (pageProduct === products.length - 3) {
                  setPageProduct(1);
                } else {
                  setPageProduct(prev => prev + 1);
                }
              }}>
                <i className="bi bi-arrow-right-short"></i>
              </button>
            </div>
          )}
        </Row>
      </Container>
      <CreateOwnerModal showCreateOwnerModal={showCreateOwnerModal}
        setShowCreateOwnerModal={setShowCreateOwnerModal} userData={userData || undefined} />
    </HomeLayout>
  )
}


