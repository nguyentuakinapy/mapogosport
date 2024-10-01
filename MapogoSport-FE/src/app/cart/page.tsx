"use client";
import HomeLayout from '@/components/HomeLayout';
import React, { useState } from 'react';
import { Button, ButtonGroup, Form, Col } from 'react-bootstrap';
import './style.css'
const Cart = () => {
  const [quantities, setQuantities] = useState([1, 1, 1]);
  const increaseQuantity = (index) => {
    const newQuantities = [...quantities]; // Tạo một bản sao của mảng quantities
    newQuantities[index] += 1; // Tăng số lượng của sản phẩm tại vị trí index
    setQuantities(newQuantities); // Cập nhật trạng thái mới
  };

  const decreaseQuantity = (index) => {
    const newQuantities = [...quantities]; // Tạo một bản sao của mảng quantities
    newQuantities[index] = newQuantities[index] > 1 ? newQuantities[index] - 1 : 1; // Giảm số lượng, nhưng không dưới 1
    setQuantities(newQuantities); // Cập nhật trạng thái mới
  };
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
      <h1 className="text-center pt-4 mb-">Giỏ hàng</h1>
      <div className="container ">
        <div className="d-flex " >
          <Col className="col-md-8 shadow p-3 mb-5 bg-body rounded">
            <div className="table-responsive">
              <table className="table  table-hover ">
                <thead >
                  <tr >
                    <th scope="col" style={{ width: '5%' }}>
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
                      <td scope="row">
                        <img
                          src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
                          className="img-fluid me-5 rounded-circle"
                          style={{ width: '80px', height: '80px' }}
                          alt=""
                        />
                      </td>
                      <td>
                        <p className="mb-0">Ống cầu</p>
                      </td>
                      <td>
                        <p className="mb-0">200.000</p>
                      </td>
                      <td>
                        <div className="d-flex align-items-center mb-4" key={index}>
                          <ButtonGroup className="ms-3">
                            <Button variant="outline-secondary" onClick={() => decreaseQuantity(index)}>-</Button>
                            <Form.Control
                              type="text"
                              value={quantities[index]} // Hiển thị số lượng của sản phẩm tại vị trí index
                              readOnly
                              className="text-center"
                              style={{ maxWidth: '50px' }}
                            />
                            <Button variant="outline-secondary" onClick={() => increaseQuantity(index)}>+</Button>
                          </ButtonGroup>
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
          </Col>

          <Col className="col-md-4 ms-3 shadow p-3 mb-5 bg-body rounded">
            <div className="rounded" >
              <div className="p-4">
                <h1 className="display-6 mb-4 ">Tổng tiền</h1>
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="mb-0">Tạm tính:</h5>
                  <p className="mb-0">400.000 VND</p>
                </div>

              </div>
              <div className="py-4 mb-4 border-top border-bottom border-dark d-flex justify-content-between">
                <h5 className="mb-0 mx-4">Tổng cộng</h5>
                <p className="mb-0 mx-4 text-danger fw-bold">415.000 VND</p>
              </div>
              <br />
              <div className=' text-center d-flex ms-3 '>
                <button
                  className="btn btn-outline-secondary  px-3 me-3 py-3 text-dark  mb-4"
                  type="button">
                  Tiếp Tục Mua hàng
                </button>
                <button
                  className=" btn btn-dark  px-3 me-3 py-3 text-light  mb-4"
                  type="button">
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </Col>


        </div>
      </div>
    </HomeLayout>
  );
};

export default Cart;
