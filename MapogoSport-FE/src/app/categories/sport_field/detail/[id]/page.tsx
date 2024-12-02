"use client";
import { Container, Row, Col, Form, FloatingLabel, Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { decodeString, formatDateVN } from '@/components/Utils/Format';
import CheckoutModal from '@/components/Booking/booking.Checkout';
import ModalReviewSportField from '@/components/Review/review.sportField';
import '../[id]/BookingDetail.scss';
import MapComponent from "../../../../utils/MapComponent";
import { fetchCoordinates } from "../../../../utils/geocode";
import SearchSportField from '@/components/Booking/booking.Search';
import { useSearchParams } from 'next/navigation';
import { createTimeStringH, isDateInRange } from '@/components/Utils/booking-time';
import Image from 'next/image';
import Loading from '@/components/loading';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

type BookingsTypeOnWeek = {
    [time: string]: {
        [sport: string]: string[];
    };
};

const SportDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [selectedSize, setSelectedSize] = useState<string>('');
    const [priceBySizeSp, setPriceBySizeSp] = useState<{ price: number, peakHourPrices: number }>({ price: 0, peakHourPrices: 0 });
    const [sportFieldDetailId, setSportFieldDetailId] = useState<number>(0);
    const [bookingsOnWeek, setBookingsOnWeek] = useState<BookingsTypeOnWeek>({})
    const [dataTimeSport, setDataTimeSport] = useState<string[]>([]);
    const [checkDataBooking, setCheckDataBooking] = useState<boolean>(false);
    const [checkDataBooking1, setCheckDataBooking1] = useState<boolean>(false);
    const [days, setDays] = useState<string[]>();
    const [dayYears, setDayYears] = useState<string[]>();
    const [sportField, setSportField] = useState<SportField>();
    const [checkDataStatus, setCheckDataStatus] = useState<boolean>(true);
    const [selectedFrame, setSelectedFrame] = useState<'morning' | 'evening'>('morning');
    const [sportDetail, setSportDetail] = useState<SportFieldDetail>();
    const [startTime, setStartTime] = useState("");
    const [dayStartBooking, setDayStartBooking] = useState("");
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [startTimeKey, setStartTimeKey] = useState<boolean>(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showSearchBookingModal, setSearchShowBookingModal] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const statusParam = searchParams.get('status');
            if (statusParam === 'success') {
                toast.success("Đặt sân thành công!");
            } else if (statusParam === 'fail') {
                toast.warn("Đã xảy ra lỗi trong quá trình đặt sân, vui lòng thử lại sau!");
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws'); // Địa chỉ endpoint WebSocket
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/bookingDetail/user/reload', (message) => {
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    toast.success("Đặt sân thành công!");
                    setCheckDataStatus(prev => !prev);
                }
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    const { data: dataReview } = useSWR<FieldReview[]>(`${BASE_URL}rest/fieldReview/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const { data: gallery } = useSWR<GalleryField[]>(`${BASE_URL}rest/sportfield/gallery/${params.id}`, fetcher, {
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

    useEffect(() => {
        const getSport = async () => {
            const responseSport = await fetch(`${BASE_URL}rest/sport_field/${params.id}`);
            if (!responseSport.ok) {
                throw new Error("Error fetching data");
            }
            const dataSport = (await responseSport.json()) as SportField;
            setSportField(dataSport);
        };
        getSport()
    }, [params])

    const handleChatMess = () => {
        if (sportField && sportField.owner.user.username) {
            const ownerUsername = sportField.owner.user.username;
            if (ownerUsername === decodeString(String(localStorage.getItem('username')))) {
                toast.info('Bạn không thể nhắn với chính mình ');
                return;
            } else {
                const encodedUsername = btoa(ownerUsername);
                window.history.pushState({}, "", `?status=${encodedUsername}`);
            }
        }
    }

    useEffect(() => {
        if (sportField) {
            if (sportField.address) {
                fetchCoordinates(sportField.address).then((coords) => {
                    if (coords) setCoordinates(coords);
                });
            }
            if (sportField.sportFielDetails?.length > 0) {
                const firstDetail = sportField.sportFielDetails[0];
                setSportFieldDetailId(firstDetail.sportFielDetailId);
                setSelectedSize(firstDetail.size);
                setPriceBySizeSp({ price: firstDetail.price, peakHourPrices: firstDetail.peakHourPrices });
            }

            let operatingTime: number = 0;

            const open = sportField.opening;
            const close = sportField.closing;

            const numberOpen = open.match(/\d+/);
            const numberClose = close.match(/\d+/);
            if (numberOpen && numberClose) {
                operatingTime = (Number(numberClose[0]) - Number(numberOpen[0]));
            }

            const newData: string[] = [];
            for (let index = 0; index < (operatingTime * 2) + 1; index++) {
                if (newData.length === 0) {
                    newData.push(String(numberOpen + "h00"));
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

            const index = newData.indexOf(sportField.opening);
            if (index !== -1) {
                newData.splice(0, index);
            }

            setDataTimeSport(newData);

            if (newData.length > 0 && sportField.sportFielDetails) {
                const newBookingsOnWeek = { ...bookingsOnWeek };
                const validTimes = newData.filter(time => time !== "undefinedh00" && time !== null);
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
                setCheckDataBooking1(prev => !prev);
            }
        }
    }, [sportField]);

    const [startWeek, setStartWeek] = useState<string>(() => {
        const today = new Date();
        return new Intl.DateTimeFormat('en-CA').format(today);
    });

    const initialEndWeek = new Date();
    initialEndWeek.setDate(initialEndWeek.getDate() + 7);
    const [endWeek, setEndWeek] = useState<string>(initialEndWeek.toISOString().split('T')[0]);
    const [checkLoadingData, setCheckLoadingData] = useState<boolean>(false);

    useEffect(() => {
        setCheckLoadingData(true);

        setCheckLoadingData(true);
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
    }, [startWeek, endWeek, checkDataBooking]);

    useEffect(() => {
        if (checkDataBooking1) {
            setCheckDataBooking(prev => !prev)
        };
    }, [checkDataBooking1]);

    useEffect(() => {
        if (dayYears && dayYears.length > 0 && sportFieldDetailId) {
            const setStatusOnWeek = async () => {
                setCheckLoadingData(true)
                const updatedBookingsOnWeek = { ...bookingsOnWeek };
                const currentDateTime = new Date();

                const sportFieldDetail = sportField?.sportFielDetails.find(item => item.sportFielDetailId === sportFieldDetailId);

                if (dayYears && sportFieldDetail) {
                    try {
                        const response = await fetch(`${BASE_URL}rest/user/booking/detail/getnextweek/${sportFieldDetailId}/${dayYears[0]}/${dayYears[dayYears.length - 1]}`);
                        if (!response.ok) {
                            throw new Error('Error fetching data');
                        }

                        const dataBooking = await response.json() as BookingDetail[];

                        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                            const dayYear = dayYears[dayIndex];
                            let hasBookingForDay = false;
                            const bookingsForDay = dataBooking.filter(item => item.date === dayYear);

                            Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                                Object.entries(sportData).forEach(([sport]) => {
                                    if (!sportData[sport][dayIndex] && dayYear) {
                                        const [hour, minute] = time.split('h').map(Number);
                                        const timeDate1 = new Date(dayYear);
                                        timeDate1.setHours(hour, minute);
                                        sportData[sport][dayIndex] = (timeDate1 < currentDateTime) ? "Quá hạn" : "Còn trống";
                                    }
                                });
                            });

                            for (const i of sportFieldDetail.statusSportFieldDetails) {
                                if (isDateInRange(dayYear, i.startDate, i.endDate)) {
                                    if (
                                        i &&
                                        new Date(i.startDate).toISOString().split("T")[0] ===
                                        new Date(i.endDate).toISOString().split("T")[0]
                                    ) {
                                        let hourStart;
                                        let minuteStart;
                                        let hourEnd;
                                        let minuteEnd;

                                        if (new Date(i.startDate).getMinutes() > 30) {
                                            hourStart = new Date(i.startDate).getHours() + 1;
                                            minuteStart = '00';
                                        } else {
                                            hourStart = new Date(i.startDate).getHours();
                                            minuteStart = '30';
                                        }

                                        if (new Date(i.endDate).getMinutes() > 30) {
                                            hourEnd = new Date(i.endDate).getHours() + 1;
                                            minuteEnd = '00';
                                        } else {
                                            hourEnd = new Date(i.endDate).getHours();
                                            minuteEnd = '30';
                                        }

                                        const timeStringH: string[] = createTimeStringH(
                                            `${hourStart}h${minuteStart}`,
                                            `${hourEnd}h${minuteEnd}`
                                        );

                                        Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                                            Object.entries(sportData).forEach(([sport,]) => {
                                                if (sport === sportFieldDetail.name && timeStringH.includes(time)) {
                                                    sportData[sport][dayIndex] = i.statusName === "Hoạt động" ? "Còn trống" : i.statusName;
                                                }
                                            });
                                        });
                                    } else if (i && sportField) {
                                        Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                                            Object.entries(sportData).forEach(([sport,]) => {
                                                if (new Date(i.startDate).toISOString().split("T")[0] === dayYear) {
                                                    let hourStart;
                                                    let minuteStart;

                                                    if (new Date(i.startDate).getMinutes() < 30) {
                                                        hourStart = new Date(i.startDate).getHours();
                                                        minuteStart = '00';
                                                    } else {
                                                        hourStart = new Date(i.startDate).getHours();
                                                        minuteStart = '30';
                                                    }

                                                    const timeStringH: string[] = createTimeStringH(
                                                        `${hourStart}h${minuteStart}`,
                                                        sportField.closing
                                                    );

                                                    if (sport === sportFieldDetail.name && timeStringH.includes(time)) {
                                                        sportData[sport][dayIndex] = i.statusName === "Hoạt động" ? "Còn trống" : i.statusName;
                                                    }

                                                } else if (new Date(i.endDate).toISOString().split("T")[0] === dayYear) {
                                                    let hourEnd;
                                                    let minuteEnd;

                                                    if (new Date(i.endDate).getMinutes() < 30) {
                                                        hourEnd = new Date(i.endDate).getHours();
                                                        minuteEnd = '00';
                                                    } else {
                                                        hourEnd = new Date(i.endDate).getHours();
                                                        minuteEnd = '30';
                                                    }

                                                    const timeStringH: string[] = createTimeStringH(
                                                        sportField.opening,
                                                        `${hourEnd}h${minuteEnd}`
                                                    );

                                                    if (sport === sportFieldDetail.name && timeStringH.includes(time)) {
                                                        sportData[sport][dayIndex] = i.statusName === "Hoạt động" ? "Còn trống" : i.statusName;
                                                    }
                                                } else {
                                                    if (sport === sportFieldDetail.name) {
                                                        sportData[sport][dayIndex] = i.statusName === "Hoạt động" ? "Còn trống" : i.statusName;
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }
                            }

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
                                        Object.entries(sportData).forEach(([sport]) => {
                                            if (sport === item.sportFieldDetail.name) {
                                                const [hour, minute] = time.split('h').map(Number);
                                                const timeDate = new Date(dayYear);
                                                timeDate.setHours(hour, minute);
                                                const timeIndex = newData.indexOf(time);
                                                if (timeIndex >= 0) {
                                                    sportData[sport][dayIndex] = "Đã đặt";
                                                } else if (sportData[sport][dayIndex] === "Còn trống") {
                                                    sportData[sport][dayIndex] = (timeDate < currentDateTime) ? "Quá hạn" : "Còn trống";
                                                }
                                            }
                                        });
                                        updatedBookingsOnWeek[time] = sportData;
                                    });
                                });
                            }

                            if (!hasBookingForDay) {
                                Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                                    Object.entries(sportData).forEach(([sport,]) => {
                                        if (sportFieldDetail && sport === sportFieldDetail.name) {
                                            if (sportData[sport][dayIndex] === "Còn trống" && dayYear) {
                                                const [hour, minute] = time.split('h').map(Number);
                                                const timeDate1 = new Date(dayYear);
                                                timeDate1.setHours(hour, minute);

                                                sportData[sport][dayIndex] = (timeDate1 < currentDateTime) ? "Quá hạn" : "Còn trống";
                                            }
                                        }
                                    });
                                    updatedBookingsOnWeek[time] = sportData;
                                });
                            }
                        }

                        setBookingsOnWeek(updatedBookingsOnWeek);
                    } catch (error) {
                        console.error(error);
                    }
                }
                setCheckLoadingData(false);
            };

            setStatusOnWeek();
        }
    }, [dayYears, sportFieldDetailId, checkDataStatus]);



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
            case "Sửa chữa": return "frame-info-danger";
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
        const timeData = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = event.currentTarget.getAttribute("day-data");
        const selectedSportDetail = sportField?.sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));
        if (sportDetail && timeData && dayStartBooking) {
            setSportDetail(selectedSportDetail);
            setStartTime(timeData);
            setDayStartBooking(dayStartBooking);
            setShowBookingModal(true);
            setStartTimeKey(!startTimeKey);
        }
    }


    const [filteredData, setFilteredData] = useState<FieldReview[] | null>(null);
    const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
    const handleClick = (value: number) => {

        if (dataReview && selectedRatingFilter === value) {
            setSelectedRatingFilter(null);
            setFilteredData(dataReview);
            return;
        }
        setSelectedRatingFilter(value);
        const fetchData = async () => {
            const response = await fetch(`${BASE_URL}rest/find-fielreview-by-rating/${params.id}/${value}`);
            const data = await response.json();
            setFilteredData(data);
        };

        fetchData();
    };

    if (!sportField && !dataReview) return <HomeLayout><div className='d-flex justify-content-center align-items-center' style={{ height: '90vh' }}><Loading></Loading></div></HomeLayout>;

    // trung binh rating
    const reviewCount = dataReview!.length || 0; // Total number of reviews
    const averageRating = reviewCount > 0
        ? (dataReview!.reduce((total: number, review: FieldReview) => total + review.rating, 0) / reviewCount).toFixed(1)
        : "0.0"; // Calculate average rating to one decimal place or set to "0.0" if no reviews
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
                                    Đánh giá: {averageRating} <i className="bi bi-star-fill"></i> ({reviewCount} Đánh giá)
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
                                <div
                                    id="carouselExampleControls"
                                    className="carousel slide"
                                    data-bs-ride="carousel"
                                    data-bs-interval="3000"
                                >
                                    <div className="carousel-inner">
                                        {sportField && (
                                            <div className="carousel-item active">
                                                <Image
                                                    width={856}
                                                    height={450}
                                                    src={sportField.image}
                                                    alt="Sport Field Image"
                                                    style={{
                                                        width: '100%',
                                                        maxHeight: '450px',
                                                        objectFit: 'cover',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {gallery &&
                                            gallery.length > 0 &&
                                            gallery.map((galleryItem, index) => (
                                                <div key={index} className="carousel-item">
                                                    <Image
                                                        width={856}
                                                        height={450}
                                                        src={galleryItem.image}
                                                        alt={`Gallery image ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            maxHeight: '450px',
                                                            objectFit: 'cover',
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                    </div>

                                    <button
                                        className="carousel-control-prev"
                                        type="button"
                                        data-bs-target="#carouselExampleControls"
                                        data-bs-slide="prev"
                                    >
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button
                                        className="carousel-control-next"
                                        type="button"
                                        data-bs-target="#carouselExampleControls"
                                        data-bs-slide="next"
                                    >
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
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
                                    <span>Dịch vụ tiện ích: </span>
                                    <div className="extends ">
                                        <div className='py-4description'>{sportField?.decription}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                {sportField && days && dayYears &&
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
                            {checkLoadingData ?
                                <div className='d-flex justify-content-center align-items-center' style={{ height: '500px' }}><Loading></Loading></div>
                                :
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
                                                                return sportFielDetails?.map((item) => (
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
                            }
                        </div>
                    </div>
                }
                <Row className='mt-3'>
                    <Col>
                        <div className="mb-2 text-center">
                            <p>Bạn đánh giá sao về sân thể thao này?</p>
                            <Button variant="danger" onClick={() => setShowReviewModal(true)}>Đánh giá ngay</Button>
                        </div>
                        <h5 className='ms-3'>Bình luận</h5>
                        <div className="d-flex ms-4">
                            {[5, 4, 3, 2, 1].map((value) => (
                                <button key={value} type="button"
                                    className='btn ms-2'
                                    style={selectedRatingFilter === value ? { background: '#142239', color: 'red' } : { background: '#142239', color: 'white' }}
                                    onClick={() => handleClick(value)}>

                                    {value} ★
                                </button>
                            ))}
                        </div>

                        {(filteredData! || dataReview)
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
                        {visibleCount < dataReview!.length ? (
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
                    startTimeKey={startTimeKey}
                />
                <ModalReviewSportField showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} fieldId={params.id} dataReview={dataReview!} />
                <SearchSportField showSearchBookingModal={showSearchBookingModal} setSearchShowBookingModal={setSearchShowBookingModal}
                    dataTimeSport={dataTimeSport.filter(time => time !== "undefinedh00" && time !== null)} sportField={sportField} />
            </Container>
        </HomeLayout>
    );
};

export default SportDetail;
