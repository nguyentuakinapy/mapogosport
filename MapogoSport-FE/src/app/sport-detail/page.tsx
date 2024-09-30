
"use client";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import Link from 'next/link'
import HomeLayout from '@/components/HomeLayout';

const SportDetail = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    // const [selected, setSelected] = useState(false);
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (

        <HomeLayout>
            <Container className='pt-2'>
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
                    {/* Hình ảnh sản phẩm */}
                    <Carousel className='ms-auto col-8' >
                        <Carousel.Item>
                            <Image src="/img/demo-sport.jpg" alt="Hình ảnh sản phẩm" width={853} height={460} style={{ borderRadius: '10px' }} />
                        </Carousel.Item>
                        <Carousel.Item>
                            <Image src="/img/demo-sport.jpg" alt="Hình ảnh sản phẩm" width={850} height={460} style={{ borderRadius: '10px' }} />
                        </Carousel.Item>
                        <Carousel.Item>
                            <Image src="/img/demo-sport.jpg" alt="Hình ảnh sản phẩm" width={850} height={460} style={{ borderRadius: '10px' }} />
                        </Carousel.Item>
                    </Carousel>

                    <div className="container1 col-4" style={{ borderRadius: '10px' }}>
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
                        <div className="extends mt-2 mb-2">
                            <div className="title ms-2">Dịch vụ tiện ích</div>
                            <div className="list-extends mt-3">
                                <span className="item-extends"><i className="bi bi-wifi"></i>wifi</span>
                                <span className="item-extends"><i className="bi bi-car-front-fill"></i>Bãi đổ oto My lo lo lo lo lo lo</span>
                                <span className="item-extends"><i className="bi bi-wifi"></i>wifi</span>
                                <span className="item-extends"><i className="bi bi-car-front-fill"></i>Bãi đổ oto My lo lo lo lo lo lo</span>
                                <span className="item-extends"><i className="bi bi-wifi"></i>wifi</span>
                                <span className="item-extends"><i className="bi bi-car-front-fill"></i>Bãi đổ oto My lo lo lo lo lo lo</span>
                            </div>
                        </div>
                    </div>
                </Row>


                <div className="d-flex mt-3">
                    <Form className="col-4 container1" style={{ borderRadius: '10px' }}>
                        <div className="info-header ms-2 mt-3 mb-3">
                            <span className="info-line"></span>
                            <span className="info-text">Đặt sân theo yêu cầu</span>
                        </div>
                        <Row>
                            <Col className='ms-3 me-3'>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control mb-3"
                                    minDate={new Date()}
                                    placeholderText="Chọn ngày"
                                    popperPlacement="bottom-end"
                                    calendarStartDay={1}
                                    showPopperArrow={false}
                                />
                            </Col>
                            <Col className='ms-3 me-3'>
                                <Form.Control className='mb-3' type="time" />
                            </Col>
                        </Row>
                        <Col className='ms-3 me-3'>
                            <Form.Select className="mb-3">
                                <option>Chọn giờ</option>
                                <option value="1">1 giờ</option>
                                <option value="2">2 giờ</option>
                            </Form.Select>
                        </Col>
                        <Col className='me-3 ms-3'>
                            <Form.Control className="mb-3" as="textarea" rows={3} placeholder='ghi chú' />
                        </Col>
                        <Col className='me-3 ms-3'>
                            <Button className='btn btn-outline-info w-100 text-white mb-3'>Tìm sân</Button>
                        </Col>
                    </Form>


                    <div className="col-8 container1" style={{ borderRadius: '10px', marginLeft: '10px' }} >
                        <Row>
                            <div className="col-2 mt-2 mb-4" >
                                <Form.Select className='ms-2 ' >
                                    <option value="1">Sân 1</option>
                                    <option value="1">Sân 2</option>
                                </Form.Select>
                            </div>
                            {/* <div className="col-5 text-center" >

                            </div>
                            <div className="col-5 mt-2 text-end">
                                <button
                                    className="btn btn-outline-info me-2 text-black col"
                                    style={{ backgroundColor: selected === true ? '#0dcaf0' : '' }}
                                    onClick={() => setSelected(true)}
                                >
                                    Khung sáng
                                </button>
                                <button
                                    className="btn btn-outline-info me-2 text-black col"
                                    style={{ backgroundColor: selected === false ? '#0dcaf0' : '' }}  // Highlight if 'chiều' is selected
                                    onClick={() => setSelected(false)}  // Set 'chiều' as the selected state
                                >
                                    Khung chiều
                                </button>
                            </div> */}
                        </Row>

                        <Row className='m-auto'>
                            <div className="col-3">
                                <button type="button" className='btn btn-outline-info text-dark ms-4 mb-4'>13h-14h30 <br /> 400K</button>
                            </div>
                            <div className="col-3">
                                <button type="button" className='btn btn-outline-info text-dark ms-4 mb-4'>13h-14h30 <br /> 400K</button>
                            </div>
                            <div className="col-3">
                                <button type="button" className='btn btn-outline-info text-dark ms-4 mb-4'>13h-14h30 <br /> 400K</button>
                            </div>
                            <div className="col-3">
                                <button type="button" className='btn btn-outline-info text-dark ms-4 mb-4'>13h-14h30 <br /> 400K</button>
                            </div>
                            <div className="col-3">
                                <button type="button" className='btn btn-outline-info text-dark ms-4 mb-4'>13h-14h30 <br /> 400K</button>
                            </div>

                        </Row>
                    </div>
                </div>
                <br />
                <br /><br /><br />
            </Container>
        </HomeLayout>


    );
};

export default SportDetail;
