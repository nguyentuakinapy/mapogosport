"use client";
import HomeLayout from '@/components/HomeLayout';
import React, { useState, useEffect } from 'react';
import { Col, Button, ButtonGroup, Form, Spinner } from 'react-bootstrap';
import './style.css';
import axios from 'axios';
import { formatPrice } from '@/components/Utils/Format';
import { toast } from "react-toastify";

const Cart = () => {
  const [quantities, setQuantities] = useState<number[]>([]);

  // Hàm tăng số lượng sản phẩm
  const increaseQuantity = (index: number) => {
    const newQuantities = [...quantities]; // Tạo bản sao của mảng quantities
    newQuantities[index] += 1; // Tăng số lượng sản phẩm tại vị trí index
    setQuantities(newQuantities); // Cập nhật lại state quantities
    updateQuantityOnServer(index, newQuantities[index]); // Cập nhật số lượng trên server
  };

  // Hàm giảm số lượng sản phẩm
  const decreaseQuantity = (index: number) => {
    const newQuantities = [...quantities]; // Tạo bản sao của mảng quantities
    newQuantities[index] = newQuantities[index] > 1 ? newQuantities[index] - 1 : 1; // Giảm số lượng nhưng không nhỏ hơn 1
    setQuantities(newQuantities); // Cập nhật lại state quantities
    updateQuantityOnServer(index, newQuantities[index]); // Cập nhật số lượng trên server
  };

  // Hàm cập nhật số lượng lên server
  const updateQuantityOnServer = async (index: number, newQuantity: number) => {
    try {
      const cartItemId = dataCart[index].cartId; // Giả sử mỗi mục giỏ hàng có một `cartId`
      console.log(">>> check id", dataCart.cartId);
      // await axios.put(`http://localhost:8080/rest/cart/update`, {
      //   cartItemId,
      //   quantity: newQuantity,
      // });
      console.log(`Cập nhật số lượng cho sản phẩm ${cartItemId} thành ${newQuantity}`);
    } catch (err) {
      console.log("Lỗi khi cập nhật số lượng lên server:", err);
    }
  };

  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<boolean[]>([]);
  const [totalPrice, setTotalPrice] = useState(0); // Khởi tạo state để lưu tổng tiền
  // Hàm chọn tất cả sản phẩm
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;  // Đảo ngược trạng thái "chọn tất cả"

    // Cập nhật trạng thái selectedProducts cho tất cả sản phẩm thành true hoặc false
    const updatedSelectedProducts = dataCart.map(() => newSelectAll);

    setSelectedProducts(updatedSelectedProducts);  // Cập nhật state các sản phẩm đã chọn
    setSelectAll(newSelectAll);  // Cập nhật state "chọn tất cả"

    // Tính tổng tiền cho tất cả sản phẩm nếu chúng được chọn
    if (newSelectAll) {
      const total = dataCart.reduce((sum, cart) => sum + cart.productDetailSize.price * cart.quantity, 0);
      setTotalPrice(total);
    } else {
      setTotalPrice(0);  // Nếu bỏ chọn tất cả thì tổng tiền là 0
    }
  };

  // Hàm chọn từng sản phẩm
  const handleProductSelect = (index: number) => {
    const updatedProducts = [...selectedProducts];  // Tạo bản sao của danh sách các sản phẩm đã chọn

    // Đảo ngược trạng thái của sản phẩm tại index (true -> false, false -> true)
    updatedProducts[index] = !updatedProducts[index];

    setSelectedProducts(updatedProducts);  // Cập nhật danh sách sản phẩm đã chọn

    // Kiểm tra nếu tất cả các sản phẩm đều được chọn thì `selectAll` sẽ là true
    setSelectAll(updatedProducts.every(Boolean));  // every(Boolean) sẽ kiểm tra nếu tất cả các phần tử là true

    // Tính tổng tiền của các sản phẩm đã chọn
    const total = updatedProducts.reduce((sum, selected, idx) => {
      if (selected) {
        return sum + dataCart[idx].productDetailSize.price * dataCart[idx].quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(total);
  };
  // delete cart

  const handleDeleCartItem = (index: number) => {

    try {
      const cartItemId = dataCart[index].cartId;
      axios.delete(`http://localhost:8080/rest/cart/delete/${cartItemId}`);
      console.log(`>>> Xóa sản phẩm ${cartItemId} thành công`);
      // Sau khi xóa, cập nhật lại danh sách giỏ hàng
      const updatedDataCart = dataCart.filter((_, i) => i !== index);
      setDataCart(updatedDataCart);
      toast.success("Xóa thành công !")
    } catch (err) {
      console.log("lỗi xóa cart: ", err);
    }
  }


  // Dữ liệu giỏ hàng
  const [dataCart, setDataCart] = useState([]);
  const userSession = sessionStorage.getItem('user');
  const user = userSession ? JSON.parse(userSession) : null;

  useEffect(() => {
    // Hàm lấy dữ liệu giỏ hàng
    const fetchDataCart = async () => {
      try {
        // Đảm bảo người dùng tồn tại trước khi gọi API
        if (user && user.username) {
          const response = await axios.get(`http://localhost:8080/rest/cart/${user.username}`);

          setDataCart(response.data); // Lưu dữ liệu giỏ hàng vào state
          console.log(">>> check data Cart: ", response.data);
          // Trích xuất số lượng từ dữ liệu giỏ hàng
          const cartQuantities = response.data.map((item: any) => item.quantity);
          setQuantities(cartQuantities); // Đặt số lượng vào state

          // Khởi tạo trạng thái `selectedProducts` với giá trị false cho mỗi sản phẩm (không chọn sản phẩm nào ban đầu)
          setSelectedProducts(response.data.map(() => false));
        } else {
          console.log('Không tìm thấy người dùng');
        }
      } catch (err) {
        console.log('Lỗi:', err);
      }
    };

    fetchDataCart();
  }, []);

  return (
    <HomeLayout>
      <h1 className="text-center pt-4 mb-">Giỏ hàng</h1>
      <div className="container" >
        <div className="d-flex">
          <Col className={`col-md-9 p-3 mb-5 rounded ${user ? 'shadow bg-body' : ' '}`}>
            {user && (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '5%' }}>
                          <input
                            className="me-2"
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th scope="col" className="col-2"></th>
                        <th scope="col">Thông tin</th>
                        <th scope="col">Đơn Giá</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col" style={{ width: '10%' }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataCart && dataCart.map((cart, index: number) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedProducts[index]}
                              onChange={() => handleProductSelect(index)}
                            />
                          </td>
                          <td>
                            <img
                              src={`/images/Images_product/${cart.productDetailSize.productDetail.image}`}
                              className="img-fluid me-5 rounded-circle"
                              style={{ width: '80px', height: '80px' }}
                              alt=""
                            />
                          </td>
                          <td>
                            <p className="mb-0">{cart.productDetailSize.productDetail.product.name} ({cart.productDetailSize.productDetail.color}, {cart.productDetailSize.size.sizeName})</p>
                          </td>
                          <td>
                            <p className="mb-0">{formatPrice(cart.productDetailSize.price)}</p>
                          </td>
                          <td>
                            <div className="d-flex mb-0">
                              <ButtonGroup className="ms-3">
                                <Button variant="outline-secondary" onClick={() => decreaseQuantity(index)}>-</Button>
                                <Form.Control
                                  type="text"
                                  value={quantities[index]} // Hiển thị số lượng
                                  readOnly
                                  className="text-center"
                                  style={{ maxWidth: '50px' }}
                                />
                                <Button variant="outline-secondary" onClick={() => increaseQuantity(index)}>+</Button>
                              </ButtonGroup>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-md rounded-circle bg-light border" style={{ width: '35px', height: '35px', padding: 0 }}
                              onClick={() => handleDeleCartItem(index)}
                            >
                              <i className="text-danger bi bi-x"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Col>
          <Col className="col-md-3 ms-3 shadow bg-body p-3 mb-5 rounded">
            <div className="rounded">
              <div className="p-4">
                <h1 className="display-6 mb-4">Tổng tiền</h1>
              </div>
              <div className="py-4 mb-4 border-top border-bottom border-dark d-flex justify-content-between">
                <h5 className="mb-0 mx-4">Tổng cộng</h5>
                <p className="mb-0 mx-4 text-danger fw-bold">{formatPrice(totalPrice)}</p> {/* Hiển thị tổng tiền */}
              </div>

              <div className="text-center d-flex ms-4">
                <button className="btn btn-outline-secondary px-3 me-3 py-3 text-dark mb-4" type="button">
                  Tiếp Tục Mua hàng
                </button>
                <button className="btn btn-dark px-3 me-3 py-3 text-light mb-4" type="button">
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
