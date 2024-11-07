'use client';
import BookingModal from "@/components/Owner/modal/booking.modal";
import SearchBookingModal from "@/components/Owner/modal/search-booking.modal";
import ViewEditBookingModal from "@/components/Owner/modal/view-edit-booking.modal";
import { formatDateVN } from "@/components/Utils/Format";
import { useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import useSWR from "swr";


type BookingsTypeOnDay = {
    [time: string]: BookingDetails[];
};

type BookingDetails = {
    status: string;
    bookingId: number;
    fullName: string;
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
    const [checkDataStatus, setCheckDataStatus] = useState<boolean>(true);

    const [bookingsOnDay, setBookingsOnDay] = useState<BookingsTypeOnDay>({
        // "6h00": ["Đã đặt", "Tạm đóng", "Còn trống"],
        // "6h10": ["Đã đặt", "Tạm đóng"]

    });

    const [bookingsOnWeek, setBookingsOnWeek] = useState<BookingsTypeOnWeek>({
        // "6h00": {
        //     "Sân 1": ["Đã đặt", "Tạm đóng", "Tạm đóng", "Còn trống", "Còn trống", "Còn trống", "Còn trống"],
        //     "Sân 2": ["Còn trống", "Tạm đóng", "Còn trống", "Còn trống", "Còn trống", "Còn trống", "Còn trống"],
        // }, "6h30": {
        //     "Sân 1": ["Tạm đóng", "Tạm đóng", "Còn trống", "Còn trống", "Còn trống", "Còn trống", "Còn trống"],
        //     "Sân 2": ["Đã đặt", "Tạm đóng", "Còn trống", "Còn trống", "Còn trống", "Còn trống", "Còn trống"],
        // }, "7h00": {
        //     "Sân 1": ["Đã đặt", "Tạm đóng", "Còn trống", "Còn trống", "Còn trống", "Còn trống", "Còn trống"],
        //     "Sân 2": ["Đã đặt", "Tạm đóng", "Còn trống", "Còn trống", "Còn trống", "Còn trống", "Còn trống"],
        // }
    })

    // const sampleData: BookingsTypeOnWeek = {
    //     "6h00": {
    //         "Sân 1": [
    //             { status: "Đã đặt", bookingId: 101 },
    //             { status: "Tạm đóng", bookingId: 102 },
    //             { status: "Còn trống", bookingId: 103 },
    //             { status: "Đã đặt", bookingId: 101 }, // Same bookingId as first slot
    //             { status: "Còn trống", bookingId: 104 },
    //             { status: "Tạm đóng", bookingId: 102 }, // Same bookingId as second slot
    //             { status: "Còn trống", bookingId: 105 }
    //         ],
    //         "Sân 2": [
    //             { status: "Còn trống", bookingId: 201 },
    //             { status: "Đã đặt", bookingId: 202 },
    //             { status: "Còn trống", bookingId: 201 }, // Same bookingId as first slot
    //             { status: "Tạm đóng", bookingId: 203 },
    //             { status: "Còn trống", bookingId: 204 },
    //             { status: "Đã đặt", bookingId: 202 }, // Same bookingId as second slot
    //             { status: "Tạm đóng", bookingId: 205 }
    //         ]
    //     },
    //     "6h30": {
    //         "Sân 1": [
    //             { status: "Đã đặt", bookingId: 106 },
    //             { status: "Còn trống", bookingId: 107 },
    //             { status: "Tạm đóng", bookingId: 108 },
    //             { status: "Đã đặt", bookingId: 106 }, // Same bookingId as first slot
    //             { status: "Còn trống", bookingId: 109 },
    //             { status: "Tạm đóng", bookingId: 108 }, // Same bookingId as third slot
    //             { status: "Còn trống", bookingId: 110 }
    //         ],
    //         "Sân 2": [
    //             { status: "Còn trống", bookingId: 205 },
    //             { status: "Đã đặt", bookingId: 206 },
    //             { status: "Còn trống", bookingId: 207 },
    //             { status: "Đã đặt", bookingId: 206 }, // Same bookingId as second slot
    //             { status: "Tạm đóng", bookingId: 208 },
    //             { status: "Còn trống", bookingId: 207 }, // Same bookingId as third slot
    //             { status: "Đã đặt", bookingId: 209 }
    //         ]
    //     },
    //     "7h00": {
    //         "Sân 1": [
    //             { status: "Đã đặt", bookingId: 111 },
    //             { status: "Tạm đóng", bookingId: 112 },
    //             { status: "Còn trống", bookingId: 113 },
    //             { status: "Đã đặt", bookingId: 111 }, // Same bookingId as first slot
    //             { status: "Còn trống", bookingId: 114 },
    //             { status: "Tạm đóng", bookingId: 112 }, // Same bookingId as second slot
    //             { status: "Còn trống", bookingId: 115 }
    //         ],
    //         "Sân 2": [
    //             { status: "Còn trống", bookingId: 209 },
    //             { status: "Đã đặt", bookingId: 210 },
    //             { status: "Tạm đóng", bookingId: 211 },
    //             { status: "Còn trống", bookingId: 209 }, // Same bookingId as first slot
    //             { status: "Đã đặt", bookingId: 210 }, // Same bookingId as second slot
    //             { status: "Tạm đóng", bookingId: 212 },
    //             { status: "Còn trống", bookingId: 213 }
    //         ]
    //     }
    // };


    const [owner, setOwner] = useState<Owner>();

    useEffect(() => {
        getOwner();
    }, [])

    const getOwner = async () => {
        const username = localStorage.getItem('username');
        if (username) {
            const responseOwner = await fetch(`http://localhost:8080/rest/owner/${username}`);
            if (!responseOwner.ok) {
                throw new Error('Error fetching data');
            }
            const dataOwner = await responseOwner.json() as Owner;
            setOwner(dataOwner);
        }
    }

    const [selectDate, setSelectDate] = useState<number>(0);
    const [selectSport, setSelectSport] = useState<number>(0);

    const [dataSport, setDataSport] = useState<SportField[]>([])

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(owner && `http://localhost:8080/rest/sport_field_by_owner/${owner.ownerId}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setDataSport(data);
    }, [data])

    useEffect(() => {
        getTime();
    }, [dataSport, selectSport])

    const [opening, setOpening] = useState<number>();
    const [closing, setClosing] = useState<number>();
    const [operatingTime, setOperatingTime] = useState<number>(0);

    const [dataTimeSport, setDataTimeSport] = useState<string[]>([]);

    useEffect(() => {
        if (dataTimeSport.length > 0) {
            const newBookingsOnDay = { ...bookingsOnDay };
            const newBookingsOnWeek = { ...bookingsOnWeek };

            const validTimes = dataTimeSport.filter(time => time !== "undefinedh00" && time !== null);

            // if (selectSport == 0) {
            validTimes.forEach((time) => {
                if (!newBookingsOnDay[time]) {
                    newBookingsOnDay[time] = [];
                    // console.log(newBookings[time]);
                }
            });

            setBookingsOnDay(newBookingsOnDay); // Cập nhật state bookings
            // } else {
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
                // }
                setBookingsOnWeek(newBookingsOnWeek);
            }
            setCheckDataBooking1(!checkDataBooking1)
        }
    }, [dataTimeSport])

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

        setDataTimeSport((prevData) => [...prevData, ...newData]);

    }, [operatingTime])

    const getTime = () => {
        if (dataSport && dataSport.length > selectSport) {
            const open = dataSport[selectSport]?.opening;
            const close = dataSport[selectSport]?.closing;

            if (open && typeof open === 'string' && close && typeof close === 'string') {
                const numberOpen = open.match(/\d+/);
                const numberClose = close.match(/\d+/);
                if (numberOpen && numberClose) {
                    setOpening(Number(numberOpen[0]));
                    setClosing(Number(numberClose[0]));
                    setOperatingTime(Number(numberClose[0]) - Number(numberOpen[0]));
                } else {
                    // console.log('Không tìm thấy số trong chuỗi mở cửa.');
                }
            } else {
                // console.log('Giá trị mở cửa không hợp lệ:', open);
            }
        } else {
            // console.log('Không có dữ liệu thể thao hợp lệ hoặc selectSport không hợp lệ:', selectSport);
        }
    }

    const [days, setDays] = useState<string[]>();
    const [dayYears, setDayYears] = useState<string[]>();

    useEffect(() => {
        setDayOnWeek();
    }, [])

    const setDayOnWeek = () => {
        const today = new Date(startWeek);
        const days = [];
        const dayYears = [];
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        // console.log(`Start Week: ${today.toISOString().split('T')[0]}`);

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);

            const day = nextDay.getDate().toString().padStart(2, '0');
            const month = (nextDay.getMonth() + 1).toString().padStart(2, '0');
            const weekday = weekdays[nextDay.getDay()];

            days.push(`${weekday}, ${day}-${month}`);
            dayYears.push(`${nextDay.getFullYear()}-${month}-${day}`);
        }

        // console.log(dayYears);
        setDays(days);
        setDayYears(dayYears);
    };

    // SET STATUS
    const [checkDataBooking, setCheckDataBooking] = useState<boolean>(false);
    const [checkDataBooking1, setCheckDataBooking1] = useState<boolean>(false);

    useEffect(() => {
        setCheckDataBooking(prev => !prev);
    }, [checkDataBooking1]);

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

            // console.log(`${newStartWeek}-${newEndWeek}`);
        }
    };

    useEffect(() => {
        if (selectDate === 0) {
            const updatedBookingsOnDay: BookingsTypeOnDay = { ...bookingsOnDay };
            Object.entries(updatedBookingsOnDay).forEach(([time, statuses]) => {
                updatedBookingsOnDay[time] = [];
            });
            setBookingsOnDay(updatedBookingsOnDay);
            setDayOnWeek();
        } else {
            const updatedBookingsOnWeek = { ...bookingsOnWeek };
            Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                const sportDataTemporary = { ...sportData };
                Object.entries(sportDataTemporary).forEach(([sport, statuses]) => {
                    sportDataTemporary[sport] = [];
                })
                updatedBookingsOnWeek[time] = sportDataTemporary;
            })
            setBookingsOnWeek(updatedBookingsOnWeek);
            setDayOnWeek();
        }
    }, [onDay, startWeek, endWeek, selectDate, checkDataBooking, selectSport]);

    useEffect(() => {
        if (selectDate === 0) {
            setStatusOnDay();
        }
    }, [days])

    useEffect(() => {
        if (selectDate === 1) {
            setStatusOnWeek();
        }
    }, [dayYears]);


    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            if (selectDate === 0) {
                const updatedBookingsOnDay = { ...bookingsOnDay };
                Object.entries(updatedBookingsOnDay).forEach(([time, statuses]) => {
                    updatedBookingsOnDay[time] = [];
                });
                setBookingsOnDay(updatedBookingsOnDay);
                setDayOnWeek();
            } else {
                const updatedBookingsOnWeek = { ...bookingsOnWeek };
                Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                    const sportDataTemporary = { ...sportData };
                    Object.entries(sportDataTemporary).forEach(([sport, statuses]) => {
                        sportDataTemporary[sport] = [];
                    });
                    updatedBookingsOnWeek[time] = sportDataTemporary;
                });
                setBookingsOnWeek(updatedBookingsOnWeek);
                setDayOnWeek();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [checkDataStatus]);


    const setStatusOnDay = async () => {
        console.log("Dữ liệu đã được load vào mốc giờ - 1:", new Date().toLocaleTimeString());

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
            if (dataBooking.length === 0) {
                Object.entries(bookingsOnDay).forEach(([time, statuses]) => {

                    const [hour, minute] = time.split('h').map(Number);
                    const timeDate = new Date(onDay);
                    timeDate.setHours(hour, minute);
                    if (timeDate < currentDateTime) {
                        statuses[index] = {
                            status: "Quá hạn",
                            bookingId: 0,
                            fullName: ""
                        };
                    } else if (sportDetails && sportDetails[index].status == "Hoạt động") {
                        statuses[index] = {
                            status: "Còn trống",
                            bookingId: 0,
                            fullName: ""
                        };
                    } else {
                        statuses[index] = {
                            status: "Tạm đóng",
                            bookingId: 0,
                            fullName: ""
                        };
                    }
                    setBookingsOnDay(prevBookingsOnDay => ({
                        ...prevBookingsOnDay,
                        [time]: statuses
                    }));
                });
                continue;
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
                        let timeIndex = newData.indexOf(time)
                        const [hour, minute] = time.split('h').map(Number);
                        const timeDate = new Date(onDay);
                        timeDate.setHours(hour, minute);

                        if (sportDetails[index].status == "Hoạt động") {
                            if (timeIndex >= 0) {
                                statuses[index] = {
                                    status: "Đã đặt",
                                    bookingId: item.bookingDetailId,
                                    fullName: item.fullName
                                };
                            } else if (statuses[index] && statuses[index].status == "Đã đặt") {
                                statuses[index] = {
                                    status: "Đã đặt",
                                    bookingId: statuses[index].bookingId,
                                    fullName: statuses[index].fullName
                                };
                            } else {
                                statuses[index] = {
                                    status: (timeDate < currentDateTime) ? 'Chưa đặt' : "Còn trống",
                                    bookingId: 0,
                                    fullName: ""
                                };
                            }
                        } else {
                            statuses[index] = {
                                status: "Tạm đóng",
                                bookingId: 0,
                                fullName: ""
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
    }

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
        console.log("Dữ liệu đã được load vào mốc giờ:", new Date().toLocaleTimeString());

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

                let hasBookingForDay = false;
                const bookingsForDay = dataBooking.filter(item => item.date === dayYear);

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
                            Object.entries(sportData).forEach(([sport, statuses]) => {

                                if (dayYear && sport === item.sportFieldDetail.name) {

                                    if (!sportData[sport][dayIndex]) {
                                        sportData[sport][dayIndex] = { status: "Còn trống", bookingId: 0, fullName: "" };
                                    }

                                    const timeIndex = newData.indexOf(time);
                                    const [hour, minute] = time.split('h').map(Number);
                                    const timeDate = new Date(dayYear);
                                    timeDate.setHours(hour, minute);

                                    if (item.sportFieldDetail.status === "Hoạt động") {
                                        if (timeIndex >= 0) {
                                            sportData[sport][dayIndex] = {
                                                status: "Đã đặt",
                                                bookingId: item.bookingDetailId,
                                                fullName: item.fullName
                                            };
                                        } else if (sportData[sport][dayIndex].status === "Còn trống") {
                                            sportData[sport][dayIndex] = {
                                                status: (timeDate < currentDateTime) ? "Chưa đặt" : "Còn trống",
                                                bookingId: 0,
                                                fullName: ""
                                            };
                                        }
                                    } else {
                                        sportData[sport][dayIndex] = {
                                            status: "Tạm đóng",
                                            bookingId: 0,
                                            fullName: ""
                                        };
                                    }
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
                                if (sportDetails && timeDate < currentDateTime && sportDetails[index].status === "Hoạt động") {
                                    sportData[sport][dayIndex] = {
                                        status: "Chưa đặt",
                                        bookingId: 0,
                                        fullName: ""
                                    };
                                } else {
                                    sportData[sport][dayIndex] = {
                                        status: sportDetails[index].status === "Hoạt động" ? "Còn trống" : "Tạm đóng",
                                        bookingId: 0,
                                        fullName: ""
                                    };
                                }
                            }
                        });
                        updatedBookingsOnWeek[time] = sportData;
                    });
                }
            }
        }
        setBookingsOnWeek(updatedBookingsOnWeek);
    };



    // LOAD TABLE
    const renderTableRows = () => {
        const bookingCounts: any = {};
        const displayedBookingIds = new Set();

        Object.entries(bookingsOnDay).map(([time, statuses], i) => (
            statuses.map((status, index) => {
                const bookingId = status.bookingId;
                if (bookingId && bookingId !== 0) {
                    bookingCounts[bookingId] = (bookingCounts[bookingId] || 0) + 1;
                }
            })
        ))
        console.log(bookingCounts);

        return Object.entries(bookingsOnDay).map(([time, statuses], i) => (
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
                                    className={`w-10 ${getBadgeClass(status.status)}`}
                                    rowSpan={bookingCounts[status.bookingId]}
                                    onClick={handleViewDataOnDay}
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
                                        </span><br />
                                        <b className="text-success">{status.bookingId == 0 ? "" :
                                            status.fullName == "Offline" ? 'Đặt tại sân' : status.fullName}</b>
                                    </div>
                                </td>
                            );
                        }
                    } else {
                        return (
                            <td key={index}
                                className={`w-10 ${getBadgeClass(status.status)}`}
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

    // const renderTableRowsByWeek = () => {
    //     return (
    //         <Table>
    //             <thead className="tb-head">
    //                 <tr>
    //                     <th rowSpan={2}>Giờ </th>
    //                     {days?.map((day, index) => (
    //                         <th colSpan={dataSport[selectSport]?.sportFielDetails?.length || 1} key={index}>{day}</th>
    //                     ))}
    //                 </tr>
    //                 <tr>
    //                     {days?.map(() => (
    //                         dataSport && dataSport.length > selectSport && Array.isArray(dataSport[selectSport].sportFielDetails) &&
    //                         dataSport[selectSport].sportFielDetails.map(item => (
    //                             <th key={item.sportFielDetailId}>{item.name}</th>
    //                         ))
    //                     ))}
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {Object.entries(bookingsOnWeek).map(([time, sportData]) => {
    //                     if (dataSport && dataSport.length > selectSport && Array.isArray(dataSport[selectSport].sportFielDetails)) {
    //                         const sportFielDetails = dataSport[selectSport].sportFielDetails;
    //                         return (
    //                             <tr key={time}>
    //                                 <td className="title fw-bold" style={{ textAlign: 'center' }}>{time}</td>
    //                                 {days?.map((_, dayIndex) => (
    //                                     sportFielDetails.map((item) => {
    //                                         const bookingData = sportData[item.name] || [];
    //                                         const statusItem = bookingData.length > 0 ? bookingData[0].status : "Còn trống";

    //                                         // Lấy ID booking tương ứng với trạng thái đầu tiên
    //                                         const bookingId = bookingData.length > 0 ? bookingData[0].bookingId : '';

    //                                         const isAvailable =
    //                                             dayYears &&
    //                                             dayYears[dayIndex] &&
    //                                             new Date().setHours(0, 0, 0, 0) <= new Date(dayYears[dayIndex]).setHours(0, 0, 0, 0) &&
    //                                             statusItem === "Còn trống";

    //                                         return (
    //                                             <td
    //                                                 key={`${time}-${item.sportFielDetailId}-${dayIndex}`}
    //                                                 sport-detail={item.sportFielDetailId}
    //                                                 time-data={time}
    //                                                 day-data={dayYears && dayYears[dayIndex]}
    //                                                 onClick={statusItem === 'Chưa đặt' || statusItem === 'Tạm đóng' ? undefined : isAvailable ? handleGetDataBookingOnWeek : handleViewDataOnWeek}
    //                                                 className={`w-10 ${getBadgeClass(statusItem)}`}
    //                                                 style={{ textAlign: 'center' }}
    //                                             >
    //                                                 <div className={`badge ${getBadgeClass(statusItem)}`}>
    //                                                     <span className="status-label">{statusItem}</span><br />
    //                                                     {bookingId && <span className="booking-id">ID: {bookingId}</span>} {/* Hiển thị ID của trạng thái */}
    //                                                 </div>
    //                                             </td>
    //                                         );
    //                                     })
    //                                 ))}
    //                             </tr>
    //                         );
    //                     }
    //                     return null;
    //                 })}
    //             </tbody>
    //         </Table>
    //     );
    // };

    const renderTableRowsByWeek = () => {
        const bookingCounts: any = {};
        const displayedBookingIds = new Set();

        Object.entries(bookingsOnWeek).forEach(([time, sportData]) => {
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
                        <th rowSpan={2}>Giờ </th>
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
                    {Object.entries(bookingsOnWeek).map(([time, sportData], i) => {
                        if (dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails) {
                            const sportFielDetails = dataSport[selectSport].sportFielDetails;
                            return (
                                <tr key={time}>
                                    <td className="title fw-bold" style={{ textAlign: 'center' }}>{time}</td>
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
                                            const checkNoFunc = statusItem === 'Chưa đặt' || statusItem === 'Tạm đóng';
                                            if (statusItem === "Đã đặt") {
                                                if (displayedBookingIds.has(bookingId)) {
                                                    return null;
                                                } else {
                                                    displayedBookingIds.add(bookingId);
                                                    return (
                                                        <td
                                                            key={`${time}-${item.sportFielDetailId}-${dayIndex}`}
                                                            rowSpan={bookingCounts[bookingId]} // Gán rowSpan cho ô đầu tiên
                                                            sport-detail={dataSport &&
                                                                dataSport[selectSport] &&
                                                                dataSport[selectSport].sportFielDetails &&
                                                                dataSport[selectSport].sportFielDetails[i] ?
                                                                dataSport[selectSport].sportFielDetails[i].sportFielDetailId : 'N/A'}
                                                            time-data={time}
                                                            day-data={dayYears && dayYears[dayIndex]}
                                                            onClick={checkNoFunc ? undefined : isAvailable ? handleGetDataBookingOnWeek : handleViewDataOnWeek}
                                                            className={`w-10 ${getBadgeClass(statusItem)}`}
                                                            style={{ textAlign: 'center' }}
                                                        >
                                                            <div className={`badge mx-5`}>
                                                                <span className="status-label">{statusItem}</span><br />
                                                                <b className="text-success">{bookingId == 0 ? "" :
                                                                    fullName == "Offline" ? 'Đặt tại sân' : fullName}</b>
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
                                                        onClick={statusItem === 'Chưa đặt' || statusItem === 'Tạm đóng' ? undefined : isAvailable ? handleGetDataBookingOnWeek : handleViewDataOnWeek}
                                                        className={`w-10 hv-tb ${getBadgeClass(statusItem)}`}
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        <div className={`badge mx-5`} style={{ position: 'relative' }}>
                                                            <span className="status-label">{statusItem}</span><br />
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

    useEffect(() => {
        let hasExecuted = false;
        const checkMinuteChange = () => {
            const now = new Date();
            const currentMinutes = now.getMinutes();

            if ((currentMinutes === 0 || currentMinutes === 30) && !hasExecuted) {
                // console.log("Thực hiện cập nhật trạng thái tại phút:", currentMinutes);
                if (selectDate === 0) {
                    setStatusOnDay();
                } else {
                    setStatusOnWeek();
                }
                hasExecuted = true;
            } else if (currentMinutes !== 0 && currentMinutes !== 30) {
                hasExecuted = false;
            }
        };

        const intervalId = setInterval(checkMinuteChange, 1000);

        return () => clearInterval(intervalId);
    }, [selectDate]);

    const [sportDetail, setSportDetail] = useState<SportFieldDetail>();
    const [startTime, setStartTime] = useState("");
    const [dayStartBooking, setDayStartBooking] = useState("");
    const [startTimeKey, setStartTimeKey] = useState<boolean>(true);
    const [bookingDetailData, setBookingDetailData] = useState<BookingDetail>();
    const [bookingBySubscriptionKey, setDataBookingBySubscriptionKey] = useState<BookingDetail[]>();
    const [userData, setUserData] = useState<User>();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();

    const handleGetDataBookingOnDay = (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetail = event.currentTarget.getAttribute("sport-detail");
        const startTime = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = new Date(onDay);

        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));

        if (sportDetail && startTime && dayStartBooking) {
            setSportDetail(selectedSportDetail);
            setStartTime(startTime);
            setDayStartBooking(dayStartBooking.toLocaleDateString('en-CA'));
            setStartTimeKey(!startTimeKey);
            setShowBookingModal(true);
        }
        // toast.success(sportDetail + " - " + timeStart + " - " + dayStartBooking);
    }

    const handleViewDataOnDay = async (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetail = event.currentTarget.getAttribute("sport-detail");
        const startTime = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = new Date(onDay).toLocaleDateString('en-CA');

        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));

        const responseBookingDetail = await fetch(`http://localhost:8080/rest/booking/detail/findbystarttime/sportfielddetail/${startTime}/${selectedSportDetail?.sportFielDetailId}/${dayStartBooking}`);
        if (!responseBookingDetail.ok) {
            throw new Error(`Error fetching data: ${responseBookingDetail.statusText}`);
        }

        const bkDData = await responseBookingDetail.json() as BookingDetail;

        const responsePaymentMethod = await fetch(`http://localhost:8080/rest/paymentMethod/by/bookingdetailid/${bkDData.bookingDetailId}`);
        if (!responsePaymentMethod.ok) {
            throw new Error(`Error fetching data: ${responsePaymentMethod.statusText}`);
        }

        const resPaymentMethod = await responsePaymentMethod.json() as PaymentMethod;

        const responseUser = await fetch(`http://localhost:8080/rest/user/getbysportdetailid/${bkDData.bookingDetailId}`);
        if (!responseUser.ok) {
            throw new Error(`Error fetching data: ${responseUser.statusText}`);
        }

        const userData = await responseUser.json() as User;

        if (sportDetail && startTime && dayStartBooking && bkDData) {
            setBookingDetailData(bkDData);
            setUserData(userData);
            setPaymentMethod(resPaymentMethod);
            setSportDetail(selectedSportDetail);
            setStartTime(startTime);
            setDayStartBooking(dayStartBooking);
            setStartTimeKey(!startTimeKey);
            setShowViewOrEditBookingModal(true);
        }
    };

    const handleGetDataBookingOnWeek = (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetail = event.currentTarget.getAttribute("sport-detail");
        const startTime = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = event.currentTarget.getAttribute("day-data");

        // console.log(sportDetail);
        // toast.success(startTime);
        // toast.success(dayStartBooking);
        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));

        if (sportDetail && startTime && dayStartBooking) {
            setSportDetail(selectedSportDetail);
            setStartTime(startTime);
            setDayStartBooking(dayStartBooking);
            setStartTimeKey(!startTimeKey);
            setShowBookingModal(true);
            // toast.success(sportDetail + " - " + timeStart + " - " + dayStartBooking);
        }
    };

    const handleViewDataOnWeek = async (event: React.MouseEvent<HTMLTableCellElement>) => {
        const sportDetail = event.currentTarget.getAttribute("sport-detail");
        const startTime = event.currentTarget.getAttribute("time-data");
        const dayStartBooking = event.currentTarget.getAttribute("day-data");

        const selectedSportDetail = dataSport[selectSport].sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));

        const responseBookingDetail = await fetch(`http://localhost:8080/rest/booking/detail/findbystarttime/sportfielddetail/${startTime}/${selectedSportDetail?.sportFielDetailId}/${dayStartBooking}`);
        if (!responseBookingDetail.ok) {
            throw new Error(`Error fetching data: ${responseBookingDetail.statusText}`);
        }

        const bkDData = await responseBookingDetail.json() as BookingDetail;

        const responsePaymentMethod = await fetch(`http://localhost:8080/rest/paymentMethod/by/bookingdetailid/${bkDData.bookingDetailId}`);
        if (!responsePaymentMethod.ok) {
            throw new Error(`Error fetching data: ${responsePaymentMethod.statusText}`);
        }

        const resPaymentMethod = await responsePaymentMethod.json() as PaymentMethod;

        const responseUser = await fetch(`http://localhost:8080/rest/user/getbysportdetailid/${bkDData.bookingDetailId}`);
        if (!responseUser.ok) {
            throw new Error(`Error fetching data: ${responseUser.statusText}`);
        }

        const userData = await responseUser.json() as User;

        if (sportDetail && startTime && dayStartBooking && bkDData) {
            setBookingDetailData(bkDData);
            setUserData(userData);
            setPaymentMethod(resPaymentMethod);
            setSportDetail(selectedSportDetail);
            setStartTime(startTime);
            setDayStartBooking(dayStartBooking);
            setStartTimeKey(!startTimeKey);

            const responseBookingSubscriptionKey = await fetch(
                `http://localhost:8080/rest/user/booking/detail/getbyday/subscriptionkey/${bkDData.subcriptionKey}`
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
            default:
                return "";
        }
    };

    const clearData = () => {
        setDataTimeSport([]);
        setBookingsOnDay({});
        setBookingsOnWeek({});
    }

    const [isFullScreen, setIsFullScreen] = useState(false);

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

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };;


    if (isLoading) return <h2>Data is comming</h2>

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <i onClick={toggleFullScreen} className="bi bi-fullscreen fs-5"></i>
                <h3 className="text-danger fw-bold" style={{ fontSize: '20px' }}> LỊCH ĐẶT SÂN</h3>
                <i className="bi bi-question-circle fs-5"></i>
            </div>
            <Row className="align-items-center my-3 text-center">
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
                    {/* <Row className="g-0 toggle-row">
                        <Col md={10}>
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
                        </Col>
                        <Col md={1}>
                            <button className="fw-bold btn btn-dark" style={{ width: '100%' }}><i className="bi bi-search"></i></button>
                        </Col>
                    </Row> */}

                </Col>
            </Row>
            {selectDate == 0 ?
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
                checkDataStatus={checkDataStatus} setCheckDataStatus={setCheckDataStatus} startTimeKey={startTimeKey}>
            </BookingModal >
            <ViewEditBookingModal bookingBySubscriptionKey={bookingBySubscriptionKey && bookingBySubscriptionKey}
                showViewOrEditBookingModal={showViewOrEditBookingModal} paymentMethod={paymentMethod}
                setShowViewOrEditBookingModal={setShowViewOrEditBookingModal} owner={owner} sport={dataSport && dataSport[selectSport]}
                checkDataStatus={checkDataStatus} setCheckDataStatus={setCheckDataStatus} startTimeKey={startTimeKey}
                bookingDetailData={bookingDetailData} userData={userData}>
            </ViewEditBookingModal >
            <SearchBookingModal showSearchBookingModal={showSearchBookingModal} setSearchShowBookingModal={setSearchShowBookingModal}
                dataTimeSport={dataTimeSport.filter(time => time !== "undefinedh00" && time !== null)}>

            </SearchBookingModal>
        </>
    );
}
