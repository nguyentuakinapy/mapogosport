
"use client";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import the styles

const SportDetail = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="fs-3 ">Sân bóng bóng bóng bang bang</h1>
                    <div className='mb-3'>
                        <i className="bi bi-geo-alt-fill fs-3 ms-3"></i>
                        <span>Công Viên phần mềm Quang Trung, Q12</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="grid col-8">
                    {/* Correct usage of img tag */}
                    <img className="large" src="/img/demo-sport.jpg" alt="San ball" />
                    <img className="small" src="/img/demo-sport.jpg" alt="San ball" />
                    <img className="small" src="/img/demo-sport.jpg" alt="San ball" />
                    <img className="small" src="/img/demo-sport.jpg" alt="San ball" />
                    <img className="small" src="/img/demo-sport.jpg" alt="San ball" />
                    <img className="small" src="/img/demo-sport.jpg" alt="San ball" />
                </Col>
                <Col className="container1 col-4" style={{ borderRadius: '10px' }}>
                    <div className="info-header ms-2 mt-3">
                        <span className="info-line"></span>
                        <span className="info-text">Thông tin sân</span>
                    </div>
                    <div className="ms-4 mt-3">
                        <span>Giờ mở cửa: </span>
                        <span style={{ float: 'right' }} className="me-4">8:00 AM</span>
                    </div>
                    <div className="ms-4 mt-3">
                        <span>Số Sân thi đấu: </span>
                        <span style={{ float: 'right' }} className="me-4">3 Sân</span>
                    </div>
                    <div className="ms-4 mt-3">
                        <span>Giá Sân: </span>
                        <span style={{ float: 'right' }} className="me-4">100 tỷ</span>
                    </div>
                    <div className="ms-4 mt-3">
                        <span>Giá Sân giờ vàng: </span>
                        <span style={{ float: 'right' }} className="me-4">1000 tỷ</span>
                    </div>
                    <div className="extends mt-4">
                        <div className="title ms-2">Dịch vụ tiện ích</div>
                        <div className="list-extends mt-3">
                            <span className="item-extends"><i className="bi bi-wifi"></i>wifi</span>
                            <span className="item-extends"><i className="bi bi-car-front-fill"></i>Bãi đổ oto</span>
                            <span className="item-extends"><i className="bi bi-wifi"></i>wifi</span>
                            <span className="item-extends"><i className="bi bi-car-front-fill"></i>Bãi đổ oto</span>
                            <span className="item-extends"><i className="bi bi-wifi"></i>wifi</span>
                            <span className="item-extends"><i className="bi bi-car-front-fill"></i>Bãi đổ oto</span>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Form for Booking */}
            <Form className="col-4 container1 mt-4" style={{ borderRadius: '10px' }}>
                <div className="info-header ms-2 mt-3 mb-3">
                    <span className="info-line"></span>
                    <span className="info-text">Đặt sân theo yêu cầu</span>
                </div>
                <Form.Control className="mb-3 " type="text" placeholder="Nhập tên" />
                <Form.Control className="mb-3 " type="text" placeholder="Nhập số điện thoại" />
                <Form.Control className="mb-3 " type="email" placeholder="Nhập email" />

                <Row >
                    <Col>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            className="form-control mb-3 "
                            minDate={new Date()}
                            placeholderText="Chọn ngày"
                            popperPlacement="bottom-end" // Ensure it opens at the bottom end
                            calendarStartDay={1} // Start the calendar on Monday
                            showPopperArrow={false} // Hide the arrow for a cleaner look
                        />
                    </Col>
                    <Col>
                        <Form.Control className='mb-3' type="time" />
                    </Col>

                </Row>
                <Form.Select className="mb-3 ">
                    <option>Chọn giờ</option>
                    <option value="1">1 giờ</option>
                    <option value="2">2 giờ</option>
                </Form.Select>

                <Form.Control className="mb-3 " as="textarea" rows={3} placeholder='ghi chú' />


                <Button className='btn btn-outline-info w-100 text-white'>Tìm sân</Button>
            </Form>
        </Container>
    );
};

export default SportDetail;
