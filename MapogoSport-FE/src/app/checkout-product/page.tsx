'use client'
import HomeLayout from '@/components/HomeLayout';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Col, FloatingLabel, Form, InputGroup, Row } from 'react-bootstrap';
import { formatPrice } from '@/components/Utils/Format';

// import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { useData } from '../context/UserContext';
import useSWR from 'swr';
import { toast } from 'react-toastify';
const CheckoutPage = () => {
  const [open, setOpen] = useState(false);
  const [open_1, setOpen_1] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dữ liệu giỏ hàng
  const [data, setData] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user1, setUser1] = useState<User>();

  // const products = localStorage.getItem('productIds');
  useEffect(() => {
    const storedCartIds = localStorage.getItem('CartIds');
    if (storedCartIds) {
      setCartIds(JSON.parse(storedCartIds));
    }
  }, []);


  useEffect(() => {
    // Hàm lấy dữ liệu giỏ hàng
    const fetchData = async () => {
      if (cartIds && cartIds.length > 0) { // Chỉ thực hiện khi cartIds có dữ liệu
        try {
          // Tạo đường dẫn với cartIds được nối thành chuỗi, giả sử API yêu cầu dạng này
          const response = await axios.get(`http://localhost:8080/rest/checkout_product/${cartIds.join(",")}`);
          setData(response.data); // Lưu dữ liệu giỏ hàng vào state
          console.log("1>>> check data checkout: ", response.data);
        } catch (err) {
          console.log('Lỗi:', err);
        }
      }
    }
    fetchData();
  }, [cartIds]);

  useEffect(() => {
    if (data && data.length > 0) {
      const total = data.reduce((sum, cart) => sum + cart.productDetailSize.price * cart.quantity, 0);
      setTotalPrice(total);
      // console.log("Tổng giá trị của giỏ hàng:", total);
      setNewTotalPrice(total);
    }
  }, [data]);

  // useEffect(() => {
  //   const userSession = sessionStorage.getItem('user');
  //   const user = userSession ? JSON.parse(userSession) : null;
  //   setUser(user); // Cập nhật user từ sessionStorage
  //   if (user) {
  //     axios.get(`http://localhost:8080/rest/user/address/${user.username}`)
  //       .then(response => {
  //         setAddressUsers(response.data)
  //         console.log("response.data", response.data);
  //       })
  //       .catch(error => console.error('Error:', error));
  //   }
  // }, []);

  const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');
  const [addressUsers, setAddressUsers] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [phoneNumberSelected, setPhoneNumberSelected] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState('');
  const [fee, setFee] = useState();

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setUsernameFetchApi(`http://localhost:8080/rest/user/${username}`);
    }
  }, []);

  const { data: userData } = useSWR(usernameFetchApi, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });


  useEffect(() => {
    if (userData) {
      setUser1(userData);
      setAddressUsers(userData.addressUsers || []);

      setPhoneNumbers(userData.phoneNumberUsers || []);
      const activePhone = userData.phoneNumberUsers.find(item => item.active);
      if (activePhone) {
        setPhoneNumberSelected(activePhone?.phoneNumber?.phoneNumber);
      }

      const unusedVouchers = userData.userVouchers?.filter(voucher => voucher.status === "Unused");
      setVouchers(unusedVouchers);
    }
  }, [userData]);

  const { data: apiAddress } = useSWR("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [addressSelected, setAddressSelected] = useState([null]);

  const [maQuan, setmaQuan] = useState();

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    const selectedProvinceData = apiAddress.find((province: any) => province.Name === provinceName);
    setDistricts(selectedProvinceData?.Districts || []);
    setWards([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    const selectedDistrictData = districts.find((district: any) => district.Name === districtName);
    setmaQuan(selectedDistrictData?.Id);
    setWards(selectedDistrictData?.Wards || []);
    setSelectedWard('');
  };
  // console.log("ma quan:", maQuan);

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardName = e.target.value;
    setSelectedWard(wardName);
  };

  //tính fee ship
  // const API_URL = 'https://partner.viettelpost.vn/v2/order/getPrice';

  // async function calculateShippingFee() {
  //   const requestData = {
  //     "MONEY_TOTAL_OLD": 212069,
  //     "MONEY_TOTAL": 184085,
  //     "MONEY_TOTAL_FEE": 131410,
  //     "MONEY_FEE": 23190,
  //     "MONEY_COLLECTION_FEE": 12750,
  //     "MONEY_OTHER_FEE": 0,
  //     "MONEY_VAS": 0,
  //     "MONEY_VAT": 16735,
  //     "KPI_HT": 24
  //     from_district: 79, // Mã quận người gửi
  //     to_district: maQuan,   // Mã quận người nhận
  //     weight: 1000,        // Trọng lượng gói hàng (1kg)
  //     length: 30,          // Chiều dài (cm)
  //     width: 20,           // Chiều rộng (cm)
  //     height: 10,          // Chiều cao (cm)
  //     service_type: 2      // Loại dịch vụ (1: tiết kiệm, 2: nhanh)
  //   };
  //   const API_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzY2ODk5MTMzIiwiVXNlcklkIjoxNImV4cCI6MTYl7sfjAsVH0rwzKEGICj0g';
  //   try {
  //     const response = await axios.post(API_URL, requestData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Token': API_KEY
  //       }
  //     });
  //     console.log('Phí vận chuyển:', response.data.data.fee);
  //     console.log('Thời gian giao hàng:', response.data.data.delivery_time);
  //   } catch (error) {
  //     console.error('Lỗi khi tính phí vận chuyển:', error.response ? error.response.data : error.message);
  //   }
  // }

  useEffect(() => {
    if (addressSelected) {
      setSelectedProvince(addressSelected?.address?.province);
      setSelectedDistrict(addressSelected?.address?.district);
      setSelectedWard(addressSelected?.address?.ward);
      setAddressDetail(addressSelected?.addressDetail);

      const selectedProvinceData = apiAddress?.find((province: any) => province.Name === addressSelected?.address?.province);
      setDistricts(selectedProvinceData?.Districts || []);
      const selectedDistrictData = selectedProvinceData?.Districts.find((district: any) => district.Name === addressSelected?.address?.district);
      setWards(selectedDistrictData?.Wards || []);
      setmaQuan(selectedDistrictData?.Id);
      // calculateShippingFee();
    } else {
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
      setAddressDetail('');
    }
  }, [addressSelected, apiAddress]);


  const [urlPayment, setUrlPayment] = useState();
  const [order, setOrder] = useState();
  const [note, setNote] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMethod = e.target.value;
    if (selectedMethod === 'COD') {
      setOrderStatus('Chờ xác nhận');
    } else if (selectedMethod === 'VNPay' || selectedMethod === "MoMo") {
      setOrderStatus('Chờ thanh toán');
    }
    setPaymentMethod(selectedMethod);
  };

  const [voucher, setVoucher] = useState();
  const [discount, setDiscount] = useState(0);
  const [newTotalPrice, setNewTotalPrice] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8080/rest/findVoucher/${voucherSelected}`)
      .then(response => {
        setVoucher(response.data)
        // console.log("Voucher: ", response.data);
      })
      .catch(error => console.error('Error:', error));

  }, [voucherSelected]);

  const applyVoucher = async () => {
    if (!voucherSelected) {
      toast.error("Vui lòng chọn mã giảm giá");
      return;
    }
    if (voucher?.discountPercent && totalPrice) {
      const calculatedDiscount = (totalPrice * voucher.discountPercent) / 100;
      setDiscount(calculatedDiscount);

      const calculatedTotalPrice = totalPrice - calculatedDiscount;
      setNewTotalPrice(calculatedTotalPrice);
    }
  };

  const checkForm = () => {
    const errors = []; // Mảng lưu trữ các thông báo lỗi

    if (!user1) {
      errors.push('Người dùng không tồn tại');
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
      return false; // Trả về false để biểu thị rằng kiểm tra không thành công
    }

    return true; // Trả về true nếu tất cả các trường hợp đều hợp lệ
  };

  const handleCreateOrder = async () => {
    if (!checkForm()) {
      setLoading(false);
      return;
    }
    const addressParts = [selectedProvince, selectedDistrict, selectedWard, addressDetail];
    const address1 = addressParts.filter(part => part).join(', ');
    const orderData = {
      username: user1?.username,
      address: address1,
      // phoneNumber: addressSelected.phoneNumber,
      phoneNumber: phoneNumberSelected,
      date: new Date().toISOString(), // Chuyển đổi sang ISO string
      status: orderStatus,
      amount: newTotalPrice,
      paymentMethod: paymentMethod,
      voucherId: voucher?.voucherId ?? '',
      note: note, // Hoặc ghi chú hợp lệ
      shipFee: 0.0,// Hoặc giá trị phí vận chuyển
      userVoucherId: voucherSelected
    };

    try {
      const response = await axios.post('http://localhost:8080/rest/create_order', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Dữ liệu trả về từ API:", response.data);

      setOrder(response.data);
      return response.data; // Trả về thông tin đơn hàng
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw new Error('Không thể tạo đơn hàng'); // Ném lại lỗi để xử lý sau
    }
  };

  const handlePaymentWithOrder = async () => {
    setLoading(true);

    if (paymentMethod === "COD") {
      const order = await handleCreateOrder();
      window.location.href = `/checkout-product/order`;
    } else if (paymentMethod === "VNPay") {
      const listCartCheckout = data.map(item => ({
        productDetailSizeId: item.productDetailSize.productDetailSizeId,
        quantity: item.quantity
      }));

      try {
        const order = await handleCreateOrder();
        const paymentResponse = await axios.post(
          `http://localhost:8080/api/payment/create_payment`,
          listCartCheckout,
          {
            params: { orderId: order.orderId }, // truyền orderId qua params
          }
        );
        const paymentUrl = paymentResponse.data.url;
        // chuyển hướng đến URL thanh toán
        window.location.href = paymentUrl;

      } catch (error) {

        console.error('Error during payment:', error);
      }
    }else if(paymentMethod==="MoMo"){
      // Gửi yêu cầu thanh toán tới API Next.js
      const response = await fetch('/api/create-momo-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50000 }),  // Số tiền cần thanh toán
      });

      const result = await response.json();
      console.log(result);

      // Nếu MoMo trả về URL thanh toán, điều hướng người dùng tới đó
      if (result.payUrl) {
        window.location.href = result.payUrl;
      } else {
        console.error('Thanh toán thất bại');

      }
    }

  };

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
              {/* Họ và tên */}
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Họ và tên"
                  defaultValue={user1?.fullname}
                />
                <label htmlFor="name" style={{ color: "gray" }}>Họ và tên</label>
              </div>
              {/* NumberPhone */}
              <div className="mb-2">
                <InputGroup className="">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="city"
                      value={phoneNumberSelected ?? ''}
                      onChange={(e) => setPhoneNumberSelected(e.target.value)}
                    >
                      {phoneNumbers.map(phoneNumber => (
                        <option
                          key={phoneNumber.phoneNumberUserId}
                          value={phoneNumber.phoneNumber.phoneNumber}
                        >
                          {phoneNumber.phoneNumber.phoneNumber}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="phone" style={{ color: "gray" }}>Số điện thoại</label>
                  </div>
                </InputGroup>
              </div>
              {/* address */}
              <div className="form-floating mb-2">
                <select
                  className="form-select"
                  id="city"
                  value={addressSelected ? JSON.stringify(addressSelected) : ''}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setAddressSelected(selectedValue ? JSON.parse(selectedValue) : null);
                    // setSelectedProvince(selectedValue ? JSON.parse(selectedValue?.address?.province ?? '') : null)
                  }}
                >
                  <option value="">Chọn địa chỉ</option>
                  {addressUsers.map(addressUser => (
                    <option
                      key={addressUser.addressUserId}
                      value={JSON.stringify(addressUser)}
                    >
                      {addressUser.addressDetail}, {addressUser.address.ward}, {addressUser.address.district}, {addressUser.address.province}
                    </option>
                  ))}
                </select>
                <label htmlFor="city" style={{ color: "gray" }}>Địa chỉ</label>
              </div>
              {/* tỉnh */}
              <div className="form-floating mb-2">
                <FloatingLabel controlId="city" label={<span>Tỉnh/Thành <b className="text-danger">*</b></span>}>
                  <Form.Select aria-label="Floating label select example"
                    onChange={handleProvinceChange} value={selectedProvince ?? ''} >
                    <option>-- Nhấn để chọn --</option>
                    {apiAddress?.map((province: any) => (
                      <option key={province.Id} value={province.Name}>{province.Name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </div>
              {/* huyện */}
              <div className="form-floating mb-2">
                <FloatingLabel controlId="district" label={<span>Quận/Huyện <b className="text-danger">*</b></span>}>
                  <Form.Select aria-label="Floating label select example" onChange={handleDistrictChange}
                    value={selectedDistrict ?? ''}>
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
                  <Form.Select aria-label="Floating label select example" onChange={handleWardChange}
                    value={selectedWard ?? ''} >
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
              {/* note */}
              <div className="form-floating">
                <textarea className="form-control" id="notes" value={note}
                  onChange={(e) => setNote(e.target.value)}></textarea>
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
              {/* COD */}
              <div className="card-body d-flex list-group-item align-items-center">
                <div className="form-check flex-grow-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    aria-expanded={open}
                    value={"COD"}
                    onChange={handlePaymentMethodChange}
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
              {/* Vnpay */}
              <div className="card-body d-flex list-group-item align-items-center">
                <div className="form-check flex-grow-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="vnpay"
                    aria-expanded={open}
                    value="VNPay"
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Thanh toán qua ví điện tử VNPay
                  </label>
                </div>
                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="VNPay" style={{ maxWidth: "50px" }} />
              </div>
              {/* MoMo */}
              <div className="card-body d-flex list-group-item align-items-center">
                <div className="form-check flex-grow-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="vnpay"
                    aria-expanded={open}
                    value="MoMo"
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Thanh toán qua ví điện tử MoMo
                  </label>
                </div>
                <img src="https://developers.momo.vn/v3/vi/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png" alt="MoMo" style={{ maxWidth: "50px" }} />
              </div>
            </div>
          </div>

          {/* Cột phải: Order Summary */}
          <div className="col-lg-5 col-md-12 col-12 rounded">
            <h5 className='text-primary'>Đơn hàng ({data.length} sản phẩm)</h5>
            <hr />
            <div className="order-summary">
              {/* Order Items */}
              {data && data.map((cart, index: number) => (
                <div key={index} style={{ maxHeight: '130px', overflowY: 'auto' }}>
                  <div className="order-item d-flex align-items-center my-3">
                    <div className="product-image me-3 position-relative">
                      <img
                        src={`${cart.productDetailSize.productDetail.image}`}
                        className="img-fluid rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                        alt=""
                      />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.quantity}
                        {/* <span className="visually-hidden">quantity</span> */}
                      </span>
                    </div>
                    <div>
                      <p className="mb-0">{cart.productDetailSize.productDetail.product.name}</p>
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
                  <select
                    className="form-select"
                    id="city"
                    value={voucherSelected}
                    onChange={(e) => setVoucherSelected(e.target.value)}
                  >
                    <option value="">Chọn mã giảm giá</option>
                    {vouchers.map(voucher => (
                      <option
                        key={voucher.userVoucherId}
                        value={voucher.userVoucherId}
                      >
                        {voucher?.userVoucherId}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-apply px-4 " type="button" style={{ backgroundColor: "#fddf9f" }}
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
                <span className="fw-bold text-primary">{formatPrice(newTotalPrice)}</span>
              </div>
              <div className="order-total d-flex justify-content-between my-4">
                <a href="/cart" className="text-reset text-decoration-none">
                  <span className="fst-italic">
                    <i className="bi bi-chevron-left"></i> Trở về giỏ hàng
                  </span>
                </a>

                <Button onClick={handlePaymentWithOrder} className="btn btn-success px-3" disabled={loading}>Thanh toán</Button>
              </div>
            </div>
          </div>

        </div>
      </div >
    </HomeLayout >
  );
};

export default CheckoutPage;
