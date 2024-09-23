import { Container, Carousel } from "react-bootstrap";
import { useState } from 'react';

export default function Home() {

  return (
    <Container className="bg-light pt-3">
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
        <div className="row">
          <div className="col">
            <div className="card m-auto" style={{ width: '23rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '23rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '23rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sân thể thao mới */}
      <div>
        <h3 className="fw-bold mt-5">SÂN THỂ THAO MỚI</h3>
        <div className="row">
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sản phẩm mới */}
      <div>
        <h3 className="fw-bold mt-5">SẢN PHẨM MỚI</h3>
        <div className="row">
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-auto" style={{ width: '18rem' }}>
              <img src="https://img.thegioithethao.vn/thumbs/san-picklebakll/ha-noi/hoang-mai/san-pickleball-ho-Dinh-cong/san-pickleball-ho-Dinh-cong-6_thumb_500.webp" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
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
    </Container>
  );
}
