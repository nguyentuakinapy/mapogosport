"use client";
import HomeLayout from '@/components/HomeLayout';
import React, { useState, useEffect } from 'react';
import { Col, Button, ButtonGroup, Form, Image } from 'react-bootstrap';
import './style.css';
import { formatPrice } from '@/components/Utils/Format';
import { toast } from "react-toastify";
import useSWR, { mutate } from 'swr';
import Link from 'next/link';

const Cart = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [quantities, setQuantities] = useState<number[]>([]);
  const [dataCart, setDataCart] = useState<Cart[]>([]);
  const [username, setUsername] = useState<string>("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<boolean[]>([]);
  const [totalPrice, setTotalPrice] = useState(0); // Khởi tạo state để lưu tổng tiền

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setUsername(username);
    }
  }, []);

  const { data, error } = useSWR(username && `http://localhost:8080/rest/cart/${username}`, fetcher);

  useEffect(() => {
    if (data) {
      setDataCart(data);
      const cartQuantities = data.map((item: Cart) => item.quantity);
      setQuantities(cartQuantities);
      setSelectedProducts(data.map(() => false));
    }
  }, [data]);

  // Cập nhật hàm tăng số lượng
  const increaseQuantity = (index: number) => {
    const newQuantities = [...quantities]; // Tạo bản sao của mảng quantities
    newQuantities[index] += 1; // Tăng số lượng sản phẩm tại vị trí index
    setQuantities(newQuantities); // Cập nhật lại state quantities
    updateQuantityOnServer(index, newQuantities[index]); // Cập nhật số lượng trên server

    // Cập nhật tổng tiền ngay lập tức
    updateTotalPrice(selectedProducts, newQuantities);
  };

  // Cập nhật hàm giảm số lượng
  const decreaseQuantity = (index: number) => {
    const newQuantities = [...quantities]; // Tạo bản sao của mảng quantities
    newQuantities[index] = newQuantities[index] > 1 ? newQuantities[index] - 1 : 1; // Giảm số lượng nhưng không nhỏ hơn 1
    setQuantities(newQuantities); // Cập nhật lại state quantities
    updateQuantityOnServer(index, newQuantities[index]); // Cập nhật số lượng trên server

    // Cập nhật tổng tiền ngay lập tức
    updateTotalPrice(selectedProducts, newQuantities);
  };

  // Hàm cập nhật tổng tiền
  const updateTotalPrice = (updatedProducts: boolean[], updatedQuantities: number[]) => {
    const total = updatedProducts.reduce((sum, selected, index) => {
      if (selected) {
        return sum + dataCart[index].productDetailSize.price * updatedQuantities[index]; // Sử dụng quantities mới
      }
      return sum;
    }, 0);

    setTotalPrice(total);
  };

  // Hàm cập nhật số lượng lên server
  const updateQuantityOnServer = async (index: number, newQuantity: number) => {
    const cartItemId = dataCart[index].cartId;
    await fetch(`http://localhost:8080/rest/cart/update/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: newQuantity,
      })
    }).then((res) => {
      if (!res.ok) {
        toast.error("Lỗi khi cập nhật số lượng!");
        return;
      }
    })
  };

  // Hàm chọn tất cả sản phẩm
  const handleSelectAll = () => {
    const newSelectAll = !selectAll; // Đảo ngược trạng thái "chọn tất cả"

    // Cập nhật trạng thái selectedProducts cho tất cả sản phẩm thành true hoặc false
    const updatedSelectedProducts = dataCart.map(() => newSelectAll);

    setSelectedProducts(updatedSelectedProducts); // Cập nhật state các sản phẩm đã chọn
    setSelectAll(newSelectAll); // Cập nhật state "chọn tất cả"

    // Tính tổng tiền cho tất cả sản phẩm nếu chúng được chọn
    if (newSelectAll) {
      updateTotalPrice(updatedSelectedProducts, quantities);
    } else {
      setTotalPrice(0); // Nếu bỏ chọn tất cả thì tổng tiền là 0
    }
  };

  // Hàm chọn từng sản phẩm
  const handleProductSelect = (index: number) => {
    const updatedProducts = [...selectedProducts]; // Tạo bản sao của danh sách sản phẩm đã chọn

    // Đảo ngược trạng thái của sản phẩm tại index
    updatedProducts[index] = !updatedProducts[index];

    setSelectedProducts(updatedProducts); // Cập nhật danh sách sản phẩm đã chọn

    // Kiểm tra nếu tất cả các sản phẩm đều được chọn thì selectAll sẽ là true
    setSelectAll(updatedProducts.every(Boolean)); // Kiểm tra nếu tất cả các phần tử là true

    // Tính tổng tiền của các sản phẩm đã chọn
    updateTotalPrice(updatedProducts, quantities);

  };

  //của Mỵ 
  const saveCartIdsToLocalStorage = () => {
    const unavailableItems: string[] = []; // Danh sách sản phẩm không đủ tồn kho

    // Duyệt qua các sản phẩm đã chọn và kiểm tra tồn kho
    const isAvailable = selectedProducts.every((isSelected, index) => {
      if (isSelected) {
        const cartItem = dataCart[index];
        const availableQuantity = cartItem.productDetailSize.quantity;
        const requestedQuantity = cartItem.quantity;

        if (requestedQuantity > availableQuantity) {
          // Nếu không đủ tồn kho, thêm vào danh sách không khả dụng và trả về false
          unavailableItems.push(cartItem.productDetailSize.productDetail.product.name);
          return false;
        }
      }
      return true; // Sản phẩm đủ tồn kho
    });

    if (!isAvailable) {
      toast.error(`Các sản phẩm sau không đủ tồn kho: ${unavailableItems.join(", ")}`);
      return; // Ngừng xử lý nếu có sản phẩm không đủ tồn kho
    }

    const cartIds = selectedProducts.map((isSelected, index) => (isSelected ? dataCart[index].cartId : null))
      .filter(id => id !== null);

    if (cartIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    } else {
      try {
        localStorage.setItem('CartIds', JSON.stringify(cartIds));
        window.location.href = "/checkout-product";
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }

  };

  const handleDeleCartItem = async (index: number) => {
    if (!username) {
      console.log("Người dùng chưa đăng nhập.");
      return;
    }
    const cartItemId = dataCart[index].cartId;
    await fetch(`http://localhost:8080/rest/cart/delete/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        toast.error("Lỗi khi xóa sản phẩm!");
        return;
      }
      const updatedDataCart = dataCart.filter((_, i) => i !== index);
      setDataCart(updatedDataCart);
      const updatedSelectedProducts = selectedProducts.filter((_, i) => i !== index);
      setSelectedProducts(updatedSelectedProducts);
      const updatedQuantities = updatedDataCart.map(item => item.quantity);
      setQuantities(updatedQuantities);
      console.log();

      if (selectedProducts[index]) {
        const total = updatedSelectedProducts.reduce((sum, selected, idx) => {
          if (selected) {
            return sum + updatedDataCart[idx].productDetailSize.price * updatedQuantities[idx];
          }
          return sum;
        }, 0);
        setTotalPrice(total); // Cập nhật tổng tiền
      }

      mutate(`http://localhost:8080/rest/cart/count/${username}`); // Tái tải dữ liệu
      toast.success("Xóa thành công !");
    })
  };

  if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

  return (
    <HomeLayout>
      <h1 className="text-center pt-4 mb-">Giỏ hàng</h1>
      <div className="container" >
        <div className="d-flex">
          <Col className={`${dataCart && dataCart.length > 0 ? 'col-md-8' : 'col-md-12'}   p-3 mb-5 rounded ${username ? 'shadow bg-body' : ' '}`}>
            {username && (
              <>
                <div className="table-responsive">
                  {dataCart && dataCart.length > 0 ? (
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
                        {dataCart.map((cart, index: number) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedProducts[index]}
                                onChange={() => handleProductSelect(index)}
                              />
                            </td>
                            <td>
                              <Image
                                src={`${cart.productDetailSize.productDetail.image}`}
                                className="img-fluid me-5 rounded-circle"
                                style={{ width: '80px', height: '80px' }}
                                alt=""
                              />
                            </td>
                            <td>
                              <Link
                                style={{ textDecoration: 'none', color: '#333' }}
                                href={`/product-detail/${cart.productDetailSize.productDetail.product.productId}`}
                              >
                                <p className="mb-0">
                                  {cart.productDetailSize.productDetail.product.name}
                                  <br />({cart.productDetailSize.productDetail.color}, {cart.productDetailSize.size.sizeName})
                                </p>
                              </Link>
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
                              <button
                                className="btn btn-md rounded-circle bg-light border"
                                style={{ width: '35px', height: '35px', padding: 0 }}
                                onClick={() => handleDeleCartItem(index)}
                              >
                                <i className="text-danger bi bi-x"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-bag-plus-fill" style={{ fontSize: '100px' }}></i>
                      <p className="text-muted fs-5">Bạn cần thêm một sản phẩm vào giỏ hàng của mình
                        <br /> Vui lòng quay lại <strong>"Trang sản phẩm"</strong> và tìm sản phẩm của bạn  </p>
                      <Link className='btn btn-dark text-white mb-5'
                        style={{ textDecoration: 'none', color: '#333' }}
                        href="/categories/products"
                      > Trang Sản Phẩm</Link>
                    </div>
                  )}
                </div>

              </>
            )}
          </Col>
          {dataCart && dataCart.length > 0 ? (
            <Col className="col-md-4 ms-3 shadow bg-body p-3 mb-5 rounded" >
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
                  <Button
                    className="btn btn-dark px-3 me-3 py-3 text-light mb-4"
                    type="button"
                    onClick={() => saveCartIdsToLocalStorage()}
                  > Thanh Toán Ngay</Button>
                </div>
              </div>
            </Col>
          ) : (
            <></>
          )
          }

        </div>
      </div >
    </HomeLayout >
  );
};

export default Cart;