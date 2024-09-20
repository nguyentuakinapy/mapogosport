'use client'
import React from 'react';

import { Button } from 'react-bootstrap';


const Cart = () => {
  return (
    <>
      <h1 className="text-center mt-5">Giỏ hàng</h1>
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Sản phẩm</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Tổng</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <div className="d-flex align-items-center">
                      <img
                        src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
                        className="img-fluid me-5 rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                        alt=""
                      />
                    </div>
                  </th>
                  <td>
                    <p className="mb-0 mt-4">Ống cầu</p>
                  </td>
                  <td>
                    <p className="mb-0 mt-4">200.000</p>
                  </td>
                  <td>
                    <div className="input-group quantity mt-4" style={{ width: '100px' }}>
                      <div className="input-group-btn">
                        <button className="btn btn-sm btn-minus rounded-circle bg-light border">
                          {/* <i className="fa fa-minus"></i> */} <i className="bi bi-dash"></i>
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-sm text-center border-0"
                        value="2"
                      />
                      <div className="input-group-btn">
                        <button className="btn btn-sm btn-plus rounded-circle bg-light border">
                          {/* <i className="fa fa-plus"></i> */}<i className="bi bi-plus-lg"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="mb-0 mt-4">400.000</p>
                  </td>
                  <td>
                    <button className="btn btn-md rounded-circle bg-light border mt-4">
                      {/* <i className="fa fa-times text-danger"></i> */}<i className="text-danger bi bi-x"></i>
                    </button>
                  </td>
                </tr>
                {/* Bạn có thể lặp lại các sản phẩm khác tương tự */}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <input
              type="text"
              className="border-0 border-bottom rounded me-5 py-3 mb-4"
              placeholder="Mã giảm giá"
            />
            <button className="btn border-secondary rounded-pill px-4 py-3 text-primary" type="button">
              Áp mã
            </button>
          </div>
          {/* Tổng tiền */}
          <div className="row g-4 justify-content-end">
            <div className="col-8"></div>
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
              <div className="bg-light rounded">
                <div className="p-4">
                  <h1 className="display-6 mb-4">
                    Tổng <span className="fw-normal">Tiền</span>
                  </h1>
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="mb-0 me-4">Tạm tính:</h5>
                    <p className="mb-0">400.000</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0 me-4">Vận chuyển</h5>
                    <div>
                      <p className="mb-0">Phí vận chuyển: 15.000</p>
                    </div>
                  </div>
                  <p className="mb-0 text-end">Vận chuyển đến Kiên Giang</p>
                </div>
                <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                  <h5 className="mb-0 ps-4 me-4">Tổng cộng</h5>
                  <p className="mb-0 pe-4">400.000</p>
                </div>
                <button
                  className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                  type="button"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    
     <Button variant='danger'>BAtoluxi</Button>
     <i className="bi bi-alarm"></i>
     <i className="fa fa-minus"></i>
     
     <div className='btn btn-danger'>dsds</div>

    </>
  );
};

export default Cart;
