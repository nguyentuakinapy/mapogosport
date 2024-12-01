'use client'
import HomeLayout from '@/components/HomeLayout';
import axios from 'axios';
import React, { Suspense, useEffect } from 'react';
import { useState } from 'react';
import { Button, FloatingLabel, Form, Collapse } from 'react-bootstrap';
import { decodeString, formatPrice } from '@/components/Utils/Format';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import ModalOrderSuccess from '@/components/ModalOrder/modal.Success';
import Link from 'next/link';
import Image from 'next/image';

const CheckoutPage = () => {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const BASE_URL = 'http://localhost:8080/rest/';

  const [open_1, setOpen_1] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cartData, setCartData] = useState<Cart[]>([]);
  const [cartIds, setCartIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user1, setUser1] = useState<User>();
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const storedCartIds = localStorage.getItem('CartIds');
    const username = localStorage.getItem('username');
    if (storedCartIds && username) {
      setCartIds(JSON.parse(storedCartIds));
      setUsername(decodeString(username));
    }
  }, []);

  const { data } = useSWR(cartIds && `${BASE_URL}checkout_product/${cartIds.join(",")}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const { data: userVoucher } = useSWR(username && `${BASE_URL}user/voucher/${username}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  useEffect(() => {
    if (data && userVoucher) {
      setCartData(data);
      setVouchers(userVoucher);
    }
  }, [data, userVoucher]);

  useEffect(() => {
    if (cartData && cartData.length > 0) {
      const total = cartData.reduce((sum: number, cart) => sum + cart.productDetailSize.price * cart.quantity, 0);
      setTotalPrice(total);
      setNewTotalPrice(total);
    }
  }, [cartData]);

  const { data: userData } = useSWR(username && `${BASE_URL}user/${username}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const [addressUsers, setAddressUsers] = useState<AddressUsers[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberUsers[]>([]);
  const [phoneNumberSelected, setPhoneNumberSelected] = useState('');
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [voucherSelected, setVoucherSelected] = useState<UserVoucher | null>(null);
  const [discount, setDiscount] = useState(0);
  const [newTotalPrice, setNewTotalPrice] = useState(0);


  useEffect(() => {
    if (userData) {
      setUser1(userData);
      setAddressUsers(userData.addressUsers || []);

      setPhoneNumbers(userData.phoneNumberUsers || []);
      // Chọn số điện thoại đang active
      const activePhone = userData.phoneNumberUsers.find((item: PhoneNumberUsers) => item.active);
      if (activePhone) {
        setPhoneNumberSelected(activePhone.phoneNumber.phoneNumber);
      }

      // Chọn địa chỉ có active là true
      const activeAddress = userData.addressUsers.find((item: AddressUsers) => item.active);
      if (activeAddress) {
        setAddressSelected(activeAddress);
      }
    }
  }, [userData]);

  const { data: apiAddress } = useSWR<ApiAddressResponse>("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [addressSelected, setAddressSelected] = useState<AddressUsers>();
  const [customPhoneNumber, setCustomPhoneNumber] = useState('');

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    const selectedProvinceData = apiAddress?.find(
      (province: Province) => province.Name === provinceName
    );
    setDistricts(selectedProvinceData?.Districts || []);
    setWards([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    const selectedDistrictData = districts.find((district: District) => district.Name === districtName);
    setWards(selectedDistrictData?.Wards || []);
    setSelectedWard('');
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardName = e.target.value;
    setSelectedWard(wardName);
  };

  useEffect(() => {
    if (addressSelected) {
      setSelectedProvince(addressSelected?.address?.province);
      setSelectedDistrict(addressSelected?.address?.district);
      setSelectedWard(addressSelected?.address?.ward);
      setAddressDetail(addressSelected?.addressDetail);

      const selectedProvinceData = apiAddress?.find((province: Province) => province.Name === addressSelected?.address?.province);
      setDistricts(selectedProvinceData?.Districts || []);
      const selectedDistrictData = selectedProvinceData?.Districts.find((district: District) => district.Name === addressSelected?.address?.district);
      setWards(selectedDistrictData?.Wards || []);
    } else {
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
      setAddressDetail('');
    }
  }, [addressSelected, apiAddress]);

  const [orderStatus, setOrderStatus] = useState('Chờ xác nhận');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMethod = e.target.value;
    if (selectedMethod === 'COD') {
      setOrderStatus('Chờ xác nhận');
    } else if (selectedMethod === 'VNPay' || selectedMethod === "MoMo") {
      setOrderStatus('Chờ thanh toán');
    }
    setPaymentMethod(selectedMethod);
  };

  const handleVoucherSelectedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoucher = vouchers.find(v => v.voucher.voucherId === Number(e.target.value));
    setVoucherSelected(selectedVoucher || null);  // Cập nhật `voucherSelected`
  };


  const applyVoucher = async () => {
    if (!voucherSelected) {
      toast.error("Vui lòng chọn mã giảm giá");
      return;
    }

    const calculatedDiscount = (totalPrice * voucherSelected.voucher.discountPercent) / 100;
    setDiscount(calculatedDiscount);

    const calculatedTotalPrice = totalPrice - calculatedDiscount;
    setNewTotalPrice(calculatedTotalPrice);

  };

  const checkForm = () => {
    setLoading(true);

    const errors = []; // Mảng lưu trữ các thông báo lỗi

    if (!user1) {
      errors.push('Người dùng không tồn tại');
    }
    if (!phoneNumberSelected) {
      errors.push('Vui lòng chọn số điện thoại');
    }
    if (!customPhoneNumber && phoneNumberSelected === 'other') {
      errors.push('Vui lòng nhập số điện thoại');
    }
    if (!isValidPhoneNumber(customPhoneNumber) && customPhoneNumber) {
      errors.push('Số điện thoại chưa đúng');
    }
    if (!selectedProvince) {
      errors.push('Vui lòng chọn tỉnh/thành phố');
    }
    if (!selectedDistrict) {
      errors.push('Vui lòng chọn quận/huyện');
    }
    if (!selectedWard) {
      errors.push('Vui lòng chọn phường/xã');
    }
    if (!addressDetail) {
      errors.push('Vui lòng điền địa chỉ chi tiết');
    }
    if (!paymentMethod) {
      errors.push('Vui lòng chọn phương thức thanh toán');
    }
    if (!totalPrice) {
      errors.push('Tổng giá không hợp lệ');
    }

    if (errors.length > 0) {
      alert(errors.join("\n")); // Hiển thị tất cả lỗi trên một alert
      setLoading(false);
      return false; // Trả về false để biểu thị rằng kiểm tra không thành công
    }

    return true; // Trả về true nếu tất cả các trường hợp đều hợp lệ
  };

  //hàn kiểm tra sđt
  function isValidPhoneNumber(phoneNumberSelected: string) {
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
    return phoneRegex.test(phoneNumberSelected);
  }

  const handleCreateOrder = async () => {
    const addressParts = [addressDetail, selectedWard, selectedDistrict, selectedProvince];
    const address1 = addressParts.filter(part => part).join(', ');
    const phoneNumber = phoneNumberSelected === 'other' ? customPhoneNumber : phoneNumberSelected;

    const orderData = {
      username: user1?.username,
      address: address1,
      phoneNumber: phoneNumber,
      date: new Date().toISOString(), // Chuyển đổi sang ISO string
      status: orderStatus,
      amount: newTotalPrice,
      paymentMethod: paymentMethod,
      voucherId: voucherSelected?.voucher.voucherId ?? '',
      shipFee: 0.0,// Hoặc giá trị phí vận chuyển
    };
    console.log(orderData);

    try {
      const response = await axios.post(`${BASE_URL}create_order`, orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Dữ liệu trả về từ API:", response.data);

      return response.data; // Trả về thông tin đơn hàng
    } catch (error) {
      toast.error("Không thể tạo đơn hàng!")
    }
  };

  let path;

  if (typeof window !== 'undefined') {
    path = window.location.href
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {

      const params = new URLSearchParams(window.location.search);

      if (typeof window !== "undefined" && params) {
        const status = params.get('status');
        const orderId1: string | null = params.get('orderId');

        if (status === 'success') {
          if (orderId1 !== null) {
            setOrderId(Number(orderId1));
          }
          setShowOrderSuccessModal(true);
        }
      }
    }
  }, [path]);

  const [orderId, setOrderId] = useState<number | undefined>(undefined);

  const handlePaymentWithOrder = async () => {
    if (!checkForm()) {
      setLoading(false);
      return;
    } else if (paymentMethod === "COD") {
      const order = await handleCreateOrder();
      if (order) {
        const listCartCheckout = cartData.map(item => ({
          productDetailSizeId: item.productDetailSize.productDetailSizeId,
          quantity: item.quantity
        }));

        try {
          await axios.post(
            `${BASE_URL}create_orderDetail`,
            listCartCheckout,
            {
              params: { orderId: order.orderId }, // truyền orderId qua params
            }
          );
          setOrderId(order.orderId);
          setShowOrderSuccessModal(true);
        } catch (error) {
          console.error('Error during payment:', error);
        }
      }
    } else if (paymentMethod === "VNPay") {
      const listCartCheckout = cartData.map(item => ({
        productDetailSizeId: item.productDetailSize.productDetailSizeId,
        quantity: item.quantity
      }));

      try {
        const order = await handleCreateOrder();
        const paymentResponse = await axios.post(
          `http://localhost:8080/api/payment/create_payment`,
          listCartCheckout,
          {
            params: { orderId: order.orderId },
          }
        );
        const paymentUrl = paymentResponse.data.url;
        // chuyển hướng đến URL thanh toán
        window.location.href = paymentUrl;
      } catch (error) {
        console.error('Error during payment:', error);
      }
    } else if (paymentMethod === "MoMo") {
      setLoading(true);
      const listCartCheckout = cartData.map(item => ({
        productDetailSizeId: item.productDetailSize.productDetailSizeId,
        quantity: item.quantity
      }));
      try {
        const order = await handleCreateOrder();
        const response = await axios.post(
          'http://localhost:8080/api/payment/create-momo-payment',
          listCartCheckout,
          {
            params: { orderId: order.orderId },
          }
        );
        const paymentUrl = response.data.payUrl;
        // chuyển hướng đến URL thanh toán
        window.location.href = paymentUrl;
      } catch (error) {
        setLoading(false);
        console.error('Thanh toán thất bại', error);
      }
    } else if (paymentMethod === "Thanh toán ví") {
      setLoading(true);
      console.log(paymentMethod);
      console.log(user1);

      if (user1 && user1?.wallet.balance >= newTotalPrice) {
        const order = await handleCreateOrder();
        if (order) {
          const listCartCheckout = cartData.map(item => ({
            productDetailSizeId: item.productDetailSize.productDetailSizeId,
            quantity: item.quantity
          }));

          try {
            await axios.post(
              `http://localhost:8080/rest/create_orderDetail`,
              listCartCheckout,
              {
                params: { orderId: order.orderId }, // truyền orderId qua params
              }
            );
            setOrderId(order.orderId);
            setShowOrderSuccessModal(true);
          } catch (error) {
            console.error('Error during payment:', error);
          }
        }
      } else {
        toast.warn("Số dư của bạn không đủ để thanh toán vui lòng chọn phương thức thanh toán khác hoặc nạp thêm tiền vào ví!");
      }

    }
  };


  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <HomeLayout>
        <div style={{ fontSize: '15px' }}>
          <div className='text-center text-danger mt-3 fw-bold text-uppercase' style={{ fontSize: '20px' }}>Thanh Toán Hóa Đơn</div>
          <div className="container pt-3 ">
            <div className="row shadow p-3 mb-5 bg-body rounded">
              <div className="col-lg-4 col-md-6 col-12">
                <div className='text-danger text-center'>Thông tin nhận hàng</div>
                <hr />
                <form className="mt-4">
                  <Form.Group className="mb-2">
                    <Form.Floating className="mb-2">
                      <Form.Control size="sm" type="text" placeholder="Họ và tên"
                        defaultValue={user1?.fullname} readOnly />
                      <Form.Label>Họ và tên</Form.Label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <FloatingLabel controlId="phoneNumber" label="Số điện thoại">
                      <Form.Select value={phoneNumberSelected ?? ''} onChange={(e) => setPhoneNumberSelected(e.target.value)}>
                        <option value="">Chọn số điện thoại</option>
                        {phoneNumbers.map(phoneNumber => (
                          <option key={phoneNumber.phoneNumberUserId}
                            value={phoneNumber.phoneNumber.phoneNumber}>
                            {phoneNumber.phoneNumber.phoneNumber}
                          </option>
                        ))}
                        <option value="other">Khác</option>
                      </Form.Select>
                    </FloatingLabel>
                    {phoneNumberSelected === 'other' && (
                      <Form.Group className="mt-2">
                        <Form.Floating className="mt-2">
                          <Form.Control size="sm" type="text" placeholder="Nhập số điện thoại khác"
                            value={customPhoneNumber} onChange={(e) => setCustomPhoneNumber(e.target.value)} />
                          <Form.Label>Nhập số điện thoại khác <b className='text-danger'>*</b></Form.Label>
                        </Form.Floating>
                      </Form.Group>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <FloatingLabel controlId="address" label="Địa chỉ">
                      <Form.Select value={addressSelected ? JSON.stringify(addressSelected) : ''}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setAddressSelected(selectedValue ? JSON.parse(selectedValue) : null);
                        }}>
                        <option value="">Chọn địa chỉ</option>
                        {addressUsers.map(addressUser => (
                          <option key={addressUser.addressUserId} value={JSON.stringify(addressUser)}>
                            {addressUser.addressDetail}, {addressUser.address.ward}, {addressUser.address.district}, {addressUser.address.province}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Form.Group>
                  {/* tỉnh */}
                  <div className="form-floating mb-2">
                    <FloatingLabel controlId="city" label={<span>Tỉnh/Thành <b className="text-danger">*</b></span>}>
                      <Form.Select onChange={handleProvinceChange} value={selectedProvince ?? ''} >
                        <option>-- Nhấn để chọn --</option>
                        {apiAddress?.map((province: Province) => (
                          <option key={province.Id} value={province.Name}>{province.Name}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  {/* huyện */}
                  <div className="form-floating mb-2">
                    <FloatingLabel controlId="district" label={<span>Quận/Huyện <b className="text-danger">*</b></span>}>
                      <Form.Select onChange={handleDistrictChange} value={selectedDistrict ?? ''} disabled={!selectedProvince}>
                        <option value="">-- Nhấn để chọn --</option>
                        {districts.map((district) => (
                          <option key={district.Id} value={district.Name}>{district.Name}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  {/* xã */}
                  <div className="form-floating mb-2">
                    <FloatingLabel controlId="ward" label={<span>Phường/Xã <b className="text-danger">*</b></span>}>
                      <Form.Select onChange={handleWardChange} value={selectedWard ?? ''} disabled={!selectedDistrict}>
                        <option value="">-- Nhấn để chọn --</option>
                        {wards.map((ward) => (
                          <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  {/* Địa chỉ cụ thể */}
                  <div className="form-floating mb-2">
                    <Form.Floating>
                      <Form.Control size="sm" type="text" placeholder="Địa chỉ chi tiết"
                        value={addressDetail ?? ''} onChange={(e) => setAddressDetail(e.target.value)} />
                      <Form.Label htmlFor="detailAddress">Địa chỉ chi tiết <b className='text-danger'>*</b></Form.Label>
                    </Form.Floating>
                  </div>
                </form>
              </div>

              {/* Cột giữa: Payment options */}
              <div className="col-lg-3 col-md-6 col-12">
                <div className='text-danger text-center'>Phương thức thanh toán</div>
                <hr />
                <div className="card list-group mt-4 my-3">
                  {/* COD */}
                  <div className="card-body d-flex list-group-item align-items-center">
                    <div className="form-check flex-grow-1">
                      <input className="form-check-input" type="radio"
                        name="paymentMethod" id="cod" checked={paymentMethod === 'COD'}
                        value={"COD"} onChange={handlePaymentMethodChange} />
                      <label className="form-check-label" htmlFor="cod">
                        Thanh toán khi nhận hàng (COD)
                      </label>
                    </div>
                    <i className="bi bi-cash" style={{ cursor: 'pointer' }} onClick={() => setOpen_1(!open_1)}></i>
                  </div>
                  {/* Ví */}
                  <div className="card-body d-flex list-group-item align-items-center">
                    <div className="form-check flex-grow-1">
                      <input className="form-check-input" type="radio"
                        name="paymentMethod" id="wallet" value={"Thanh toán ví"}
                        onChange={handlePaymentMethodChange} />
                      <label className="form-check-label" htmlFor="wallet">
                        Thanh toán bằng ví của bạn
                      </label>
                    </div>
                    <i className="bi bi-wallet" style={{ cursor: 'pointer' }} onClick={() => setOpen_1(!open_1)}></i>
                  </div>
                  {/* Collapse for bank transfer details */}
                  <Collapse in={open_1}>
                    <div id="bank-transfer-collapse" className="card-footer">
                      <p>
                        Nhận hàng rồi bạn mới cần thanh toán cho bên vận chuyển nhé. Cảm ơn bạn!
                      </p>
                    </div>
                  </Collapse>
                  {/* Vnpay */}
                  <div className="card-body d-flex list-group-item align-items-center">
                    <div className="form-check flex-grow-1">
                      <input className="form-check-input" type="radio"
                        name="paymentMethod" id="vnpay" value="VNPay"
                        onChange={handlePaymentMethodChange} />
                      <label className="form-check-label" htmlFor="vnpay">
                        Thanh toán qua ví điện tử VNPay
                      </label>
                    </div>
                    <Image
                      src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                      alt="VNPay12312"
                      width={50} height={50}
                    />
                  </div>
                  {/* MoMo */}
                  <div className="card-body d-flex list-group-item align-items-center">
                    <div className="form-check flex-grow-1">
                      <input className="form-check-input" type="radio"
                        name="paymentMethod" id="momo" value="MoMo"
                        onChange={handlePaymentMethodChange} />
                      <label className="form-check-label" htmlFor="momo">
                        Thanh toán qua ví điện tử MoMo
                      </label>
                    </div>
                    <Image
                      src="https://developers.momo.vn/v3/vi/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png"
                      alt="MoMo 123123"
                      width={50} height={50}
                    />
                  </div>
                </div>
              </div>

              {/* Cột phải: Order Summary */}
              <div className="col-lg-5 col-md-12 col-12 rounded">
                <div className='text-danger text-center'>Đơn hàng ({cartData.length} sản phẩm)</div>
                <hr />
                <div className="order-summary">
                  {/* Order Items */}
                  {cartData && cartData.map((cart, index: number) => (
                    <div key={index} style={{ maxHeight: '130px', overflowY: 'auto' }}>
                      <div className="order-item d-flex align-items-center my-3">
                        <div className="product-image me-3 position-relative">
                          <Image
                            src={`${cart.productDetailSize.productDetail.image}`}
                            className="img-fluid rounded-circle"
                            width={50} height={50}
                            alt=""
                          />
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cart.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="mb-0">{cart.productDetailSize.productDetail.product!.name}</p>
                          <small>({cart.productDetailSize.productDetail.color}, {cart.productDetailSize.size.sizeName})</small>
                        </div>
                        <span className="ms-auto fw-bold ">{formatPrice(cart.productDetailSize.price * cart.quantity)}</span>
                      </div>
                    </div>
                  ))}
                  <hr />
                  {/* Discount code */}
                  <div className="my-3">
                    <div className="input-group">
                      <Form.Select onChange={handleVoucherSelectedChange} value={voucherSelected?.voucher.voucherId} >
                        <option value="">Chọn mã giảm giá</option>
                        {vouchers.length > 0 &&
                          vouchers.filter(item => item.status === "Unused" && item.voucher.status === "active")
                            .map((item) => (
                              <option key={item.voucher.voucherId} value={item.voucher.voucherId}>
                                {item.voucher.name}
                              </option>
                            ))}
                      </Form.Select>
                      <button className="btn btn-apply px-4 " type="button" style={{ backgroundColor: "#142239", color: 'white', fontSize: '15px' }}
                        onClick={applyVoucher}>
                        Áp dụng
                      </button>
                    </div>
                  </div>
                  <hr />
                  {/* Order Summary */}
                  <div className="d-flex justify-content-between my-3 fw-light">
                    <span className='fw-bold'>Tạm tính</span>
                    <span className="fw-light fw-bold">{formatPrice(totalPrice)}</span>
                  </div>
                  {/* {Phần trăm tính tiền} */}
                  <div className="d-flex justify-content-between my-3 fw-light">
                    <span>Giảm giá </span>
                    <span className="fw-light">{formatPrice(discount)}</span>
                  </div>
                  <div className="d-flex justify-content-between my-3 fw-light">
                    <span>Phí vận chuyển </span>
                    <span className="fw-light">{formatPrice(0)}</span>
                  </div>
                  <hr />
                  <div className="order-total d-flex justify-content-between">
                    <span className="fw-bold">Tổng cộng</span>
                    <span className="fw-bold text-danger">{formatPrice(newTotalPrice)}</span>
                  </div>
                  <div className="order-total d-flex justify-content-between align-items-center my-4">
                    <Link href={"/cart"} className="text-reset text-decoration-none">
                      <span className="fst-italic">
                        <i className="bi bi-chevron-left"></i> Trở về giỏ hàng
                      </span>
                    </Link>

                    <Button onClick={handlePaymentWithOrder} className="btn px-3" style={{ backgroundColor: "#142239", color: 'white', fontSize: '15px' }} disabled={loading}>Thanh toán</Button>
                  </div>
                </div>
              </div>

            </div>
          </div >
        </div>
        <ModalOrderSuccess
          showOrderSuccessModal={showOrderSuccessModal}
          setShowOrderSuccessModal={setShowOrderSuccessModal}
          orderId={orderId}
        />
      </HomeLayout >
    </Suspense>
  );
};

export default CheckoutPage;
