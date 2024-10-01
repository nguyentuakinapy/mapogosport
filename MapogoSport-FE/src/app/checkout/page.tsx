'use client'
import HomeLayout from '@/components/HomeLayout';
import React from 'react';
import { useState } from 'react';
import { InputGroup } from 'react-bootstrap';

// import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
const CheckoutPage = () => {

  const [open, setOpen] = useState(false);
  const [open_1, setOpen_1] = useState(false);


  return (
    <HomeLayout>
      <h3 className='text-center text-danger mt-3 fw-bold'>Thanh toán</h3>
      <div className="container pt-2 ">
        <div className="row shadow p-3 mb-5 bg-body rounded">
          {/* Cột trái: Customer Info */}
          <div className="col-lg-4 col-md-6 col-12">
            <h5 className='text-primary'>Thông tin nhận hàng</h5>
            <hr />
            <form className="mt-4">
              {/* Email */}
              <div className="form-floating mb-1">
                <select className="form-select" id="city">
                  <option selected>Chọn thành phố...</option>
                  <option>Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                  <option>Địa chỉ khác...</option>
                  {/* Add more options as needed */}
                </select>
                <label htmlFor="city" style={{ color: "gray" }}>Số địa chỉ</label>
              </div>

              {/* Họ và tên */}
              <div className="form-floating mb-1">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Họ và tên"
                />
                <label htmlFor="name" style={{ color: "gray" }}>Họ và tên</label>
              </div>
              <div className="mb-1">
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1" style={{ padding: '0', alignItems: 'normal', border: 'none' }}>
                    <select defaultValue={'VN'}
                      className="form-select" aria-label="Default select example">
                      <option value="VN">VN</option>
                      <option value="US">US</option>
                    </select>
                  </InputGroup.Text>
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="phone"
                      placeholder="Số điện thoại"
                    />
                    <label htmlFor="phone" style={{ color: "gray" }}>Số điện thoại</label>
                  </div>
                </InputGroup>
              </div>


              <div className="form-floating mb-1">
                <select className="form-select" id="city">
                  <option selected>...</option>
                  <option>Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                  <option>Địa chỉ khác...</option>
                  {/* Add more options as needed */}
                </select>
                <label htmlFor="city" style={{ color: "gray" }}>Tỉnh thành</label>
              </div>

              <div className="form-floating mb-1">
                <select className="form-select" id="city">
                  <option selected>...</option>
                  <option>1</option>
                  {/* Add more options as needed */}
                </select>
                <label htmlFor="city" style={{ color: "gray" }}>Quận</label>
              </div>
              <div className="form-floating mb-1">
                <select className="form-select" id="city">
                  <option selected>...</option>
                  <option>1</option>
                  {/* Add more options as needed */}
                </select>
                <label htmlFor="city" style={{ color: "gray" }}>Phường</label>
              </div>
              {/* Địa chỉ cụ thể */}
              <div className="form-floating mb-1">
                <input
                  type="text"
                  className="form-control"
                  id="specificAddress"
                  placeholder="Số nhà"
                />
                <label htmlFor="specificAddress" style={{ color: "gray" }}>Địa chỉ cụ thể</label>
              </div>
              <div className="form-floating mb-1">
                <textarea className="form-control" id="notes" ></textarea>
                <label htmlFor="notes" className="form-label">
                  Ghi chú (tùy chọn)
                </label>
              </div>
            </form>
          </div>

          {/* Cột giữa: Payment options */}
          <div className="col-lg-3 col-md-6 col-12">
            <h5 className='text-primary'>Thanh toán</h5>
            <hr />
            <div className="card list-group mt-4 my-3">
              <div className="card-body d-flex list-group-item align-items-center">
                <div className="form-check flex-grow-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    aria-expanded={open}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <i className="bi bi-cash" style={{ cursor: 'pointer' }} onClick={() => setOpen_1(!open_1)}></i>
              </div>
              {/* Collapse for bank transfer details */}
              <Collapse in={open_1}>
                <div id="bank-transfer-collapse" className="card-footer">
                  <p>
                    Nhận hàng rồi bạn mới cần thanh toán cho bên vận chuyển nhé. Cảm ơn bạn!
                  </p>
                </div>
              </Collapse>
              <div className="card-body d-flex list-group-item align-items-center">
                <div className="form-check flex-grow-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    aria-expanded={open}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Chuyển khoản
                  </label>
                </div>
                <i className="bi bi-cash" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}></i>
              </div>
              {/* Collapse for bank transfer details */}
              <Collapse in={open}>
                <div id="bank-transfer-collapse" className="card-footer">
                  <h6>Thông tin chuyển khoản</h6>

                  {/* Hiển thị các hình ảnh của các hình thức thanh toán */}
                  <div className="d-flex align-items-center mb-3">
                    <img src="https://thumbs.dreamstime.com/b/kiev-ukraine-september-visa-mastercard-logos-printed-white-paper-visa-mastercard-american-multinational-102631953.jpg" alt="Visa" className="me-2" style={{ width: "50px" }} />
                    <img src="https://thumbs.dreamstime.com/b/kiev-ukraine-september-visa-mastercard-logos-printed-white-paper-visa-mastercard-american-multinational-102631953.jpg" alt="MasterCard" className="me-2" style={{ width: "50px" }} />
                    <img src="https://thumbs.dreamstime.com/b/kiev-ukraine-september-visa-mastercard-logos-printed-white-paper-visa-mastercard-american-multinational-102631953.jpg" className="me-2" style={{ width: "50px" }} />
                  </div>

                  {/* Thông tin chi tiết chuyển khoản */}
                  <p>
                    <strong>Ngân hàng:</strong> ABC Bank <br />
                    <strong>Số tài khoản:</strong> 123456789 <br />
                    <strong>Tên tài khoản:</strong> Nguyen Van A
                  </p>
                </div>
              </Collapse>

            </div>
          </div>

          {/* Cột phải: Order Summary */}
          <div className="col-lg-5 col-md-12 col-12 rounded">
            <h5 className='text-primary'>Đơn hàng (8 sản phẩm)</h5>
            <hr />
            <div className="order-summary">
              {/* Order Items */}
              <div style={{ maxHeight: '130px', overflowY: 'auto' }}>
                <div className="order-item d-flex align-items-center my-3">
                  <div className="product-image me-3 position-relative">
                    <img
                      src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
                      className="img-fluid rounded-circle"
                      style={{ width: "50px", height: "50px" }}
                      alt=""
                    />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      4
                      {/* <span className="visually-hidden">quantity</span> */}
                    </span>
                  </div>
                  <div>
                    <p className="mb-0">Ống cầu Yonex quốc tế</p>
                    <small>160 x 230</small>
                  </div>
                  <span className="ms-auto fw-bold ">4.490.000 VND</span>
                </div>
                <div className="order-item d-flex align-items-center my-3">
                  <div className="product-image me-3 position-relative">
                    <img
                      src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
                      className="img-fluid rounded-circle"
                      style={{ width: "50px", height: "50px" }}
                      alt=""
                    />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      4
                      {/* <span className="visually-hidden">quantity</span> */}
                    </span>
                  </div>
                  <div>
                    <p className="mb-0">Ống cầu Yonex quốc tế</p>
                    <small>160 x 230</small>
                  </div>
                  <span className="ms-auto fw-bold">4.490.000 VND</span>
                </div>
                <div className="order-item d-flex align-items-center my-3">
                  <div className="product-image me-3 position-relative">
                    <img
                      src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
                      className="img-fluid rounded-circle"
                      style={{ width: "50px", height: "50px" }}
                      alt=""
                    />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      4
                      {/* <span className="visually-hidden">quantity</span> */}
                    </span>
                  </div>
                  <div>
                    <p className="mb-0">Ống cầu Yonex quốc tế</p>
                    <small>160 x 230</small>
                  </div>
                  <span className="ms-auto fw-bold">4.490.000 VND</span>
                </div>
              </div>
              <hr />
              {/* Discount code */}
              <div className="my-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập mã giảm giá"
                  />
                  <button className="btn btn-apply px-4 " type="button" style={{ backgroundColor: "#fddf9f" }}>
                    Áp dụng
                  </button>
                </div>
              </div>
              <hr />
              {/* Order Summary */}
              <div className="d-flex justify-content-between my-3 fw-light">
                <span className='fw-bold'>Tạm tính</span>
                <span className="fw-light">4.490.000 VND</span>
              </div>
              {/* {Phần trăm tính tiền} */}
              <div className="d-flex justify-content-between my-3 fw-light">
                <span>Giảm giá </span>
                <span className="fw-light">4.000 VND</span>
              </div>
              <div className="d-flex justify-content-between my-3 fw-light">
                <span>Phí vận chuyển </span>
                <span className="fw-light">31.000 VND</span>
              </div>
              <hr />
              <div className="order-total d-flex justify-content-between">
                <span className="fw-bold">Tổng cộng</span>
                <span className="fw-bold text-primary">4.490.000 VND</span>
              </div>
              <div className="order-total d-flex justify-content-between my-4">
                <a href="#" className="text-reset text-decoration-none">
                  <span className="fst-italic">
                    <i className="bi bi-chevron-left"></i> Trở về giỏ hàng
                  </span>
                </a>

                <span className="btn btn-success px-3">Thanh toán</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default CheckoutPage;
