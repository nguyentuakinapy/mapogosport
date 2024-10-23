
"use client";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import HomeLayout from '@/components/HomeLayout';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from "react-toastify";

const StarRating = ({ setRating }) => {
    const [rating, localSetRating] = useState(0); // Trạng thái cho rating hiện tại
    const [hover, setHover] = useState(0); // Trạng thái cho sao đang được hover

    const handleClick = (starValue) => {
        localSetRating(starValue); // Cập nhật trạng thái nội bộ cho rating
        setRating(starValue); // Gọi hàm từ props để cập nhật rating ở component cha
    };

    return (
        <div className="d-flex justify-content-between my-3" style={{ paddingLeft: '100px', paddingRight: '100px' }}>
            {['', '', '', '', ''].map((label, index) => {
                const starValue = index + 1; // Tính giá trị sao
                return (
                    <div
                        key={index}
                        className="text-center"
                        onMouseEnter={() => setHover(starValue)} // Khi di chuột qua
                        onMouseLeave={() => setHover(0)} // Khi không còn di chuột qua
                        onClick={() => handleClick(starValue)} // Gọi hàm handleClick khi nhấp
                    >
                        <i
                            className={`bi bi-star-fill fs-4`}
                            style={{ color: starValue <= (hover || rating) ? 'gold' : 'gray' }} // Thiết lập màu sắc của sao
                        ></i>
                    </div>
                );
            })}
        </div>
    );
};



const SportDetail = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [sportField, setSportFields] = useState<SportField>();
    const [sizeSportField, setSizeSportField] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [priceBySizeSp, setPriceBySizeSp] = useState({ price: '', peakHourPrices: '' });
    const { fieldId } = useParams();
    const [modalShow, setModalShow] = useState(false);
    // field review
    const [data, setData] = useState<Review[]>([]);
    const [user, setUser] = useState(null); // Trạng thái cho thông tin người dùng
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Kiểm tra nếu đang chạy trên client-side
            const userSession = sessionStorage.getItem('user');
            setUser(userSession ? JSON.parse(userSession) : null);

        }
    }, []);

    const MyVerticallyCenteredModal = (props) => {
        const [rating, setRating] = useState(0); // Trạng thái cho rating
        const [comment, setComment] = useState(''); // Trạng thái cho bình luận

        const handleRatingSubmit = async () => {

            if (!user || !user.username) {
                toast.warning("Bạn chưa đăng nhập !")
                return;
            }

            const ratingData = {
                sportFieldId: fieldId,
                username: user.username,
                rating: rating,
                comment: comment,
                datedAt: new Date()
            }

            try {
                const response = await fetch('http://localhost:8080/rest/fieldReview/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ratingData)
                });

                if (!response.ok) {
                    const errorMessage = await response.text(); // Nhận thông tin chi tiết từ lỗi
                    throw new Error(`Có lỗi xảy ra khi gửi đánh giá: ${errorMessage}`);
                }

                const result = await response.json();
                setData(data => [...data, result]);
                console.log("Đánh giá đã được gửi thanh công", result);
                props.onHide(); // Đóng modal sau khi gửi thành công
                toast.success("Gửi đánh giá thành công !")
            } catch (error) {
                console.error("Lỗi khi gửi đánh giá:", error);
                alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
            }



        };

        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className='ms-3'>
                        Đánh giá & nhận xét
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image
                        src="/img/cps-ant.webp"
                        alt="Hình ảnh thu nhỏ"
                        width={100} // Kích thước hình ảnh thu nhỏ
                        height={100}
                        className="rounded-circle" // Hình tròn
                    />
                    <span className='fs-4'>Hãy gửi đánh giá của bạn về chúng tôi</span>

                    <div className='mt-3 ms-3'>
                        <span className='fs-5'>Đánh giá chung</span>
                    </div>

                    {/* Đánh giá */}
                    <StarRating setRating={setRating} />
                    <hr />

                    <span className='fs-5 ms-3'>Bình Luận</span><br />
                    <div className="mb-3 mt-3 ms-5 me-5">
                        <textarea
                            className="form-control"
                            placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 ký tự)"
                            rows={4}
                            cols={40}
                            style={{ borderRadius: '8px' }}
                            onChange={(e) => setComment(e.target.value)} // Cập nhật bình luận
                        ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleRatingSubmit} className='m-auto btn btn-danger'>Gửi đánh giá</Button>
                </Modal.Footer>
            </Modal>
        );
    };
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
                    if (data.length > 0) {
                        // Set the first size as the default selected size after sizeSportField is updated
                        setSelectedSize(data[0]);
                    }
                } catch (error) {
                    console.log("Error fetching size data", error);
                }
            };
            fetchData();
        }
    }, [fieldId]);

    // Fetch price by selected size
    useEffect(() => {
        if (selectedSize && fieldId) {
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
        }
    }, [selectedSize, fieldId]);


    // Hàm fetchData để lấy dữ liệu đánh giá
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/rest/fieldReview/${fieldId}`); // API route
            setData(response.data); // Lưu đánh giá vào trạng thái
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData(); // Gọi hàm fetchData khi component mount
    }, []);

    //load 5 review 1 time
    const [visibleCount, setVisibleCount] = useState(5);
    const loadMoreReviews = () => {
        setVisibleCount(visibleCount + 5); // Tăng số bình luận hiển thị thêm 5
    };

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

                <Row className="mt-5 text-center">
                    <Col>
                        <p>Bạn đánh giá sao về sân thể thao này?</p>
                        <Button variant="danger" onClick={() => setModalShow(true)}>
                            Đánh giá ngay
                        </Button>
                    </Col>
                </Row>
                <br /><br />
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <h5 className='ms-3'>Bình luận</h5>
                {data
                    .sort((a, b) => new Date(b.datedAt) - new Date(a.datedAt)) // Sắp xếp theo ngày từ mới đến cũ
                    .slice(0, visibleCount) // Hiển thị số bình luận theo visibleCount
                    .map((review) => (
                        <Row className="mt-5 ms-5" key={review.fieldReviewId}>
                            <Col>
                                <Image
                                    src="/img/avatar.jpg"
                                    alt="Hình ảnh thu nhỏ"
                                    width={35} // Kích thước hình ảnh thu nhỏ
                                    height={35}
                                    className="rounded-circle" // Sử dụng lớp tiện ích Bootstrap để tạo hình tròn
                                />
                                <span className='me-4'>{review.user.fullname}</span> {/* Truy cập fullname từ user */}
                                <i className="bi bi-calendar me-2"></i>
                                <span>{new Date(review.datedAt).toLocaleString('vi-VN')}</span>

                                <div>
                                    {/* Hiển thị đánh giá sao dựa trên giá trị rating */}
                                    <span className="text-warning ms-5 fs-3">
                                        {'★'.repeat(review.rating)} {/* Hiển thị sao đầy */}
                                    </span>
                                    <br />
                                    <span className='ms-5'>{review.comment}</span> {/* Hiển thị bình luận đánh giá */}
                                </div>
                            </Col>
                        </Row>
                    ))}
                {visibleCount < data.length && ( // Kiểm tra nếu còn bình luận để tải thêm
                    <Row className="mt-4 text-center">
                        <Col>
                            <Button variant="primary" onClick={loadMoreReviews}>
                                Tải thêm bình luận
                            </Button>
                        </Col>
                    </Row>
                )}
                <br />
                <br /><br /><br />
            </Container>
        </HomeLayout>


    );
};

export default SportDetail;
