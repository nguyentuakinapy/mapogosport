'use client'
import HomeLayout from '@/components/HomeLayout';
import React from 'react';
import { useState } from 'react';

// import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
const CheckoutPage_Booking = () => {

  const [open, setOpen] = useState(false);
  const [open_1, setOpen_1] = useState(false);


  return (
    <HomeLayout>
      <div className="container py-5">
        <div className="row shadow p-3 mb-5 bg-body rounded" >
          {/* Cột trái: Customer Info */}
          <div className="col-lg-3 col-md-6 col-12">
            <h5 className='text-primary'>Thông tin đặt lịch</h5>
            <hr />
            <form className="mt-4">
              {/* Email */}
              <div className="form-floating mb-1">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                />
                <label htmlFor="email" style={{ color: "gray" }}>Email</label>
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
                <div className="input-group">
                  <span className="input-group-text">
                    <select className="form-select" style={{ width: "auto", padding: "10 25px" }} id="city">
                      <option selected>VN</option>
                      <option>US</option>
                      <option>JP</option>
                      {/* Add more options as needed */}
                    </select>
                  </span>

                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="Số điện thoại"
                    />
                    <label htmlFor="phone" style={{ color: "gray" }}>Số điện thoại</label>
                  </div>
                </div>
              </div>


              <div className="form-floating mb-1">
                <textarea className="form-control" id="notes" ></textarea>
                <label htmlFor="notes" className="form-label">
                  Ghi chú (tùy chọn)
                </label>
              </div>
            </form>
            <hr />
            <h5>Vị trí sân</h5>
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7823.976171791275!2d108.88828759055988!3d11.335580555396747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31772948d6a84497%3A0x27c8a84d49717233!2zQ2EgTmEsIFBoxrDhu5tjIERpw6ptLCBOaW5oIFBoxrDhu5tjIERpc3RyaWN0LCBOaW5oIFRodeG6rW4sIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1727249434218!5m2!1sen!2s"
                width="620"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
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
                <i className="bi bi-cash" onClick={() => setOpen_1(!open_1)}></i>
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
                <i className="bi bi-cash" onClick={() => setOpen(!open)}></i>
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
          <div className="col-lg-6 col-md-12 col-12 rounded py-3" style={{ backgroundColor: "#f2f2f2" }} >
            <h5 className='text-primary'>Thông tin chi tiết đặt sân</h5>
            <hr />
            <div className="order-summary" >
              {/* Order Items */}
              {/* Bảng thông tin chi tiết */}
              <div className="booking-summary" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Ngày đặt</th>
                      <th>Giờ đặt</th>
                      <th style={{ width: '30%' }}>Sân</th>
                      <th>Giá</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dòng 1 */}
                    <tr>
                      <td>25-09-2024</td>
                      <td>10:00 AM</td>
                      <td>Sân 1 (SÂN 7 NGƯỜI)</td>
                      <td>300.000 VND</td>
                      <td><button className="btn btn-danger">Xóa</button></td>
                    </tr>

                  </tbody>
                </table>
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
                  <button className="btn btn-apply px-4" type="button" style={{ backgroundColor: "#fddf9f" }}>
                    Áp dụng
                  </button>
                </div>
              </div>
              <hr />
              {/* Order Summary */}

              <div className="d-flex justify-content-between my-3 fw-light">
                <span>Địa chỉ </span>
                <span className="fw-light">Số 2 Phạm Văn Đồng, Dịch Vọng Hậu , Cầu Giấy, Hà Nội , Việt Nam</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between my-3 fw-light">
                <span className='fw-bold'>Tạm tính</span>
                <span className="fw-light">4.490.000 VND</span>
              </div>
              {/* {Phần trăm tính tiền} */}
              <div className="d-flex justify-content-between my-3 fw-light">
                <span>Giảm giá </span>
                <span className="fw-light">4.000 VND</span>
              </div>
              <hr />
              <div className="order-total d-flex justify-content-between">
                <span className="fw-bold">Tổng cộng</span>
                <span className="fw-bold text-primary">4.490.000 VND</span>
              </div>
              <div className="order-total d-flex justify-content-between my-4">
                <a href="#" className="text-reset text-decoration-none">
                  <span className="fst-italic">
                    <i className="bi bi-chevron-left"></i> Trở về trang đặt sân
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

export default CheckoutPage_Booking;
