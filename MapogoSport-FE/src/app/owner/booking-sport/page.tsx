'use client';

import { useData } from "@/app/context/UserContext";
import BookingModal from "@/components/Owner/modal/booking.modal";
import NotificationModal from "@/components/Owner/modal/notification.modal";
import SearchBookingModal from "@/components/Owner/modal/search-booking.modal";
import ViewEditBookingModal from "@/components/Owner/modal/view-edit-booking.modal";
import { calculateTimeDifference, createTimeStringH, isDateInRange } from "@/components/Utils/booking-time";
import { formatDateVN } from "@/components/Utils/Format";
import { Stomp } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";

type BookingsTypeOnDay = {
    [time: string]: BookingDetails[];
};

type BookingDetails = {
    status: string;
    bookingId: number;
    fullName: string;
    statusDtb: string;
    subscriptionKey: string;
}

type BookingsTypeOnWeek = {
    [time: string]: {
        [sport: string]: BookingDetails[];
    };
};
export default function BookingSport() {

    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [showSearchBookingModal, setSearchShowBookingModal] = useState<boolean>(false);
    const [showViewOrEditBookingModal, setShowViewOrEditBookingModal] = useState<boolean>(false);
    const [showNotificationModal, setNotificationModal] = useState<boolean>(false);
    const [checkDataStatus, setCheckDataStatus] = useState<boolean>(true);
    const [checkLoadingData, setCheckLoadingData] = useState<boolean>(false);
    const [bookingsOnDay, setBookingsOnDay] = useState<BookingsTypeOnDay>({});
    const [bookingsOnWeek, setBookingsOnWeek] = useState<BookingsTypeOnWeek>({})
    const user = useData();
    const [owner, setOwner] = useState<Owner>();
    const [selectSport, setSelectSport] = useState<number>(0);
    const [checkNotification, setCheckNotification] = useState<number>(1);
    const [checkUsername, setCheckUsername] = useState<string>();
    const [selectDate, setSelectDate] = useState<number>(0);
    const [dataSport, setDataSport] = useState<SportField[]>([])
    const [days, setDays] = useState<string[]>();
    const [dayYears, setDayYears] = useState<string[]>();
    const [opening, setOpening] = useState<number>();
    const [operatingTime, setOperatingTime] = useState<number>(0);
    const [dataTimeSport, setDataTimeSport] = useState<string[]>([]);
    const [onDay, setOnDay] = useState<string>(() => {
        const today = new Date();
        return new Intl.DateTimeFormat('en-CA').format(today);
    });
    const [startWeek, setStartWeek] = useState<string>(() => {
        const today = new Date();
        return new Intl.DateTimeFormat('en-CA').format(today);
    });
    const initialEndWeek = new Date();
    initialEndWeek.setDate(initialEndWeek.getDate() + 6);
    const [endWeek, setEndWeek] = useState<string>(initialEndWeek.toISOString().split('T')[0]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws'); // Địa chỉ endpoint WebSocket
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/bookingDetail/reload', (message) => {
                if (message.body === localStorage.getItem('username')) {
                    setCheckNotification(prev => prev + 1);
                    setCheckUsername(message.body);
                }
            });

            stompClient.subscribe('/topic/bookingDetail/notification/reload', (message) => {
                if (message.body === localStorage.getItem('username')) {
                    setCheckNotification(prev => prev + 1);
                    setCheckUsername(message.body);
                    // refreshStatusBooking();
                }
            });
        });

        // Cleanup khi component unmount
        return () => {
            stompClient.disconnect();
        };
    }, []);

    // useEffect(() => {
    //     setDayOnWeek();
    // }, [])

    useEffect(() => {
        getOwnerAndSport();
    }, [user])

    const getOwnerAndSport = async () => {
        if (user) {
            const responseOwner = await fetch(`http://localhost:8080/rest/owner/${user.username}`);
            if (!responseOwner.ok) {
                throw new Error('Error fetching data');
            }
            const dataOwner = await responseOwner.json() as Owner;
            setOwner(dataOwner);
            const responseSport = await fetch(`http://localhost:8080/rest/sport_field_by_owner/${dataOwner.ownerId}`);
            if (!responseSport.ok) {
                throw new Error('Error fetching data');
            }
            const dataSport = await responseSport.json() as SportField[];
            setDataSport(dataSport);
        }
    }

    useEffect(() => {
        if (dataSport && dataSport.length > selectSport) {
            const open = dataSport[selectSport].opening;
            const close = dataSport[selectSport].closing;

            const numberOpen = open.match(/\d+/);
            const numberClose = close.match(/\d+/);
            if (numberOpen && numberClose) {
                setOpening(Number(numberOpen[0]));
                setOperatingTime(Number(numberClose[0]) - Number(numberOpen[0]));
            }
        }
    }, [dataSport, selectSport])

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

        const index = newData.indexOf(dataSport[selectSport]?.opening);
        if (index !== -1) {
            newData.splice(0, index);  // Xóa từ vị trí 0 đến index-1
        }

        if (newData.length > 0) {
            const newBookingsOnDay = { ...bookingsOnDay };
            const newBookingsOnWeek = { ...bookingsOnWeek };

            const validTimes = newData
                .filter(time => time !== "undefinedh00" && time !== null)
                .slice(0, -1);

            validTimes.forEach((time) => {
                if (!newBookingsOnDay[time]) {
                    newBookingsOnDay[time] = [];
                }
            });

            setBookingsOnDay(newBookingsOnDay);
            const sportDetails = dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails;
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
            setCheckDataBookingConfirm(prev => !prev)
        }
        setDataTimeSport((prevData) => [...prevData, ...newData]);

    }, [operatingTime])

    // SET STATUS
    const [checkDataBooking, setCheckDataBooking] = useState<boolean>(false);
    const [checkDataBookingConfirm, setCheckDataBookingConfirm] = useState<boolean>(false);

    useEffect(() => {
        setCheckDataBooking(prev => !prev);
    }, [checkDataBookingConfirm]);

    useEffect(() => {
        setCheckLoadingData(true)
        refreshStatusBooking();
    }, [onDay, startWeek, endWeek, selectDate, checkDataBooking, selectSport]);

    const setDayOnWeek = () => {
        const today = new Date(startWeek);
        const days = [];
        const dayYears = [];
        const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

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

    const setOnDayAndOnWeek = (direction: 'forward' | 'backward') => {
        const currentDate = new Date(onDay);
        if (selectDate === 0) { // Một ngày
            currentDate.setDate(currentDate.getDate() + (direction === 'forward' ? 1 : -1));
            setOnDay(currentDate.toISOString().split('T')[0]);
        } else {
            const currentStart = new Date(startWeek);
            const daysToAdd = direction === 'forward' ? 7 : -7;

            currentStart.setDate(currentStart.getDate() + daysToAdd);
            const newStartWeek = currentStart.toISOString().split('T')[0];
            setStartWeek(newStartWeek);

            const end = new Date(currentStart);
            end.setDate(end.getDate() + 6);
            const newEndWeek = end.toISOString().split('T')[0];
            setEndWeek(newEndWeek);
        }
    };

    useEffect(() => {
        if (selectDate === 1) {
            setStatusOnWeek();
        } else if (selectDate === 0) {
            setStatusOnDay();
        }
    }, [dayYears, days]);

    const [isFirstRender, setIsFirstRender] = useState(true);

    const refreshStatusBooking = () => {
        setCheckLoadingData(true)

        if (selectDate === 0) {
            const updatedBookingsOnDay = { ...bookingsOnDay };
            Object.entries(updatedBookingsOnDay).forEach(([time, _statuses]) => {
                updatedBookingsOnDay[time] = [];
            });
            setBookingsOnDay(updatedBookingsOnDay);
            setDayOnWeek();
        } else {
            const updatedBookingsOnWeek = { ...bookingsOnWeek };
            Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                const sportDataTemporary = { ...sportData };
                Object.entries(sportDataTemporary).forEach(([sport,]) => {
                    sportDataTemporary[sport] = [];
                });
                updatedBookingsOnWeek[time] = sportDataTemporary;
            });
            setBookingsOnWeek(updatedBookingsOnWeek);
            setDayOnWeek();
        }
    }

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        const timeoutId = setTimeout(() => {
            refreshStatusBooking();
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [checkDataStatus]);

    const setStatusOnDay = async () => {

        const currentDateTime = new Date();
        const sportDetails = dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails;
        const numFields = sportDetails ? sportDetails.length : 0;

        for (let index = 0; index < numFields; index++) {

            const response = await
                fetch(`http://localhost:8080/rest/user/booking/detail/getbyday/${sportDetails && sportDetails[index].sportFielDetailId}/${onDay}`);

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const dataBooking = await response.json() as BookingDetailFullName[];
            if (sportDetails && dataBooking.length === 0) {
                Object.entries(bookingsOnDay).forEach(([time, statuses]) => {
                    const [hour, minute] = time.split('h').map(Number);
                    const timeDate = new Date(onDay);
                    timeDate.setHours(hour, minute);
                    if (sportDetails && sportDetails[index].status == "Hoạt động") {
                        if (timeDate < currentDateTime) {
                            statuses[index] = {
                                status: "Quá hạn",
                                bookingId: 0,
                                fullName: "",
                                statusDtb: "",
                                subscriptionKey: ""
                            };
                        } else {
                            statuses[index] = {
                                status: "Còn trống",
                                bookingId: 0,
                                fullName: "",
                                statusDtb: "",
                                subscriptionKey: "",
                            };
                        }
                    } else {
                        statuses[index] = {
                            status: sportDetails[index].status == "Tạm đóng" ? "Tạm đóng" : sportDetails[index].status,
                            bookingId: 0,
                            fullName: "",
                            statusDtb: "",
                            subscriptionKey: ""
                        };
                    }
                    setBookingsOnDay(prevBookingsOnDay => ({
                        ...prevBookingsOnDay,
                        [time]: statuses
                    }));
                });
                continue;
            }

            if (sportDetails) {
                for (const i of sportDetails[index].statusSportFieldDetails) {
                    if (isDateInRange(onDay, i.startDate, i.endDate)) {
                        if (
                            sportDetails &&
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

                            Object.entries(bookingsOnDay).forEach(([time, statuses]) => {
                                if (timeStringH.includes(time)) {
                                    statuses[index] = {
                                        status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                        bookingId: 0,
                                        fullName: "",
                                        statusDtb: "",
                                        subscriptionKey: "",
                                    };
                                }
                                setBookingsOnDay(prevBookingsOnDay => ({
                                    ...prevBookingsOnDay,
                                    [time]: statuses
                                }));
                            });
                        } else if (i && sportDetails) {
                            Object.entries(bookingsOnDay).forEach(([time, statuses]) => {
                                if (new Date(i.startDate).toISOString().split("T")[0] === onDay) {
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
                                        dataSport[selectSport].closing
                                    );

                                    if (timeStringH.includes(time)) {
                                        statuses[index] = {
                                            status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                            bookingId: 0,
                                            fullName: "",
                                            statusDtb: "",
                                            subscriptionKey: "",
                                        };
                                    }
                                } else if (new Date(i.endDate).toISOString().split("T")[0] === onDay) {
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
                                        dataSport[selectSport].opening,
                                        `${hourEnd}h${minuteEnd}`
                                    );

                                    if (timeStringH.includes(time)) {
                                        statuses[index] = {
                                            status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                            bookingId: 0,
                                            fullName: "",
                                            statusDtb: "",
                                            subscriptionKey: "",
                                        };
                                    }
                                } else {
                                    statuses[index] = {
                                        status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                        bookingId: 0,
                                        fullName: "",
                                        statusDtb: "",
                                        subscriptionKey: "",
                                    };
                                }
                            });
                        }
                    }
                }
            }

            dataBooking.forEach(item => {
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
                            const createOpening = String(getTime[0]) + "h30";
                            newData.push(createOpening);
                        }
                    }
                }

                if (newData[newData.length - 1] === item.endTime) {
                    newData.pop(); // Loại bỏ phần tử cuối cùng
                }

                Object.entries(bookingsOnDay).forEach(([time, statuses]) => {
                    if (sportDetails && sportDetails[index].sportFielDetailId == item.sportFieldDetail.sportFielDetailId) {
                        const timeIndex = newData.indexOf(time)
                        const [hour, minute] = time.split('h').map(Number);
                        const timeDate = new Date(onDay);
                        timeDate.setHours(hour, minute);

                        let check = true;

                        if (timeIndex >= 0 && item.status == "Chưa bắt đầu" && timeDate < currentDateTime) {
                            fetch(`http://localhost:8080/rest/booking/detail/change/status/${item.bookingDetailId}`, {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Content-Type': 'application/json',
                                },
                            })
                            check = false;
                        }

                        if (timeIndex >= 0) {
                            statuses[index] = {
                                status: "Đã đặt",
                                bookingId: item.bookingDetailId,
                                fullName: item.fullName,
                                statusDtb: check ? item.status : "Đã hoàn thành",
                                subscriptionKey: item.subscriptionKey
                            };
                        } else if (statuses[index] && statuses[index].status === "Còn trống") {
                            statuses[index] = {
                                status: (timeDate < currentDateTime) ? "Chưa đặt" : "Còn trống",
                                bookingId: 0,
                                fullName: "",
                                statusDtb: "",
                                subscriptionKey: ""
                            };
                        }
                    }

                    setBookingsOnDay(prevBookingsOnDay => ({
                        ...prevBookingsOnDay,
                        [time]: statuses
                    }));
                })
            })
        }
        setCheckLoadingData(false)
    }

    const setStatusOnWeek = async () => {
        const currentDateTime = new Date();
        const sportDetails = dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails;
        const numFields = sportDetails ? sportDetails.length : 0;
        const updatedBookingsOnWeek: BookingsTypeOnWeek = { ...bookingsOnWeek };
        for (let index = 0; index < numFields; index++) {
            const sportFieldId = sportDetails && sportDetails[index].sportFielDetailId;

            // Gọi API để lấy danh sách booking
            const response = await fetch(`http://localhost:8080/rest/user/booking/detail/getnextweek/${sportFieldId}/${dayYears && dayYears[0]}/${dayYears && dayYears[dayYears.length - 1]}`);

            if (!response.ok) {
                throw new Error('Lỗi khi lấy dữ liệu');
            }

            const dataBooking = await response.json() as BookingDetailFullName[];

            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const dayYear = dayYears && dayYears[dayIndex];

                const bookingsForDay = dataBooking.filter(item => item.date === dayYear);

                // START SET STATUS ON TIME

                Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                    Object.entries(sportData).forEach(([sport, _statuses]) => {
                        if (!sportData[sport][dayIndex] && dayYear) {
                            const [hour, minute] = time.split('h').map(Number);
                            const timeDate1 = new Date(dayYear);
                            timeDate1.setHours(hour, minute);

                            sportData[sport][dayIndex] = {
                                status: (timeDate1 < currentDateTime) ? "Chưa đặt" : "Còn trống",
                                bookingId: 0,
                                fullName: "",
                                statusDtb: "",
                                subscriptionKey: "",
                            };
                        }
                    });
                });

                if (sportDetails && dayYear) {
                    for (const i of sportDetails[index].statusSportFieldDetails) {
                        if (isDateInRange(dayYear, i.startDate, i.endDate)) {
                            if (
                                sportDetails &&
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
                                    Object.entries(sportData).forEach(([sport, _statuses]) => {
                                        if (sport === sportDetails[index].name && timeStringH.includes(time)) {
                                            sportData[sport][dayIndex] = {
                                                status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                                bookingId: 0,
                                                fullName: "",
                                                statusDtb: "",
                                                subscriptionKey: "",
                                            };
                                        }
                                    });
                                });
                            } else if (i && sportDetails) {
                                Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                                    Object.entries(sportData).forEach(([sport, _statuses]) => {
                                        if (new Date(i.startDate).toISOString().split("T")[0] === dayYear) {
                                            let hourStart;
                                            let minuteStart;

                                            // if (new Date(i.startDate).getMinutes() > 30) {
                                            //     hourStart = new Date(i.startDate).getHours() + 1;
                                            //     minuteStart = '00';
                                            // } else {
                                            //     hourStart = new Date(i.startDate).getHours();
                                            //     minuteStart = '30';
                                            // }

                                            if (new Date(i.startDate).getMinutes() < 30) {
                                                hourStart = new Date(i.startDate).getHours();
                                                minuteStart = '00';
                                            } else {
                                                hourStart = new Date(i.startDate).getHours();
                                                minuteStart = '30';
                                            }

                                            const timeStringH: string[] = createTimeStringH(
                                                `${hourStart}h${minuteStart}`,
                                                dataSport[selectSport].closing
                                            );

                                            if (sport === sportDetails[index].name && timeStringH.includes(time)) {
                                                sportData[sport][dayIndex] = {
                                                    status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                                    bookingId: 0,
                                                    fullName: "",
                                                    statusDtb: "",
                                                    subscriptionKey: "",
                                                };
                                            }

                                        } else if (new Date(i.endDate).toISOString().split("T")[0] === dayYear) {
                                            let hourEnd;
                                            let minuteEnd;

                                            // if (new Date(i.endDate).getMinutes() > 30) {
                                            //     hourEnd = new Date(i.endDate).getHours() + 1;
                                            //     minuteEnd = '00';
                                            // } else {
                                            //     hourEnd = new Date(i.endDate).getHours();
                                            //     minuteEnd = '30';
                                            // }

                                            if (new Date(i.endDate).getMinutes() < 30) {
                                                hourEnd = new Date(i.endDate).getHours();
                                                minuteEnd = '00';
                                            } else {
                                                hourEnd = new Date(i.endDate).getHours();
                                                minuteEnd = '30';
                                            }

                                            const timeStringH: string[] = createTimeStringH(
                                                dataSport[selectSport].opening,
                                                `${hourEnd}h${minuteEnd}`
                                            );

                                            if (sport === sportDetails[index].name && timeStringH.includes(time)) {
                                                sportData[sport][dayIndex] = {
                                                    status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                                    bookingId: 0,
                                                    fullName: "",
                                                    statusDtb: "",
                                                    subscriptionKey: "",
                                                };
                                            }
                                        } else {
                                            if (sport === sportDetails[index].name) {
                                                sportData[sport][dayIndex] = {
                                                    status: i.statusName === "Hoạt động" ? "Còn trống" : i.statusName,
                                                    bookingId: 0,
                                                    fullName: "",
                                                    statusDtb: "",
                                                    subscriptionKey: "",
                                                };
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    }
                }
                // END SET STATUS ON TIME

                if (bookingsForDay.length > 0) {
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
                            Object.entries(sportData).forEach(([sport,]) => {

                                if (dayYear && sport === item.sportFieldDetail.name) {

                                    const timeIndex = newData.indexOf(time);
                                    const [hour, minute] = time.split('h').map(Number);
                                    const timeDate = new Date(dayYear);
                                    timeDate.setHours(hour, minute);

                                    let check = true;

                                    if (timeIndex >= 0 && item.status == "Chưa bắt đầu" && timeDate < currentDateTime) {
                                        fetch(`http://localhost:8080/rest/booking/detail/change/status/${item.bookingDetailId}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                        check = false;
                                    }

                                    // if (item.sportFieldDetail.status === "Hoạt động") {
                                    if (timeIndex >= 0) {
                                        sportData[sport][dayIndex] = {
                                            status: "Đã đặt",
                                            bookingId: item.bookingDetailId,
                                            fullName: item.fullName,
                                            statusDtb: check ? item.status : "Đã hoàn thành",
                                            subscriptionKey: item.subscriptionKey
                                        };
                                    } else if (sportData[sport][dayIndex].status === "Còn trống") {
                                        sportData[sport][dayIndex] = {
                                            status: (timeDate < currentDateTime) ? "Chưa đặt" : "Còn trống",
                                            bookingId: 0,
                                            fullName: "",
                                            statusDtb: "",
                                            subscriptionKey: ""
                                        };
                                    }
                                    // } else {
                                    //     sportData[sport][dayIndex] = {
                                    //         status: item.sportFieldDetail.status == "Tạm đóng" ? "Tạm đóng" : item.sportFieldDetail.status,
                                    //         bookingId: 0,
                                    //         fullName: "",
                                    //         statusDtb: "",
                                    //         subscriptionKey: ""
                                    //     };
                                    // }
                                }
                            });
                            updatedBookingsOnWeek[time] = sportData;
                        });
                    });
                } else {
                    Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                        Object.entries(sportData).forEach(([sport]) => {
                            const [hour, minute] = time.split('h').map(Number);
                            const timeDate = dayYears && new Date(dayYears[dayIndex]) || new Date();
                            timeDate.setHours(hour, minute);
                            if (sportDetails && sport === sportDetails[index].name) {
                                if (sportData[sport][dayIndex].status === "Còn trống" && dayYear) {
                                    const [hour, minute] = time.split('h').map(Number);
                                    const timeDate1 = new Date(dayYear);
                                    timeDate1.setHours(hour, minute);

                                    sportData[sport][dayIndex] = {
                                        status: (timeDate1 < currentDateTime) ? "Chưa đặt" : "Còn trống",
                                        bookingId: 0,
                                        fullName: "",
                                        statusDtb: "",
                                        subscriptionKey: "",
                                    };
                                }
                                // if (sportDetails && timeDate < currentDateTime && sportDetails[index].status === "Hoạt động") {
                                //     sportData[sport][dayIndex] = {
                                //         status: "Chưa đặt",
                                //         bookingId: 0,
                                //         fullName: "",
                                //         statusDtb: "",
                                //         subscriptionKey: ""
                                //     };
                                // } else {
                                //     sportData[sport][dayIndex] = {
                                //         status: sportDetails[index].status === "Hoạt động" ? "Còn trống" :
                                //             sportDetails[index].status === "Tạm đóng" ? "Tạm đóng" : sportDetails[index].status,
                                //         bookingId: 0,
                                //         fullName: "",
                                //         statusDtb: "",
                                //         subscriptionKey: ""
                                //     };
                                // }
                            }
                        });
                        updatedBookingsOnWeek[time] = sportData;
                    });
                }
            }
        }
        setBookingsOnWeek(updatedBookingsOnWeek);
        setCheckLoadingData(false)
    };

    // LOAD TABLE
    const renderTableRows = () => {

        const bookingCounts: any = {};
        const displayedBookingIds = new Set();

        Object.entries(bookingsOnDay).map(([_time, statuses]) => (
            statuses.map((status) => {
                const bookingId = status.bookingId;
                if (bookingId && bookingId !== 0) {
                    bookingCounts[bookingId] = (bookingCounts[bookingId] || 0) + 1;
                }
            })
        ))

        return Object.entries(bookingsOnDay).map(([time, statuses]) => (
            <tr key={time}>
                <td className="title" style={{ textAlign: 'center' }}>{time}</td>
                {statuses.map((status, index) => {
                    const isAvailable =
                        new Date(onDay).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
                        && status.status === 'Còn trống';

                    if (status.status === "Đã đặt") {
                        if (displayedBookingIds.has(status.bookingId)) {
                            return null;
                        } else {
                            displayedBookingIds.add(status.bookingId);

                            return (
                                <td key={index}
                                    className={`${getBadgeClass(status.status)}`}
                                    rowSpan={bookingCounts[status.bookingId]}
                                    onClick={handleViewDataOnDay}
                                    time-data={time}
                                    style={{
                                        backgroundColor: status.subscriptionKey && status.subscriptionKey.includes("keybooking")
                                            ? '#e0ffd7'
                                            : status.subscriptionKey && status.subscriptionKey.includes("addNew")
                                                ? '#f5e2ff'
                                                : '#f3f3f3'
                                    }}
                                    sport-detail={
                                        dataSport &&
                                            dataSport[selectSport] &&
                                            dataSport[selectSport].sportFielDetails &&
                                            dataSport[selectSport].sportFielDetails[index] ?
                                            dataSport[selectSport].sportFielDetails[index].sportFielDetailId : 'N/A'
                                    }>
                                    <div className={`badge`}>
                                        <span className="status-label">{status.status}</span><br />
                                        <em className="text-danger">{status.statusDtb}</em><br />
                                        <b className="text-success">{status.bookingId == 0 ? "" : status.fullName}</b>
                                    </div>
                                </td>
                            );
                        }
                    } else {
                        return (
                            <td key={index}
                                className={`${getBadgeClass(status.status)}`}
                                onClick={isAvailable ? handleGetDataBookingOnDay : undefined}
                                time-data={time}
                                sport-detail={
                                    dataSport &&
                                        dataSport[selectSport] &&
                                        dataSport[selectSport].sportFielDetails &&
                                        dataSport[selectSport].sportFielDetails[index] ?
                                        dataSport[selectSport].sportFielDetails[index].sportFielDetailId : 'N/A'
                                }>
                                <div className={`badge`}>
                                    <span className="status-label" >
                                        {status.status}
                                        <b className="text-success">{status.bookingId == 0 ? "" : status.fullName}</b>
                                    </span>
                                </div>
                            </td>
                        );
                    }
                })}
            </tr>
        ));
    };

    const renderTableRowsByWeek = () => {
        const bookingCounts: any = {};
        const displayedBookingIds = new Set();

        Object.entries(bookingsOnWeek).forEach(([_time, sportData]) => {
            const sportFielDetails = dataSport[selectSport]?.sportFielDetails || [];
            sportFielDetails.forEach(item => {
                const bookingData = sportData[item.name] || [];
                bookingData.forEach(dayBookingData => {
                    const bookingId = dayBookingData?.bookingId;
                    if (bookingId && bookingId !== 0) {
                        bookingCounts[bookingId] = (bookingCounts[bookingId] || 0) + 1;
                    }
                });
            });
        });
        return (
            <Table>
                <thead className="tb-head">
                    <tr>
                        <th style={{ zIndex: '1002' }} rowSpan={2}>Giờ </th>
                        {days?.map((day, index) => (
                            <th colSpan={dataSport[selectSport]?.sportFielDetails?.length || 1} key={index}>{day}</th>
                        ))}
                    </tr>
                    <tr>
                        {days?.map(() => (
                            dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails &&
                            dataSport[selectSport].sportFielDetails.map(item => (
                                <th key={item.sportFielDetailId}>{item.name}</th>
                            ))
                        ))}
                    </tr>
                </thead>
                <tbody>

                    {Object.entries(bookingsOnWeek).map(([time, sportData]) => {
                        if (dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails) {
                            const sportFielDetails = dataSport[selectSport].sportFielDetails;
                            return (
                                <tr key={time}>
                                    <td className="title fw-bold" style={{ textAlign: 'center', position: 'sticky' }}>{time}</td>
                                    {days?.map((_, dayIndex) => (
                                        sportFielDetails.map((item, i) => {
                                            const bookingData = sportData[item.name] || [];
                                            const dayBookingData = bookingData[dayIndex];

                                            const bookingId = dayBookingData ? dayBookingData.bookingId : 0;
                                            const fullName = dayBookingData ? dayBookingData.fullName : "";
                                            const statusItem = dayBookingData ? dayBookingData.status : "Còn trống";
                                            const isAvailable =
                                                dayYears &&
                                                dayYears[dayIndex] &&
                                                new Date().setHours(0, 0, 0, 0) <= new Date(dayYears[dayIndex]).setHours(0, 0, 0, 0) &&
                                                statusItem === "Còn trống";
                                            const checkNoFunc = statusItem === 'Chưa đặt' ||
                                                statusItem === 'Tạm đóng' ||
                                                statusItem === "Sửa chữa";
                                            if (statusItem === "Đã đặt") {
                                                if (displayedBookingIds.has(bookingId)) {
                                                    return null;
                                                } else {
                                                    displayedBookingIds.add(bookingId);
                                                    return (
                                                        <td id={`${bookingId}`}
                                                            key={`${time}-${item.sportFielDetailId}-${dayIndex}`}
                                                            rowSpan={bookingCounts[bookingId]} // Gán rowSpan cho ô đầu tiên
                                                            sport-detail={dataSport &&
                                                                dataSport[selectSport] &&
                                                                dataSport[selectSport].sportFielDetails &&
                                                                dataSport[selectSport].sportFielDetails[i] ?
                                                                dataSport[selectSport].sportFielDetails[i].sportFielDetailId : 'N/A'}
                                                            time-data={time}
                                                            day-data={dayYears && dayYears[dayIndex]}
                                                            onClick={checkNoFunc ? undefined : isAvailable ?
                                                                handleGetDataBookingOnWeek :
                                                                handleViewDataOnWeek}
                                                            className={`w-10 ${getBadgeClass(statusItem)}`}
                                                            style={{
                                                                textAlign: 'center',
                                                                backgroundColor: dayBookingData.subscriptionKey && dayBookingData.subscriptionKey.includes("keybooking")
                                                                    ? '#e0ffd7'
                                                                    : dayBookingData.subscriptionKey && dayBookingData.subscriptionKey.includes("addNew")
                                                                        ? '#f5e2ff'
                                                                        : '#f3f3f3'
                                                            }}
                                                        >
                                                            <div className={`badge`}>
                                                                <span className="status-label">{statusItem}</span><br />
                                                                <em className="text-danger">{dayBookingData.statusDtb}</em><br />
                                                                <b className="text-success">{bookingId == 0 ? "" :
                                                                    fullName}</b>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                            } else {
                                                // Nếu trạng thái không phải "Đã đặt", hiển thị bình thường
                                                return (
                                                    <td
                                                        key={`${time}-${item.sportFielDetailId}-${dayIndex}`}
                                                        sport-detail={dataSport &&
                                                            dataSport[selectSport] &&
                                                            dataSport[selectSport].sportFielDetails &&
                                                            dataSport[selectSport].sportFielDetails[i] ?
                                                            dataSport[selectSport].sportFielDetails[i].sportFielDetailId : 'N/A'}
                                                        time-data={time}
                                                        day-data={dayYears && dayYears[dayIndex]}
                                                        onClick={checkNoFunc ? undefined : isAvailable ? handleGetDataBookingOnWeek : handleViewDataOnWeek}
                                                        className={`w-10 hv-tb ${getBadgeClass(statusItem)}`}
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        <div className={`badge`} style={{ position: 'relative' }}>
                                                            <span className="status-label">
                                                                {/* {statusItem === "Còn trống" ? '' : statusItem} */}
                                                                {statusItem}
                                                            </span><br />
                                                            <b className="text-success">{bookingId == 0 ? "" : fullName}</b>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                        })
                                    ))}
                                </tr>
                            );
                        }
                        return null;
                    })}
                </tbody>
            </Table>
        );

    };

    const [bookingNotification, setBookingNotification] = useState<BookingDetailFullName[]>();

    const fetchBookingNotification = async (date: string, time: string, sportFieldId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/rest/booking/detail/find/date/and/time/${date}/${time}/${sportFieldId}`);
            if (!response.ok) throw new Error("Không tìm thấy sân sắp tới");

            const bookingNotification = await response.json() as BookingDetailFullName[];
            if (bookingNotification?.length >= 1) {
                setBookingNotification(bookingNotification);
            }
        } catch (error) {
            toast.error("Lỗi");
        }
    };

    // Notification
    useEffect(() => {
        if (owner && checkUsername === localStorage.getItem('username')) {
            const now = new Date();
            const currentMinutes = now.getMinutes();

            const dateNow = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString();

            const selectedSportData = dataSport[selectSport];

            if (!selectedSportData) {
                console.error("Selected sport data is invalid");
                return;
            }
            const getFindBookingSport = async () => {
                if (currentMinutes === 0) {
                    await fetchBookingNotification(dateNow, now.getHours().toString() + 'h30', selectedSportData.sportFieldId);
                } else if (currentMinutes === 30) {
                    await fetchBookingNotification(dateNow, (now.getHours() + 1).toString() + 'h00', selectedSportData.sportFieldId);
                }
            }

            getFindBookingSport();
            refreshStatusBooking();
        }
    }, [selectDate, selectSport, dataSport, checkNotification, checkUsername]);

    const [sportDetail, setSportDetail] = useState<SportFieldDetail>();
    const [startTime, setStartTime] = useState("");
    const [dayStartBooking, setDayStartBooking] = useState("");
    const [startTimeKey, setStartTimeKey] = useState<number>(1);
    const [bookingDetailData, setBookingDetailData] = useState<BookingDetailFullName>();
    const [bookingBySubscriptionKey, setDataBookingBySubscriptionKey] = useState<BookingDetail[]>();

    const handleGetDataBookingOnDay = (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetailId = event.currentTarget.getAttribute("sport-detail");
        const timeData = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = new Date(onDay);

        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetailId));

        if (sportDetailId && timeData && dayStartBooking) {
            setSportDetail(selectedSportDetail);
            setStartTime(timeData);
            setDayStartBooking(dayStartBooking.toLocaleDateString('en-CA'));
            setStartTimeKey(startTimeKey + 1);
            setShowBookingModal(true);
        }
    }

    const handleViewDataOnDay = async (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetailId = event.currentTarget.getAttribute("sport-detail");
        const timeData = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = new Date(onDay).toLocaleDateString('en-CA');

        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetailId));



        if (sportDetailId && timeData && dayStartBooking && selectedSportDetail) {

            const responseBookingDetail = await fetch(`http://localhost:8080/rest/booking/detail/findbystarttime/sportfielddetail/${timeData}/${selectedSportDetail?.sportFielDetailId}/${dayStartBooking}`);
            if (!responseBookingDetail.ok) {
                throw new Error(`Error fetching data: ${responseBookingDetail.statusText}`);
            }

            const bkDData = await responseBookingDetail.json() as BookingDetailFullName;

            setBookingDetailData(bkDData);
            setSportDetail(selectedSportDetail);
            setStartTime(timeData);
            setDayStartBooking(dayStartBooking);
            setStartTimeKey(startTimeKey + 1);
            setShowViewOrEditBookingModal(true);
        }
    };

    const handleGetDataBookingOnWeek = (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetailId = event.currentTarget.getAttribute("sport-detail");
        const timeData = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = event.currentTarget.getAttribute("day-data");

        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetailId));

        if (sportDetailId && timeData && dayStartBooking) {
            setSportDetail(selectedSportDetail);
            setStartTime(timeData);
            setDayStartBooking(dayStartBooking);
            setStartTimeKey(startTimeKey + 1);
            setShowBookingModal(true);
        }
    };

    const handleViewDataOnWeek = async (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetailId = event.currentTarget.getAttribute("sport-detail");
        const timeData = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = event.currentTarget.getAttribute("day-data");


        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetailId));

        if (sportDetailId && timeData && dayStartBooking && selectedSportDetail) {
            const responseBookingDetail = await fetch(`http://localhost:8080/rest/booking/detail/findbystarttime/sportfielddetail/${timeData}/${selectedSportDetail.sportFielDetailId}/${dayStartBooking}`);
            if (!responseBookingDetail.ok) {
                throw new Error(`Error fetching data: ${responseBookingDetail.statusText}`);
            }

            const bkDData = await responseBookingDetail.json() as BookingDetailFullName;

            setBookingDetailData(bkDData);
            setSportDetail(selectedSportDetail);
            setStartTime(timeData);
            setDayStartBooking(dayStartBooking);
            setStartTimeKey(startTimeKey + 1);

            const responseBookingSubscriptionKey = await fetch(
                `http://localhost:8080/rest/user/booking/detail/getbyday/subscriptionkey/${bkDData.subscriptionKey}`
            );

            if (!responseBookingSubscriptionKey.ok) {
                throw new Error(`Error fetching data: ${responseBookingSubscriptionKey.statusText}`);
            }

            const dataBookingBySubscriptionKey = await responseBookingSubscriptionKey.json() as BookingDetail[];

            setDataBookingBySubscriptionKey(dataBookingBySubscriptionKey);
            setShowViewOrEditBookingModal(true);
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
                return "frame-overdue-secondary";
            case "Chưa đặt":
                return "frame-overdue-secondary";
            case "Sửa chữa":
                return "frame-edit-secondary";
            default:
                return "";
        }
    };

    const clearData = () => {
        setOperatingTime(0);
        setDataTimeSport([]);
        setBookingsOnDay({});
        setBookingsOnWeek({});
    }

    const [_isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }

        };
    }

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (startDate) {
            const formattedDate = `${startDate?.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
            setOnDay(formattedDate);
            setStartWeek(formattedDate);
        }
    }, [startDate]);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };;

    useEffect(() => {

        if (bookingNotification) {
            const timeoutId = setTimeout(() => {
                setNotificationModal(true);
            }, 500);

            return () => clearTimeout(timeoutId);
        }

    }, [bookingNotification])

    const renderNotification = () => {
        return (
            <div className="text-center">
                {bookingNotification?.map(item => (
                    <>
                        <b key={item.bookingDetailId} className="fs-16">{item.sportFieldDetail.name} của bạn có lịch đá vào lúc {item.startTime} đến {item.endTime} (trong 30 phút nữa).</b><br />
                    </>
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <i onClick={toggleFullScreen} className="bi bi-fullscreen fs-5"></i>
                <h3 className="text-danger fw-bold" style={{ fontSize: '20px' }}> LỊCH ĐẶT SÂN</h3>
                <a href="#701">
                    <i className="bi bi-question-circle fs-5"></i>
                </a>
            </div>
            <Row className="align-items-center mb-3 text-center">
                <Col md={4}>
                    <Row className="g-0 toggle-row">
                        <Col className={`toggle-col ${selectDate === 0 ? 'active' : ''}`}
                            onClick={() => setSelectDate(0)}>
                            Một ngày
                        </Col>
                        <Col className={`toggle-col ${selectDate === 1 ? 'active' : ''}`}
                            onClick={() => setSelectDate(1)}>
                            Một tuần
                        </Col>
                    </Row>
                </Col>

                <Col md={4} className="text-center">
                    {selectDate == 0 ?
                        <div className="header-date date-picker-container">
                            <i className="bi bi-arrow-left" onClick={() => setOnDayAndOnWeek('backward')}></i>
                            <span onClick={handleButtonClick} className="mx-3">{formatDateVN(onDay)}</span>
                            {isOpen && (
                                <div className="date-picker-dropdown">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            setIsOpen(false);
                                        }}
                                        inline
                                    />
                                    <button onClick={() => {
                                        const today = new Date();
                                        const todayFormat = new Intl.DateTimeFormat('en-CA').format(today);
                                        setOnDay(todayFormat),
                                            setStartWeek(todayFormat),
                                            setIsOpen(false),
                                            setStartDate(today)
                                    }} className="btn btn-dark w-100">Hôm nay</button>
                                </div>
                            )}
                            <i className="bi bi-arrow-right" onClick={() => setOnDayAndOnWeek('forward')}></i>
                        </div>
                        :
                        <div className="header-date date-picker-container">
                            <i className="bi bi-arrow-left" onClick={() => setOnDayAndOnWeek('backward')}></i>
                            <span onClick={handleButtonClick} className="mx-3">Từ {formatDateVN(startWeek)} đến {formatDateVN(endWeek)}</span>
                            {isOpen && (
                                <div className="date-picker-dropdown">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            setIsOpen(false);
                                        }}
                                        inline
                                    />
                                    <button onClick={() => {
                                        const today = new Date();
                                        const todayFormat = new Intl.DateTimeFormat('en-CA').format(today);
                                        setOnDay(todayFormat),
                                            setStartWeek(todayFormat),
                                            setIsOpen(false),
                                            setStartDate(today)
                                    }} className="btn btn-dark w-100">Hôm nay</button>
                                </div>
                            )}
                            <i className="bi bi-arrow-right" onClick={() => setOnDayAndOnWeek('forward')}></i>
                        </div>
                    }
                </Col>

                <Col md={4}>
                    <div className="d-flex">
                        <select
                            value={selectSport}
                            onChange={(e) => {
                                setSelectSport(Number(e.target.value));
                                clearData();
                            }}
                            className="form-select" style={{ border: '1px solid' }}
                            aria-label="Default select example"
                        >
                            {dataSport &&
                                dataSport.length > 0 &&
                                dataSport.map((item, index) => (
                                    <option key={item.sportFieldId} value={index}>
                                        {item.name}
                                    </option>
                                ))}
                        </select>
                        <button onClick={() => setSearchShowBookingModal(true)} className="fw-bold btn btn-dark ms-2"><i className="bi bi-search"></i></button>
                    </div>
                </Col>
            </Row>
            {checkLoadingData ?
                <div className="div-tb d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                selectDate == 0 ?
                    <div className="div-tb">
                        <Table >
                            <thead className="tb-head">
                                <tr>
                                    <th>Thời gian</th>
                                    {dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails &&
                                        dataSport[selectSport].sportFielDetails.map(item => (
                                            <th key={item.sportFielDetailId}>{item.name}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </Table>
                    </div>
                    :
                    <div className="div-tb">
                        {renderTableRowsByWeek()}
                    </div>
            }

            <BookingModal showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal}
                sportDetail={sportDetail} startTime={startTime} dayStartBooking={dayStartBooking}
                sport={dataSport && dataSport[selectSport]} owner={owner}
                checkDataStatus={checkDataStatus} setCheckDataStatus={setCheckDataStatus} startTimeKey={startTimeKey + 100}>
            </BookingModal >
            <ViewEditBookingModal bookingBySubscriptionKey={bookingBySubscriptionKey && bookingBySubscriptionKey}
                showViewOrEditBookingModal={showViewOrEditBookingModal}
                setShowViewOrEditBookingModal={setShowViewOrEditBookingModal} owner={owner} sport={dataSport && dataSport[selectSport]}
                checkDataStatus={checkDataStatus} setCheckDataStatus={setCheckDataStatus} startTimeKey={startTimeKey + 1}
                bookingDetailData={bookingDetailData}>
            </ViewEditBookingModal >
            <SearchBookingModal showSearchBookingModal={showSearchBookingModal} setSearchShowBookingModal={setSearchShowBookingModal}
                dataTimeSport={dataTimeSport.filter(time => time !== "undefinedh00" && time !== null)}
                sportField={dataSport && dataSport[selectSport]}>
            </SearchBookingModal>
            <NotificationModal textHeadNotification={"Thông báo"} renderNotification={renderNotification} showNotificationModal={showNotificationModal} setNotificationModal={setNotificationModal}>
            </NotificationModal>
        </>
    );
}
