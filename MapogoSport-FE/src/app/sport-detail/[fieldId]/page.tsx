
"use client";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import Link from 'next/link'
import HomeLayout from '@/components/HomeLayout';
import { useParams } from 'next/navigation';

const SportDetail = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [sportField, setSportFields] = useState<SportField>();
    const [sizeSportField, setSizeSportField] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [priceBySizeSp, setPriceBySizeSp] = useState({ price: '', peakHourPrices: '' });
    const { fieldId } = useParams();
    // const [selected, setSelected] = useState(false);
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    // Fetch sportField by fieldId
    useEffect(() => {

        if (fieldId) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/rest/sport_field/${fieldId}`);
                    const data = await response.json();
                    setSportFields(data);
                } catch (error) {
                    console.log("Error fetching sport field data", error);
                }
            };
            fetchData();
        }
    }, [fieldId]);

    
    // Fetch size of sportFieldDetail by fieldId
    useEffect(() => {
        if (fieldId) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/rest/sport_field_detail/size/${fieldId}`);
                    const data = await response.json();
                    setSizeSportField(data);
                } catch (error) {
                    console.log("Error fetching size data", error);
                }
            };
            fetchData();
        }
    }, [fieldId]);

    // Fetch price by selected size
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/sport_field_detail/price/${fieldId}/${selectedSize}`);
                const data = await response.json();
                console.log("Price Data:", data);  // Log to check the data structure
                setPriceBySizeSp({
                    price: data[0][0],
                    peakHourPrices: data[0][1],
                });
            } catch (error) {
                console.log("Error fetching price data", error);
            }
        };
        fetchPrice();
    }, [selectedSize, fieldId]);

    return (

        <HomeLayout>
            <Container className='pt-2'>
                <Row>
                    <Col>
                        <h1 className="fs-3 ">{sportField?.name}</h1>
                        <div className='mb-3'>
                            <i className="bi bi-geo-alt-fill fs-3 ms-3"></i>
                            <span>{sportField?.address}</span>
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
                            <span style={{ float: 'right' }} className="me-4">{sportField?.opening}</span>
                        </div>
                        <div className="ms-4 mt-3">
                            <span>Số sân thi đấu: </span>
                            <span style={{ float: 'right' }} className="me-4">{sportField?.quantity}</span>
                        </div>
                        <div className="ms-4 mt-3">
                            <span>Loại sân: </span>
                            <select
                                id="selectBox"
                                className="form-select me-4"
                                style={{ float: 'right', width: '40%' }}
                                onChange={(e) => {
                                    setSelectedSize(e.target.value);
                                    console.log("Selected Size:", e.target.value);
                                }}>
                                <>
                                    <option value="Chọn loại sân">Chọn loại sân</option>
                                    {sizeSportField.map((size: string, index: number) => (
                                        <option key={index} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </>
                            </select>

                        </div>
                        <div className="ms-4 mt-4">
                            <span>Giá Sân: </span>
                            <span style={{ float: 'right' }} className="me-4">{priceBySizeSp.price || 'Chưa có giá'}</span>
                        </div>
                        <div className="ms-4 mt-3">
                            <span>Giá Sân giờ vàng: </span>
                            <span style={{ float: 'right' }} className="me-4">{priceBySizeSp.peakHourPrices || 'Chưa có giá'}</span>
                        </div>

                        <div className="extends mt-2 mb-2" style={{ background: '#dee2e6', height: '150px' }}>
                            <div className="title ms-2">Dịch vụ tiện ích</div>
                            <div className="list-extends mt-3 ms-2" style={{
                                display: 'block',
                                width: '100%',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal'
                            }}>
                                {sportField?.decription}
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
