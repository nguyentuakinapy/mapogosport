'use client'
import { Container, Carousel, Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from 'react';
import HomeLayout from "@/components/HomeLayout";
import Link from "next/link";
import './user/types/user.scss'
import useSWR from "swr";

export default function Home() {
  const [rating, setRating] = useState<number>(1.5);
  const [sportFields, setSportFields] = useState<SportField[]>([]);

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


  return (
    <HomeLayout>
      <Container className="pt-3">
        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="2000">
              <img src="https://img.thegioithethao.vn/media/banner/banner_gio_vang.png" className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img src="https://img.thegioithethao.vn/media/banner/thi-cong-cai-tao.png" className="d-block w-100" alt="..." />
            </div>
            {/* <div className="carousel-item">
            <img src="..." className="d-block w-100" alt="..." />
          </div> */}
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
        {/* Danh mục nổi bật */}
        <div>
          <h3 className="text-center fw-bold mt-5 mb-1">DANH MỤC NỔI BẬT</h3>
          <div className="row">
            <div className="col-3 text-center">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div>
            <div className="col-3 text-center col-img">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div><div className="col-3 text-center col-img">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div><div className="col-3 text-center col-img">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div>
            <div className="col-3 text-center mt-2 col-img">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div>
            <div className="col-3 text-center mt-2 col-img">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div>
            <div className="col-3 text-center mt-2 col-img">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div>
            <div className="col-3 text-center mt-2 col-img">
              <div className="img-dm m-auto" style={{ width: '80%' }}>
                <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
                <h3>Test</h3>
              </div>
            </div>
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
          <h3 className="fw-bold mt-5">SÂN THỂ THAO MỚI</h3>
          <div style={{ fontSize: '15px' }}>
            <Row className="my-3">
              {sportFields.map((field: SportField) => (
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
          </div>
        </div>
        {/* Sản phẩm mới */}
        <div>
          <h3 className="fw-bold mt-5">SẢN PHẨM MỚI</h3>
          <div style={{ fontSize: '15px' }}>
            <Row className="my-3">
              <Col xs={3}>
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
              <Col xs={3}>
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
              <Col xs={3}>
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
              <Col xs={3}>
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
      </Container>
    </HomeLayout>
  )
}
