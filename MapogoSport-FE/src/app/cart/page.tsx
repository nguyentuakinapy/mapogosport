"use client";
import HomeLayout from '@/components/HomeLayout';
import React, { useState, useEffect, Suspense } from 'react';
import { Col, Button, ButtonGroup, Form, Table, Row, Container } from 'react-bootstrap';
import './style.scss';
import { decodeString, formatPrice } from '@/components/Utils/Format';
import { toast } from "react-toastify";
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import Loading from '@/components/loading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Cart = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [quantities, setQuantities] = useState<number[]>([]);
  const [dataCart, setDataCart] = useState<Cart[]>([]);
  const [username, setUsername] = useState<string>("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<boolean[]>([]);
  const [totalPrice, setTotalPrice] = useState(0); // Khởi tạo state để lưu tổng tiền
  const router = useRouter()

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setUsername(decodeString(username));
    }
  }, []);

  const { data, error } = useSWR(username && `${BASE_URL}rest/cart/${username}`, fetcher);

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
    await fetch(`${BASE_URL}rest/cart/update/${cartItemId}`, {
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
          unavailableItems.push(cartItem.productDetailSize.productDetail.product!.name);
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
        router.push("/checkout-product");
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  const handleDeleCartItem = async (index: number) => {
    const cartItemId = dataCart[index].cartId;
    await fetch(`${BASE_URL}rest/cart/delete/${cartItemId}`, {
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

      if (selectedProducts[index]) {
        const total = updatedSelectedProducts.reduce((sum, selected, idx) => {
          if (selected) {
            return sum + updatedDataCart[idx].productDetailSize.price * updatedQuantities[idx];
          }
          return sum;
        }, 0);
        setTotalPrice(total); // Cập nhật tổng tiền
      }

      mutate(`${BASE_URL}rest/cart/count/${username}`); // Tái tải dữ liệu
      toast.success("Xóa thành công !");
    })
  };

  const handleDeleteAll = async () => {
    try {
      const deleteRequests = dataCart.map(cartItem =>
        fetch(`${BASE_URL}rest/cart/delete/${cartItem.cartId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
      );

      const responses = await Promise.all(deleteRequests);
      const allSuccessful = responses.every(res => res.ok);

      if (!allSuccessful) {
        toast.error("Lỗi khi xóa một số sản phẩm được chọn!");
        return;
      }

      setDataCart([]);
      setSelectedProducts([]);
      setQuantities([]);
      setTotalPrice(0);

      mutate(`${BASE_URL}rest/cart/count/${username}`); // Refresh the cart count
      toast.success("Đã xóa các sản phẩm được chọn!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa các sản phẩm được chọn!");
    }
  };

  if (!username) return <HomeLayout>
    <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 90px)' }}>
      <div className="text-center">
        <i className="bi bi-bag-plus-fill" style={{ fontSize: '100px' }}></i>
        <p className="text-muted fs-5">Bạn chưa đăng nhập
          <br /> Vui lòng <strong>&ldquo;đăng nhập&rdquo;</strong> để xem giỏ hàng của bạn!</p>
        <Link className='btn btn-dark text-white mb-5' style={{ textDecoration: 'none', color: '#333' }}
          href="/categories/products"> Đăng nhập ngay</Link>
      </div>
    </div>
  </HomeLayout>
  if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;
  if (!data) return <HomeLayout><div className='d-flex justify-content-center align-items-center' style={{ height: '90vh' }}><Loading></Loading></div></HomeLayout>
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <HomeLayout>
        <Container>
          <div style={{ fontSize: '20px' }} className="text-center text-danger text-uppercase py-4"><b>Giỏ hàng</b></div>
          {dataCart && dataCart.length > 0 ? (
            <Row>
              <Col xs={9}>
                <div className={`cart-inner ${username ? 'shadow bg-white' : ''}`} style={{ minHeight: '100%' }}>
                  {username && (
                    <>
                      <div className="table-cart">
                        <Table hover>
                          <thead>
                            <tr>
                              <th style={{ width: '50px' }}>
                                <Form.Check type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                              </th>
                              <th style={{ width: '50px' }}></th>
                              <th style={{ width: '300px' }}>Thông tin</th>
                              <th style={{ width: '100px' }}>Đơn Giá</th>
                              <th style={{ width: '100px' }}>Số lượng</th>
                              <th style={{ width: '50px' }}>Xóa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataCart.map((cart, index) => (
                              <tr key={index}>
                                <td>
                                  <Form.Check type="checkbox" checked={selectedProducts[index]} onChange={() => handleProductSelect(index)} />
                                </td>
                                <td>
                                  <Link href={`/categories/products/detail/${cart.productDetailSize.productDetail.product!.productId}`}>
                                    <Image src={`${cart.productDetailSize.productDetail.image}`} width={80} height={80} alt={`${cart.productDetailSize.productDetail.product?.name}`} />
                                  </Link>
                                </td>
                                <td>
                                  <Link href={`/categories/products/detail/${cart.productDetailSize.productDetail.product!.productId}`}>
                                    <div>
                                      <div className="product-name">{cart.productDetailSize.productDetail.product!.name}</div>
                                      <div>({cart.productDetailSize.productDetail.color}, {cart.productDetailSize.size.sizeName})</div>
                                    </div>
                                  </Link>
                                </td>
                                <td>{formatPrice(cart.productDetailSize.price)}</td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <ButtonGroup>
                                      <Button variant="outline-secondary" onClick={() => decreaseQuantity(index)}>-</Button>
                                      <Form.Control type="text" value={quantities[index]} readOnly className="text-center" style={{ maxWidth: '50px' }} />
                                      <Button variant="outline-secondary" onClick={() => increaseQuantity(index)}>+</Button>
                                    </ButtonGroup>
                                  </div>
                                </td>
                                <td>
                                  <Button className="btn btn-md" onClick={() => handleDeleCartItem(index)}>
                                    <i className="text-danger bi bi-x"></i>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      {dataCart?.length <= 1 ? null : (
                        <div className="d-flex justify-content-end mt-3">
                          <Button className="btn btn-delete" onClick={handleDeleteAll}>Xóa Tất Cả</Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Col>
              <Col xs={3}>
                <div className="shadow bg-white p-2 rounded" style={{ fontSize: '15px', minHeight: '100%' }}>
                  <div className="text-center text-danger text-uppercase mt-3 mb-2"><b>Tổng tiền</b></div>
                  <div className="py-4 mb-4 border-top border-bottom border-dark d-flex justify-content-between">
                    <div className="ms-4 fw-bold">Tổng cộng:</div>
                    <div className="me-4 text-danger fw-bold">{formatPrice(totalPrice)}</div> {/* Hiển thị tổng tiền */}
                  </div>
                  <Button className="btn btn-checkout" type="button" onClick={() => saveCartIdsToLocalStorage()}>Thanh Toán Ngay</Button>
                  <Link href="/categories/products" className="btn btn-continue">Tiếp Tục Mua hàng</Link>
                </div>
              </Col>
            </Row>
          ) : (
            <div className="d-flex justify-content-center align-items-center bg-white shadow" style={{ minHeight: '60vh' }}>
              <div className="text-center">
                <i className="bi bi-bag-plus-fill" style={{ fontSize: '100px' }}></i>
                <p className="text-muted fs-5">Bạn cần thêm một sản phẩm vào giỏ hàng của mình
                  <br /> Vui lòng quay lại <strong>&ldquo;Trang sản phẩm&rdquo;</strong> và tìm sản phẩm của bạn  </p>
                <Link className='btn btn-dark text-white mb-5' style={{ textDecoration: 'none', color: '#333' }}
                  href="/categories/products"> Trang Sản Phẩm</Link>
              </div>
            </div>
          )}
        </Container>
      </HomeLayout >
    </Suspense>
  );
};

export default Cart;