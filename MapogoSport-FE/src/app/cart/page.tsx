"use client";
import HomeLayout from '@/components/HomeLayout';
import React, { useState } from 'react';

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([false, false, false]); // Giả định có 3 sản phẩm

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedProducts(selectedProducts.map(() => newSelectAll));
  };

  const handleProductSelect = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = !updatedProducts[index];
    setSelectedProducts(updatedProducts);
    setSelectAll(updatedProducts.every(Boolean));
  };

  return (
    <HomeLayout>
      <h1 className="text-center pt-5">Giỏ hàng</h1>
      <div className="container shadow p-3 mb-5 bg-body rounded">
        <div className="row " >
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table  table-hover ">
                <thead >
                  <tr >
                    <th  scope="col" style={{ width: '5%' }}>
                      <input
                        className='me-2'
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      /> 
                    </th>
                    <th scope="col" >Sản phẩm</th>
                    <th scope="col" >Tên sản phẩm</th>
                    <th scope="col" >Giá</th>
                    <th scope="col" >Số lượng</th>
                    <th scope="col" >Tổng</th>
                    <th scope="col" style={{ width: '10%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProducts[index]}
                          onChange={() => handleProductSelect(index)}
                        />
                      </td>
                      <th scope="row">
                        <img
                          src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
                          className="img-fluid me-5 rounded-circle"
                          style={{ width: '80px', height: '80px' }}
                          alt=""
                        />
                      </th>
                      <td>
                        <p className="mb-0">Ống cầu</p>
                      </td>
                      <td>
                        <p className="mb-0">200.000</p>
                      </td>
                      <td>
                        <div className="input-group quantity" style={{ width: '100px' }}>
                          <button className="btn btn-sm btn-minus rounded-circle bg-light border">
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="text"
                            className="form-control form-control-sm text-center border-0"
                            value="2"
                          />
                          <button className="btn btn-sm btn-plus rounded-circle bg-light border">
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0">400.000</p>
                      </td>
                      <td>
                    <button className="btn btn-md rounded-circle bg-light border" style={{ width: '35px', height: '35px', padding: 0 }}>
                      <i className="text-danger bi bi-x"></i>
                    </button>
                  </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-4">
            <div className="rounded"  style={{ backgroundColor: "#f2f2f2" }}>
              <div className="p-4">
                <h1 className="display-6 mb-4 text-primary">Tổng tiền</h1>
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="mb-0">Tạm tính:</h5>
                  <p className="mb-0">400.000 VND</p>
                </div>
                <div className="d-flex justify-content-between">
                  <h5 className="mb-0">Vận chuyển</h5>
                  <p className="mb-0">Phí vận chuyển: 15.000 VND</p>
                </div>
                <p className="mb-0 text-end">Vận chuyển đến Kiên Giang</p>
              </div>
              <div className="py-4 mb-4 border-top border-bottom border-dark d-flex justify-content-between ">
                <h5 className="mb-0 mx-4">Tổng cộng</h5>
                <p className="mb-0 mx-4 text-primary fw-bold">415.000 VND</p>
              </div>
              <div className=' text-end'>
              <button
                className="btn border-secondary bg-success rounded-pill px-4 me-3 py-3 text-light text-uppercase mb-4"
                type="button">
                Xác nhận thanh toán
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Cart;
