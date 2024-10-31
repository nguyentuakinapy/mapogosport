"use client";
import { Container, Row, Col, Form, Image, FloatingLabel, Table, Modal, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import HomeLayout from '@/components/HomeLayout';
import { useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';
import { formatDate } from '@/components/Utils/Format';
import CheckoutModal from '@/components/Booking/booking.Checkout';

type BookingsTypeOnWeek = {
    [time: string]: {
        [sport: string]: string[];
    };
};

const StarRating = ({ setRating }: { setRating: any }) => {
    const [rating, localSetRating] = useState(0); // Trạng thái cho rating hiện tại
    const [hover, setHover] = useState(0); // Trạng thái cho sao đang được hover

    const handleClick = (starValue: any) => {
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
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [sportField, setSportField] = useState<SportField | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [priceBySizeSp, setPriceBySizeSp] = useState<{ price: number, peakHourPrices: number }>({ price: 0, peakHourPrices: 0 });
    const [sportFieldDetailId, setSportFieldDetailId] = useState<number>(0);
    const { fieldId } = useParams();
    const [bookingsOnWeek, setBookingsOnWeek] = useState<BookingsTypeOnWeek>({})
    const [opening, setOpening] = useState<number>();
    const [operatingTime, setOperatingTime] = useState<number>(0);
    const [dataTimeSport, setDataTimeSport] = useState<string[]>([]);
    const [checkDataBooking, setCheckDataBooking] = useState<boolean>(false);
    const [checkDataBooking1, setCheckDataBooking1] = useState<boolean>(false);
    const [days, setDays] = useState<string[]>();
    const [dayYears, setDayYears] = useState<string[]>();
    const [selectDate, setSelectDate] = useState<number>(1);
    const [checkDataStatus, setCheckDataStatus] = useState<boolean>(true);
    const [selectedFrame, setSelectedFrame] = useState<'morning' | 'evening'>('morning');

    const [modalShow, setModalShow] = useState(false);

    const [dataReview, setDataReview] = useState<Review[]>([]);
    const [user, setUser] = useState<User>(); // Trạng thái cho thông tin người dùng
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Kiểm tra nếu đang chạy trên client-side
            const userSession = sessionStorage.getItem('user');
            setUser(userSession ? JSON.parse(userSession) : null);

        }
    }, []);

    const MyVerticallyCenteredModal = (props: any) => {
        const [rating, setRating] = useState(0); // Trạng thái cho rating
        const [comment, setComment] = useState(''); // Trạng thái cho bình luận

        const handleRatingSubmit = async () => {

            if (!user || !user.username) {
                toast.warning("Bạn chưa đăng nhập!")
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
                setDataReview(dataReview => [...dataReview, result]);
                props.onHide(); // Đóng modal sau khi gửi thành công
                toast.success("Gửi đánh giá thành công !")
            } catch (error) {
                console.error("Lỗi khi gửi đánh giá:", error);
                alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
            }



        };

        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className='ms-3'>
                        Đánh giá & nhận xét
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image src="/img/cps-ant.webp" alt="Hình ảnh thu nhỏ"
                        width={100} height={100} className="rounded-circle" />
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

    const { data: reviewData, error: reviewError, isLoading: reviewLoading } = useSWR(`http://localhost:8080/rest/fieldReview/${fieldId}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (reviewData) {
            setDataReview(reviewData);
        }
    }, [reviewData]);

    const [visibleCount, setVisibleCount] = useState(5);
    const loadMoreReviews = () => {
        setVisibleCount(visibleCount + 5); // Tăng số bình luận hiển thị thêm 5
    };

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/sport_field/${fieldId}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setSportField(data);
            if (data.sportFielDetails?.length > 0) {
                const firstDetail = data.sportFielDetails[0];
                setSportFieldDetailId(firstDetail.sportFielDetailId);
                setSelectedSize(firstDetail.size);
                setPriceBySizeSp({ price: firstDetail.price, peakHourPrices: firstDetail.peakHourPrices });
            }
        }
    }, [data]);

    useEffect(() => {
        getTime();
    }, [sportField]);

    useEffect(() => {
        if (dataTimeSport.length > 0) {
            const newBookingsOnWeek = { ...bookingsOnWeek };
            const validTimes = dataTimeSport.filter(time => time !== "undefinedh00" && time !== null);
            const sportDetails = sportField && sportField.sportFielDetails;
            if (sportDetails) {
                sportDetails.forEach((item) => {
                    validTimes.forEach((time) => {
                        if (!newBookingsOnWeek[time]) {
                            newBookingsOnWeek[time] = {};
                        }
                        if (!newBookingsOnWeek[time][item.name]) {
                            newBookingsOnWeek[time][item.name] = [];
                        }
                    });
                });
                setBookingsOnWeek(newBookingsOnWeek);
            }
            setCheckDataBooking1(!checkDataBooking1)
        }
    }, [dataTimeSport]);

    useEffect(() => {
        const newData: string[] = [];
        for (let index = 0; index < (operatingTime * 2) + 1; index++) {
            if (newData.length === 0) {
                newData.push(String(opening + "h00"));
            } else {
                if (newData[newData.length - 1].includes("h30")) {
                    const getDataTime = newData[newData.length - 2];
                    const getTime = getDataTime.match(/\d+/);
                    if (getTime) {
                        newData.push(String(Number(getTime[0]) + 1) + "h00");
                    }

                } else {
                    const getDataTime = newData[newData.length - 1];
                    const getTime = getDataTime.match(/\d+/);
                    if (getTime) {
                        const createOpening = String(getTime[0]) + "h30";
                        newData.push(createOpening);
                    }
                }
            }
        }
        const index = newData.indexOf(sportField?.opening || 'NA');
        if (index !== -1) {
            newData.splice(0, index);  // Xóa từ vị trí 0 đến index-1
        }
        setDataTimeSport((prevData) => [...prevData, ...newData]);
    }, [operatingTime]);

    const getTime = () => {
        if (sportField) {
            const open = sportField?.opening;
            const close = sportField?.closing;
            if (open && typeof open === 'string' && close && typeof close === 'string') {
                const numberOpen = open.match(/\d+/);
                const numberClose = close.match(/\d+/);
                if (numberOpen && numberClose) {
                    setOpening(Number(numberOpen[0]));
                    setOperatingTime(Number(numberClose[0]) - Number(numberOpen[0]));
                }
            }
        }
    }

    useEffect(() => {
        setDayOnWeek();
    }, []);

    const setDayOnWeek = () => {
        const today = new Date(startWeek);
        const days = [];
        const dayYears = [];
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);

            const day = nextDay.getDate().toString().padStart(2, '0');
            const month = (nextDay.getMonth() + 1).toString().padStart(2, '0');
            const weekday = weekdays[nextDay.getDay()];

            days.push(`${weekday}, ${day}-${month}`);
            dayYears.push(`${nextDay.getFullYear()}-${month}-${day}`);
        }

        setDays(days);
        setDayYears(dayYears);
    };

    useEffect(() => {
        setCheckDataBooking(prev => !prev);
    }, [checkDataBooking1]);

    const [startWeek, setStartWeek] = useState<string>(() => {
        const today = new Date();
        return new Intl.DateTimeFormat('en-CA').format(today);
    });

    const initialEndWeek = new Date();
    initialEndWeek.setDate(initialEndWeek.getDate() + 7);
    const [endWeek, setEndWeek] = useState<string>(initialEndWeek.toISOString().split('T')[0]);

    const setOnWeek = (direction: 'forward' | 'backward') => {
        const currentDate = new Date();
        const currentStart = new Date(startWeek);
        const daysToAdd = direction === 'forward' ? 7 : -7;
        if (direction === 'forward') {
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 1);
            currentStart.setDate(currentStart.getDate() + daysToAdd);
            if (currentStart > maxDate) {
                return toast.warning('Bạn chỉ có thể đặt sân trước tối đa 1 tháng từ ngày hiện tại!');
            }
        } else {
            currentStart.setDate(currentStart.getDate() + daysToAdd);
            if (currentStart < currentDate) {
                return toast.warning('Lịch đang hiển thị ở tuần này!');
            }
        }
        const newStartWeek = currentStart.toISOString().split('T')[0];
        setStartWeek(newStartWeek);
        const end = new Date(currentStart);
        end.setDate(end.getDate() + 6);
        const newEndWeek = end.toISOString().split('T')[0];
        setEndWeek(newEndWeek);
    };

    useEffect(() => {
        setDayOnWeek();
    }, [startWeek, endWeek, selectDate, checkDataBooking, selectDate]);

    useEffect(() => {
        setStatusOnWeek();
    }, [dayYears]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setStatusOnWeek();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [checkDataStatus]);

    const convertToMinutes = (time: string) => {
        const [hours, minutes] = time.split('h').map(Number);
        return (hours * 60) + minutes;
    };

    const calculateTimeDifference = (start: string, end: string) => {
        const startTotalMinutes = convertToMinutes(start);
        const endTotalMinutes = convertToMinutes(end);
        return endTotalMinutes - startTotalMinutes;
    };

    const setStatusOnWeek = async () => {
        const updatedBookingsOnWeek = { ...bookingsOnWeek };
        const currentDateTime = new Date();
        if (dayYears) {
            const response = await fetch(`http://localhost:8080/rest/user/booking/detail/getnextweek/${sportFieldDetailId}/${dayYears &&
                dayYears[0]}/${dayYears && dayYears[dayYears.length - 1]}`);

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const dataBooking = await response.json() as BookingDetail[];

            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const dayYear = dayYears[dayIndex];
                let hasBookingForDay = false;
                const bookingsForDay = dataBooking.filter(item => item.date === dayYear);
                if (bookingsForDay.length > 0) {
                    hasBookingForDay = true;
                    bookingsForDay.forEach(item => {
                        const newData: string[] = [];
                        newData.push(item.startTime);
                        for (let indexTime = 0; indexTime < calculateTimeDifference(item.startTime, item.endTime) / 30; indexTime++) {
                            if (newData[indexTime].includes("h30")) {
                                const getTime = newData[indexTime].match(/\d+/);
                                if (getTime) {
                                    newData.push(String(Number(getTime[0]) + 1) + "h00");
                                }
                            } else {
                                const getTime = newData[indexTime].match(/\d+/);
                                if (getTime) {
                                    newData.push(String(getTime[0]) + "h30");
                                }
                            }
                        }
                        if (newData[newData.length - 1] === item.endTime) {
                            newData.pop(); // Loại bỏ phần tử cuối nếu khớp với endTime
                        }

                        Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                            const sportDataTemporary = { ...sportData };
                            Object.entries(sportDataTemporary).forEach(([sport, statuses], j) => {
                                if (sport === item.sportFieldDetail.name) {
                                    const [hour, minute] = time.split('h').map(Number);
                                    const timeDate = new Date(dayYear);
                                    timeDate.setHours(hour, minute);
                                    if (timeDate < currentDateTime && dayIndex === 0) {
                                        sportDataTemporary[sport][dayIndex] = "Quá hạn";
                                    } else if (item.sportFieldDetail.status === "Hoạt động") {
                                        const timeIndex = newData.indexOf(time);
                                        sportDataTemporary[sport][dayIndex] = timeIndex >= 0 ? "Đã đặt" : "Còn trống";
                                        // if (timeIndex >= 0) {
                                        //     sportDataTemporary[sport][dayIndex] = "Đã đặt";
                                        // } else if (!sportDataTemporary[sport][dayIndex] || sportDataTemporary[sport][dayIndex] === "Còn trống") {
                                        //     sportDataTemporary[sport][dayIndex] = "Còn trống";
                                        // }
                                    } else {
                                        sportDataTemporary[sport][dayIndex] = "Tạm đóng";
                                    }
                                }
                            });
                            updatedBookingsOnWeek[time] = sportDataTemporary;
                        });
                    });
                }

                if (!hasBookingForDay) {
                    Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                        const sportDataTemporary = { ...sportData };
                        const [hour, minute] = time.split('h').map(Number);
                        const timeDate = new Date(dayYear);
                        timeDate.setHours(hour, minute);
                        Object.entries(sportDataTemporary).forEach(([sport, statuses], j) => {
                            const sportStatus = sportField?.sportFielDetails.find(detail => detail.name === sport);
                            if (sportStatus) {
                                sportDataTemporary[sport][dayIndex] = timeDate < currentDateTime && dayIndex === 0
                                    ? "Quá hạn"
                                    : sportStatus.status === "Hoạt động"
                                        ? "Còn trống"
                                        : "Tạm đóng";
                            }
                        });

                        updatedBookingsOnWeek[time] = sportDataTemporary;
                    });
                }
            }
            setBookingsOnWeek(updatedBookingsOnWeek);
        }
    };

    const handleDateChange = (date: Date | null) => setSelectedDate(date);

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = e.target.value;
        setSelectedSize(selectedSize);
        const selectedDetail = sportField?.sportFielDetails.find(detail => detail.size === selectedSize);
        if (selectedDetail) {
            setPriceBySizeSp({ price: selectedDetail.price, peakHourPrices: selectedDetail.peakHourPrices });
        }
    };

    const getBadgeClass = (status: string) => {
        switch (status) {
            case "Đã đặt":
                return "frame-info-secondary";
            case "Còn trống":
                return "frame-info-available";
            case "Tạm đóng":
                return "frame-info-danger";
            case "Quá hạn":
                return "frame-info-secondary";
            default:
                return "";
        }
    };

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (sportField) {
            const openHour = parseInt(sportField.opening.split(':')[0], 10);
            const closeHour = parseInt(sportField.closing.split(':')[0], 10);
            if (currentHour < 15 && currentHour >= openHour) {
                setSelectedFrame('morning');
            } else if (currentHour >= 15 && currentHour < closeHour) {
                setSelectedFrame('evening');
            }
        }
    }, [sportField]);

    const filterTimesByFrame = (time: string) => {
        const hour = parseInt(time.split('h')[0], 10);
        if (sportField) {
            const openHour = parseInt(sportField.opening.split(':')[0], 10);
            const closeHour = parseInt(sportField.closing.split(':')[0], 10);
            if (selectedFrame === 'morning') {
                return hour >= openHour && hour < 15;
            } else if (selectedFrame === 'evening') {
                return hour >= 15 && hour < closeHour;
            }
        }
        return false;
    };

    const [sportDetail, setSportDetail] = useState<SportFieldDetail>();
    const [startTime, setStartTime] = useState("");
    const [dayStartBooking, setDayStartBooking] = useState("");
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

    const handleBooking = (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetail = event.currentTarget.getAttribute("sport-detail");
        const startTime = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = event.currentTarget.getAttribute("day-data");
        const selectedSportDetail = sportField?.sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));
        if (sportDetail && startTime && dayStartBooking) {
            setSportDetail(selectedSportDetail);
            setStartTime(startTime);
            setDayStartBooking(dayStartBooking);
            setShowBookingModal(true);
            // toast.success(sportDetail + " - " + timeStart + " - " + dayStartBooking);
        }
    }

    if (isLoading) return <HomeLayout><div>Đang tải...</div></HomeLayout>;
    if (error) return <HomeLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></HomeLayout>;

    return (
        <HomeLayout>
            <Container style={{ fontSize: '15px' }}>
                <div className='mt-3'>
                    <div className="info-detail-head">
                        <b className='sport-title-detail'>{sportField?.name}</b>
                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div className="address">
                                <i className="bi bi-geo-alt-fill me-1"></i>
                                <span>{sportField?.address}</span>
                            </div>
                            <div className='star-comment'>
                                <div className="star">
                                    Đánh giá: 4/5 <i className="bi bi-star-fill"></i> (1 Đánh giá)
                                </div>
                                <div className="btn-option-icon">
                                    <i className="bi bi-heart-fill"></i>
                                </div>
                            </div>
                        </div>
                        <Row>
                            <Col lg={8}>
                                <Image src="/img/demo-sport.jpg" width={850} height={450} rounded />
                            </Col>
                            <Col lg={4}>
                                <div className="sportField-info-detail bg-white">
                                    <b className="title-detail-sportField">Thông tin sân</b>
                                    <div className="info mt-3">
                                        <div className="item">
                                            <span className="title">Giờ mở cửa:</span>
                                            <b>{sportField?.opening} - {sportField?.closing}</b>
                                        </div>
                                        <div className="item">
                                            <span className="title">Số sân thi đấu:</span>
                                            <b>{sportField?.quantity} Sân</b>
                                        </div>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel controlId="selectSize" label="Chọn loại sân">
                                                <Form.Select value={selectedSize} onChange={handleSizeChange}>
                                                    {sportField?.sportFielDetails && [...new Set(sportField.sportFielDetails.map((detail) => detail.size))].map((size) => (
                                                        <option value={size} key={size}>{size}</option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <div className="item">
                                            <span className="title">Giá sân:</span>
                                            <b>{priceBySizeSp.price.toLocaleString()} đ</b>
                                        </div>
                                        <div className="item">
                                            <span className="title">Giá sân giờ vàng:</span>
                                            <b>{priceBySizeSp.peakHourPrices.toLocaleString()} đ</b>
                                        </div>
                                    </div>
                                    <div className="extends">
                                        <b className="title">Dịch vụ tiện ích</b>
                                        <div className='mt-2'>{sportField?.decription}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Row className='mt-3'>
                    <Col md={3} xs={12}>
                        <div className="section-form-sportField bg-white">
                            <b className="title-detail-sportField">Đặt sân theo nhu cầu</b>
                            <Form className='mt-3'>
                                <Form.Group>
                                    <Row>
                                        <Col xs={6}>
                                            <DatePicker selected={selectedDate} onChange={handleDateChange}
                                                className="form-control" placeholderText="Chọn ngày"
                                                dateFormat="dd/MM/yyyy" minDate={new Date()} required />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formTimeInput" className='mb-3'>
                                                <Form.Control type="time" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Select>
                                        <option value="1">1 giờ</option>
                                        <option value="2">1,5 giờ</option>
                                        <option value="3">2 giờ</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Select value={selectedSize} onChange={handleSizeChange}>
                                        {sportField?.sportFielDetails && [...new Set(sportField.sportFielDetails.map((detail) => detail.size))].map((size) => (
                                            <option value={size} key={size}>Sân {size}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <FloatingLabel controlId="noteSportField" label="Ghi chú">
                                        <Form.Control as="textarea" placeholder="Leave a comment here" style={{ height: '100px' }} maxLength={500} />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <button className='btn-sportField'>Đặt sân</button>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} xs={12}>
                        <div className="book-calendar bg-white">
                            <div className='header-book mb-4'>
                                <Form.Select value={sportFieldDetailId} onChange={(e) => { setSportFieldDetailId(Number(e.target.value)) }}>
                                    {sportField && sportField.sportFielDetails.map((detail) => (
                                        <option value={detail.sportFielDetailId} key={detail.sportFielDetailId}>
                                            {detail.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <div className="header-date">
                                    <i className="bi bi-arrow-left" onClick={() => setOnWeek('backward')}></i>
                                    <span className="mx-3">Từ {formatDate(startWeek)} đến {formatDate(endWeek)}</span>
                                    <i className="bi bi-arrow-right" onClick={() => setOnWeek('forward')}></i>
                                </div>
                                <div className="time-frame">
                                    <div className={`btn btn-frame ${selectedFrame === 'morning' ? 'active' : ''}`}
                                        onClick={() => setSelectedFrame('morning')}>
                                        Khung sáng
                                    </div>
                                    <div className={`btn btn-frame ms-2 ${selectedFrame === 'evening' ? 'active' : ''}`}
                                        onClick={() => setSelectedFrame('evening')} >
                                        Khung tối
                                    </div>
                                </div>
                            </div>
                            <div className='book-calendar-content'>
                                <div className='d-flex'>
                                    <div className='table-price'>
                                        <Table className='text-center'>
                                            <tbody>
                                                {days && days.map((day, dayIndex) => (
                                                    <tr key={dayIndex}>
                                                        <td>{day}</td>
                                                        {Object.entries(bookingsOnWeek).filter(([time]) => filterTimesByFrame(time))
                                                            .map(([time, sportData], timeIndex) => {
                                                                const sportFielDetails = sportField?.sportFielDetails.filter(detail =>
                                                                    detail.sportFielDetailId === sportFieldDetailId
                                                                )
                                                                return sportFielDetails?.map((item, sportIndex) => (
                                                                    <td key={`${time}-${item.sportFielDetailId}-${dayIndex}`}>
                                                                        {Object.entries(sportData).map(([sport, status]) => (
                                                                            sport === item.name && (
                                                                                <div key={`${sport}-${timeIndex}-${dayIndex}`} className={`${getBadgeClass(status[dayIndex])}`}
                                                                                    sport-detail={item.sportFielDetailId}
                                                                                    time-data={time}
                                                                                    day-data={dayYears && dayYears[dayIndex]}
                                                                                    onClick={status[dayIndex] === 'Còn trống' ? handleBooking : undefined}>
                                                                                    <span className='time-label'>{time}</span>
                                                                                    <div className='status-label'>{status[dayIndex]}</div>
                                                                                </div>
                                                                            )
                                                                        ))}
                                                                    </td>
                                                                ));
                                                            })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
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
                {dataReview.sort((a: any, b: any) => new Date(b.datedAt).getTime() - new Date(a.datedAt).getTime()) // Sắp xếp theo ngày từ mới đến cũ
                    .slice(0, visibleCount) // Hiển thị số bình luận theo visibleCount
                    .map((review: any) => (
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
                <CheckoutModal showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal}
                    sportDetail={sportDetail} startTime={startTime} dayStartBooking={dayStartBooking}
                    sport={sportField} owner={sportField?.owner}
                    checkDataStatus={checkDataStatus} setCheckDataStatus={setCheckDataStatus}
                />
            </Container>
        </HomeLayout>
    );
};

export default SportDetail;
