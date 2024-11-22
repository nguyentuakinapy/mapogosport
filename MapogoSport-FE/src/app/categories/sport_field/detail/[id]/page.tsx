"use client";
import { Container, Row, Col, Form, Image, FloatingLabel, Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { formatDateVN } from '@/components/Utils/Format';
import CheckoutModal from '@/components/Booking/booking.Checkout';
import ModalReviewSportField from '@/components/Review/review.sportField';
import '../[id]/BookingDetail.scss';
import MapComponent from "../../../../utils/MapComponent";
import { fetchCoordinates } from "../../../../utils/geocode";
import SearchSportField from '@/components/Booking/booking.Search';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/app/context/UserContext';

type BookingsTypeOnWeek = {
    [time: string]: {
        [sport: string]: string[];
    };
};

const SportDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [sportField, setSportField] = useState<SportField | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [priceBySizeSp, setPriceBySizeSp] = useState<{ price: number, peakHourPrices: number }>({ price: 0, peakHourPrices: 0 });
    const [sportFieldDetailId, setSportFieldDetailId] = useState<number>(0);
    const [bookingsOnWeek, setBookingsOnWeek] = useState<BookingsTypeOnWeek>({})
    const [opening, setOpening] = useState<number>();
    const [operatingTime, setOperatingTime] = useState<number>(0);
    const [dataTimeSport, setDataTimeSport] = useState<string[]>([]);
    const [checkDataBooking, setCheckDataBooking] = useState<boolean>(false);
    const [checkDataBooking1, setCheckDataBooking1] = useState<boolean>(false);
    const [days, setDays] = useState<string[]>();
    const [dayYears, setDayYears] = useState<string[]>();
    const [checkDataStatus, setCheckDataStatus] = useState<boolean>(true);
    const [selectedFrame, setSelectedFrame] = useState<'morning' | 'evening'>('morning');
    const [sportDetail, setSportDetail] = useState<SportFieldDetail>();
    const [startTime, setStartTime] = useState("");
    const [dayStartBooking, setDayStartBooking] = useState("");
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [startTimeKey, setStartTimeKey] = useState<boolean>(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [dataReview, setDataReview] = useState<FieldReview[]>([]);
    const [showSearchBookingModal, setSearchShowBookingModal] = useState<boolean>(false);
    const [gallery, setGallery] = useState<GalleryField[]>([]);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    // const currentUser = useData();
    const [currentUser, setCurrentUser] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);

    // useEffect(()=>{
    //     toast.success("ddddddddddddddddddd 12"+ currentUser);

    // },[currentUser])


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setStatusOnWeek();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [checkDataStatus]);

    const { data: reviewData } = useSWR(`http://localhost:8080/rest/fieldReview/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [visibleCount, setVisibleCount] = useState(5);
    const loadMoreReviews = () => {
        setVisibleCount(visibleCount + 5);
    };
    const hideReviews = () => {

        setVisibleCount(visibleCount - 5);
    }

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/sport_field/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });


    /* QA thêm useParam */
    const path = useSearchParams();

    useEffect(() => {
        // console.log(path.get("status"));
        // console.log("path hieenj taij ",path.toString());
        const encodedStatus = path.get("status");

        if (encodedStatus) {
            try {
                // Giải mã username từ Base64
                const decodedUsername = atob(encodedStatus);
                console.log("Username giải mã:", decodedUsername);
            } catch (error) {
                console.error("Lỗi khi giải mã username:", error);
            }
        }
    }, [path])


    const handleChatMess = () => {
        if (data?.owner?.user?.username) {
            const ownerUsername = data.owner.user.username;
            const encodedUsername = btoa(ownerUsername);
            if (ownerUsername !== currentUser) {
                window.history.pushState({}, "", `?status=${encodedUsername}`);
            } else {
                toast.info('Bạn không thể nhắn với chính mình ')
            }
        }
    }
    /* QA thêm useParam */

    useEffect(() => {
        if (data && reviewData) {
            setSportField(data);
            setDataReview(reviewData);
            fetchCoordinates(data.address).then((coords) => {
                if (coords) setCoordinates(coords);
            });
            if (data.sportFielDetails?.length > 0) {
                const firstDetail = data.sportFielDetails[0];
                setSportFieldDetailId(firstDetail.sportFielDetailId);
                setSelectedSize(firstDetail.size);
                setPriceBySizeSp({ price: firstDetail.price, peakHourPrices: firstDetail.peakHourPrices });
            }
        }
    }, [data, reviewData]);

    useEffect(() => {
        if (sportField) {
            getTime()
        };
    }, [sportField]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/sportfield/gallery/${params.id}`)
                const data = await response.json()
                setGallery(data)
                console.log("data hht", data)
            } catch (error) {
                console.log("Lỗi khi fetch data Gallery", error)
            }
        }
        fetchData()
    }, [])


    useEffect(() => {
        if (dataTimeSport.length > 0 && sportField?.sportFielDetails) {
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
            setCheckDataBooking1(!checkDataBooking1);
        }
    }, [dataTimeSport, sportField]);

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
            newData.splice(0, index);
        }
        setDataTimeSport((prevData) => [...prevData, ...newData]);
    }, [operatingTime, opening]);

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
        const days: string[] = [];
        const dayYears: string[] = [];
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

    const [startWeek, setStartWeek] = useState<string>(() => {
        const today = new Date();
        return new Intl.DateTimeFormat('en-CA').format(today);
    });

    const initialEndWeek = new Date();
    initialEndWeek.setDate(initialEndWeek.getDate() + 7);
    const [endWeek, setEndWeek] = useState<string>(initialEndWeek.toISOString().split('T')[0]);

    useEffect(() => {
        if (startWeek) {
            setDayOnWeek();
        }
    }, [startWeek]);

    useEffect(() => {
        if (checkDataBooking1) {
            setCheckDataBooking(prev => !prev)
        };
    }, [checkDataBooking1]);

    useEffect(() => {
        if (dayYears && dayYears.length > 0 && sportFieldDetailId) {
            setStatusOnWeek();
        }
    }, [dayYears, sportFieldDetailId]);

    const setStatusOnWeek = async () => {
        const updatedBookingsOnWeek = { ...bookingsOnWeek };
        const currentDateTime = new Date();
        if (dayYears) {
            try {
                const response = await fetch(`http://localhost:8080/rest/user/booking/detail/getnextweek/${sportFieldDetailId}/${dayYears[0]}/${dayYears[dayYears.length - 1]}`);
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
                                const lastTime = newData[indexTime];
                                const getTime = lastTime.match(/\d+/);
                                if (lastTime.includes("h30") && getTime) {
                                    newData.push(String(Number(getTime[0]) + 1) + "h00");
                                } else if (getTime) {
                                    newData.push(String(getTime[0]) + "h30");
                                }
                            }

                            if (newData[newData.length - 1] === item.endTime) {
                                newData.pop();
                            }

                            Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                                const sportDataTemporary = { ...sportData };
                                Object.entries(sportDataTemporary).forEach(([sport, statuses]) => {
                                    if (sport === item.sportFieldDetail.name) {
                                        const [hour, minute] = time.split('h').map(Number);
                                        const timeDate = new Date(dayYear);
                                        timeDate.setHours(hour, minute);
                                        if (item.sportFieldDetail.status === "Hoạt động") {
                                            const timeIndex = newData.indexOf(time);
                                            if (timeIndex >= 0) {
                                                sportDataTemporary[sport][dayIndex] = "Đã đặt";
                                            } else if (dayIndex === 0 && timeDate < currentDateTime) {
                                                sportDataTemporary[sport][dayIndex] = "Quá hạn";
                                            } else if (!sportDataTemporary[sport][dayIndex] || sportDataTemporary[sport][dayIndex] === "Còn trống") {
                                                sportDataTemporary[sport][dayIndex] = "Còn trống";
                                            }
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

                            Object.entries(sportDataTemporary).forEach(([sport, statuses]) => {
                                const sportStatus = sportField?.sportFielDetails.find(detail => detail.name === sport);
                                if (sportStatus) {
                                    const [hour, minute] = time.split('h').map(Number);
                                    const timeDate = new Date(dayYear);
                                    timeDate.setHours(hour, minute);
                                    if (dayIndex === 0 && timeDate < currentDateTime) {
                                        sportDataTemporary[sport][dayIndex] = "Quá hạn";
                                    } else {
                                        sportDataTemporary[sport][dayIndex] = sportStatus.status === "Hoạt động" ? "Còn trống" : "Tạm đóng";
                                    }
                                }
                            });
                            updatedBookingsOnWeek[time] = sportDataTemporary;
                        });
                    }
                }

                setBookingsOnWeek(updatedBookingsOnWeek);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const setOnWeek = (direction: 'forward' | 'backward') => {
        const currentDate = new Date();
        const currentStart = new Date(startWeek);
        const daysToAdd = direction === 'forward' ? 8 : -7;
        if (direction === 'forward') {
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 1);
            currentStart.setDate(currentStart.getDate() + daysToAdd);
            if (currentStart > maxDate) {
                return toast.warning('Bạn chỉ có thể đặt sân trước tối đa 1 tháng từ ngày hiện tại!');
            }
        } else {
            currentStart.setDate(currentStart.getDate() + daysToAdd);
            if (currentStart.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
                return toast.warning('Lịch đang hiển thị ở tuần này!');
            }
        }
        const newStartWeek = currentStart.toISOString().split('T')[0];
        setStartWeek(newStartWeek);
        const end = new Date(currentStart);
        end.setDate(end.getDate() + 7);
        const newEndWeek = end.toISOString().split('T')[0];
        setEndWeek(newEndWeek);
    };

    useEffect(() => {
        setDayOnWeek();
    }, [startWeek, endWeek, checkDataBooking]);

    const convertToMinutes = (time: string) => {
        const [hours, minutes] = time.split('h').map(Number);
        return (hours * 60) + minutes;
    };

    const calculateTimeDifference = (start: string, end: string) => {
        const startTotalMinutes = convertToMinutes(start);
        const endTotalMinutes = convertToMinutes(end);
        return endTotalMinutes - startTotalMinutes;
    };

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
            case "Đã đặt": return "frame-info-secondary";
            case "Còn trống": return "frame-info-available";
            case "Tạm đóng": return "frame-info-danger";
            case "Quá hạn": return "frame-info-secondary";
            default: return "";
        }
    };

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (sportField) {
            const openHour = parseInt(sportField.opening.split('h')[0], 10);
            const closeHour = parseInt(sportField.closing.split('h')[0], 10);
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
            const openHour = parseInt(sportField.opening.split('h')[0], 10);
            const closeHour = parseInt(sportField.closing.split('h')[0], 10);
            if (selectedFrame === 'morning') {
                return hour >= openHour && hour < 15;
            } else if (selectedFrame === 'evening') {
                return hour >= 15 && hour < closeHour;
            }
        }
        return false;
    };

    const handleBooking = (event: React.MouseEvent<HTMLTableCellElement>) => {
        const username = localStorage.getItem('username');
        if (!username) {
            toast.error("Vui lòng đăng nhập để thực hiện chức năng!");
            return;
        }
        const sportDetail = event.currentTarget.getAttribute("sport-detail");
        const startTime = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = event.currentTarget.getAttribute("day-data");
        const selectedSportDetail = sportField?.sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));
        if (sportDetail && startTime && dayStartBooking) {
            setSportDetail(selectedSportDetail);
            setStartTime(startTime);
            setDayStartBooking(dayStartBooking);
            setShowBookingModal(true);
            setStartTimeKey(!startTimeKey);
        }
    }


    const [filteredData, setFilteredData] = useState<FieldReview[] | null>(null);
    const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
    const handleClick = (value: number) => {

        if (selectedRatingFilter === value) {
            setSelectedRatingFilter(null);
            setFilteredData(dataReview);
            return;
        }
        setSelectedRatingFilter(value);
        const fetchData = async () => {
            const response = await fetch(`http://localhost:8080/rest/find-fielreview-by-rating/${params.id}/${value}`);
            const data = await response.json();
            setFilteredData(data);
        };

        fetchData();
    };



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
                                <div className="btn-option-icon ">

                                    <i className="bi bi-heart-fill"></i>
                                    <OverlayTrigger overlay={<Tooltip>Trò chuyện</Tooltip>}>
                                        <i onClick={handleChatMess} className="bi bi-chat-dots-fill text-primary"></i>
                                    </OverlayTrigger>

                                </div>

                            </div>
                        </div>
                        <Row>
                            <Col lg={8}>
                                {gallery.length > 0 ? (
                                    <>
                                        <div id="carouselExampleControls" className="carousel slide mt-3" data-bs-ride="carousel">
                                            <div className="carousel-inner">
                                                {gallery.map((galleryItem, index) => (
                                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                        <img
                                                            src={`${galleryItem.image}`}
                                                            className="d-block w-100 h-100"
                                                            alt={`Gallery image ${index + 1}`}
                                                            style={{ width: '100px', maxHeight: '450px', objectFit: 'cover', cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    sportField && <Image src={sportField.image} width={850} height={450} rounded />

                                )}

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
                                                        <option value={size} key={size}>Sân {size}</option>
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
                <div className="book-calendar bg-white mt-3">
                    <div className='header-book mb-4'>
                        <div className='select-sport-container'>
                            <Form.Select value={sportFieldDetailId} onChange={(e) => { setSportFieldDetailId(Number(e.target.value)) }}>
                                {sportField && sportField.sportFielDetails.map((detail) => (
                                    <option value={detail.sportFielDetailId} key={detail.sportFielDetailId}>
                                        {detail.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <div className="btn btn-search-sport" onClick={() => setSearchShowBookingModal(true)}>Tìm sân</div>
                        </div>
                        <div className="header-date">
                            <i className="bi bi-arrow-left" onClick={() => setOnWeek('backward')}></i>
                            <span className="mx-3">Từ {formatDateVN(startWeek)} đến {formatDateVN(endWeek)}</span>
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
                                                                            sport-detail={item.sportFielDetailId} time-data={time}
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
                <Row className='mt-3'>
                    <Col>
                        <div className="mb-2 text-center">
                            <p>Bạn đánh giá sao về sân thể thao này?</p>
                            <Button variant="danger" onClick={() => setShowReviewModal(true)}>Đánh giá ngay</Button>
                        </div>
                        <h5 className='ms-3'>Bình luận</h5>
                        <div className="d-flex ms-4">
                            {[5, 4, 3, 2, 1].map((value) => (
                                <button key={value} type="button" className='btn ms-2' style={{ background: '#142239', color: 'white' }}
                                    onClick={() => handleClick(value)}>
                                    {value} ★
                                </button>
                            ))}
                        </div>

                        {(filteredData || dataReview)
                            .sort((a, b) => new Date(b.datedAt).getTime() - new Date(a.datedAt).getTime())
                            .slice(0, visibleCount)
                            .map((review) => (
                                <Row className="mt-4 ms-5" key={review.fieldReviewId}>
                                    <Col>
                                        <Image
                                            src={`${review.user.avatar ? review.user.avatar : "/img/avatar.jpg"}`}
                                            alt="Hình ảnh thu nhỏ"
                                            width={35}
                                            height={35}
                                            className="rounded-circle"
                                        />
                                        <span className='me-4'>{review.user.fullname}</span>
                                        <i className="bi bi-calendar me-2"></i>
                                        <span>{new Date(review.datedAt).toLocaleDateString('vi-VN')}</span>

                                        <div>
                                            <span className="text-warning ms-5 fs-3">
                                                {'★'.repeat(review.rating)}
                                            </span>
                                            <br />
                                            <span className='ms-5'>{review.comment}</span>
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        {visibleCount < dataReview.length ? (
                            // Hiển thị nút "Tải thêm bình luận" nếu còn bình luận để tải thêm
                            <div className="mt-3 text-center">
                                <Button variant="danger" onClick={loadMoreReviews}>Tải thêm bình luận</Button>
                            </div>
                        ) : (
                            // Hiển thị nút "Ẩn bớt bình luận" chỉ khi visibleCount > 5
                            visibleCount > 5 && (
                                <div className="mt-3 text-center">
                                    <Button variant="danger" onClick={hideReviews}>Ẩn bớt bình luận</Button>
                                </div>
                            )
                        )}

                    </Col>
                    <Col>
                        <div className="map-container">
                            <div className="note-map">Nhấn vào bản đồ để xem đường đi đến sân</div>
                            {coordinates && <MapComponent coordinates={coordinates} />}
                        </div>
                    </Col>
                </Row>
                <CheckoutModal showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal}
                    sportDetail={sportDetail} startTime={startTime} dayStartBooking={dayStartBooking}
                    sport={sportField} owner={sportField?.owner}
                    checkDataStatus={checkDataStatus} setCheckDataStatus={setCheckDataStatus}
                    startTimeKey={startTimeKey}
                />
                <ModalReviewSportField showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} fieldId={params.id} dataReview={reviewData} />
                <SearchSportField showSearchBookingModal={showSearchBookingModal} setSearchShowBookingModal={setSearchShowBookingModal}
                    dataTimeSport={dataTimeSport.filter(time => time !== "undefinedh00" && time !== null)} sportField={sportField} />
            </Container>
        </HomeLayout>
    );
};

export default SportDetail;
