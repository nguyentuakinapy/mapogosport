'use client'
import HomeLayout from '@/components/HomeLayout';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { formatPrice } from '@/components/Utils/Format';

// import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
const PaymentPage = () => {
    // Dữ liệu giỏ hàng
    const [data, setData] = useState([]);
    const [cartIds, setCartIds] = useState([]);
    const userSession = sessionStorage.getItem('user');
    const user = userSession ? JSON.parse(userSession) : null;
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Hàm lấy dữ liệu giỏ hàng
        const fetchData = async () => {
            if (cartIds && cartIds.length > 0) { // Chỉ thực hiện khi cartIds có dữ liệu
                try {
                    // Tạo đường dẫn với cartIds được nối thành chuỗi, giả sử API yêu cầu dạng này
                    const response = await axios.get(`http://localhost:8080/rest/checkout_product/${cartIds.join(",")}`);
                    setData(response.data); // Lưu dữ liệu giỏ hàng vào state
                    console.log(">>> check data checkout: ", response.data);
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
            console.log("Tổng giá trị của giỏ hàng:", total);
        }
    }, [data]);

    return (
        );
};

export default PaymentPage;
