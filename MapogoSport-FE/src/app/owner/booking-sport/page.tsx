'use client';
import BookingModal from "@/components/Owner/modal/booking.modal";
import { formatDate } from "@/components/Utils/Format";
import { useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR from "swr";

type BookingsTypeOnDay = {
    [time: string]: string[];
};


type BookingsTypeOnWeek = {
    [time: string]: {
        [sport: string]: string[];
    };
};

export default function BookingSport() {
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

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

    const [owner, setOwner] = useState<Owner>();

    useEffect(() => {
        getOwner();
    }, [])

    const getOwner = async () => {
        const user = sessionStorage.getItem('user');

        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            const responseOwner = await fetch(`http://localhost:8080/rest/owner/${parsedUserData.username}`);
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

    // useEffect(() => {
    //     console.log('Start Week:', startWeek);
    //     console.log('End Week:', endWeek);
    //     // Thêm các log khác nếu cần
    // }, [startWeek, endWeek]);

    useEffect(() => {
        if (selectDate === 0) {
            setStatusOnDay();
        } else {
            setDayOnWeek();
        }
    }, [onDay, startWeek, endWeek, selectDate, checkDataBooking, selectSport]);

    useEffect(() => {
        setStatusOnWeek();
    }, [dayYears]);

    const [checkDataStatus, setCheckDataStatus] = useState<boolean>(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (selectDate === 0) {
                setStatusOnDay();
            } else {
                setStatusOnWeek();
            }
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

            const dataBooking = await response.json() as BookingDetail[];
            if (dataBooking.length === 0) {
                Object.entries(bookingsOnDay).forEach(([time, statuses]) => {

                    const [hour, minute] = time.split('h').map(Number);
                    const timeDate = new Date(onDay);
                    timeDate.setHours(hour, minute);
                    if (timeDate < currentDateTime) {
                        if (sportDetails && sportDetails[index].status == "Hoạt động") {
                            statuses[index] = "Quá hạn";
                        } else {
                            statuses[index] = "Tạm đóng";
                        }
                    } else if (sportDetails && sportDetails[index].status == "Hoạt động") {
                        statuses[index] = "Còn trống";
                    } else {
                        statuses[index] = "Tạm đóng";
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
                        if (sportDetails[index].status == "Hoạt động") {
                            let timeIndex = newData.indexOf(time)
                            const [hour, minute] = time.split('h').map(Number);
                            const timeDate = new Date(onDay);
                            timeDate.setHours(hour, minute);
                            if (timeIndex >= 0) {
                                statuses[index] = "Đã đặt";
                            } else if (timeDate < currentDateTime) {
                                statuses[index] = "Quá hạn";
                            } else {
                                if (statuses[index] == "Đã đặt") {
                                    statuses[index] = "Đã đặt";
                                } else {
                                    statuses[index] = "Còn trống";
                                }
                            }
                        } else {
                            statuses[index] = "Tạm đóng";
                        }
                    } else {
                        statuses[index] = "Còn trống";
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
        const currentDateTime = new Date();
        const sportDetails = dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails;
        const numFields = sportDetails ? sportDetails.length : 0;

        const updatedBookingsOnWeek = { ...bookingsOnWeek };

        for (let index = 0; index < numFields; index++) {
            const sportFieldId = sportDetails && sportDetails[index].sportFielDetailId;

            // Gọi API để lấy danh sách booking
            const response = await
                fetch(`http://localhost:8080/rest/user/booking/detail/getnextweek/${sportFieldId}/${dayYears &&
                    dayYears[0]}/${dayYears && dayYears[dayYears.length - 1]}`);

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const dataBooking = await response.json() as BookingDetail[];

            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const dayYear = dayYears && dayYears[dayIndex];

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
                                if (dayYear && sport === item.sportFieldDetail.name) {
                                    if (!sportDataTemporary[sport][dayIndex] ||
                                        sportDataTemporary[sport][dayIndex] === "Chưa đặt") {
                                        sportDataTemporary[sport][dayIndex] = "Còn trống";
                                    }

                                    const timeIndex = newData.indexOf(time);
                                    const [hour, minute] = time.split('h').map(Number);
                                    const timeDate = new Date(dayYear);
                                    timeDate.setHours(hour, minute);

                                    if (item.sportFieldDetail.status === "Hoạt động") {
                                        if (timeIndex >= 0) {
                                            sportDataTemporary[sport][dayIndex] = "Đã đặt";
                                        } else if (sportDataTemporary[sport][dayIndex] === "Còn trống") {
                                            sportDataTemporary[sport][dayIndex] = (timeDate < currentDateTime) ? "Chưa đặt" : "Còn trống";
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

                if (!hasBookingForDay && dayYears) {
                    Object.entries(updatedBookingsOnWeek).forEach(([time, sportData]) => {
                        const sportDataTemporary = { ...sportData };
                        Object.entries(sportDataTemporary).forEach(([sport, statuses], j) => {
                            const [hour, minute] = time.split('h').map(Number);
                            const timeDate = new Date(dayYears[dayIndex]);
                            timeDate.setHours(hour, minute);
                            if (sportDetails && timeDate < currentDateTime && sportDetails[index].status === "Hoạt động") {
                                sportDataTemporary[sport][dayIndex] = "Chưa đặt";
                            } else if (sportDetails && sport === sportDetails[index].name) {
                                sportDataTemporary[sport][dayIndex] = sportDetails[index].status === "Hoạt động" ? "Còn trống" : "Tạm đóng";
                            }
                        });
                        updatedBookingsOnWeek[time] = sportDataTemporary;
                    });
                }
            }
        }
        console.log(updatedBookingsOnWeek);

        setBookingsOnWeek(updatedBookingsOnWeek);
    };


    // LOAD TABLE
    const renderTableRows = () => {
        return Object.entries(bookingsOnDay).map(([time, statuses], i) => (
            <tr key={time}>
                <td className="title" style={{ textAlign: 'center' }}>{time}</td>
                {statuses.map((status, index) => (
                    <td key={index}
                        className={`w-10 ${getBadgeClass(status)}`}
                        style={new Date(onDay).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
                            && status === 'Còn trống' ? { cursor: 'pointer' } : { cursor: 'not-allowed' }}
                        onClick={new Date(onDay).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
                            && status === 'Còn trống' ? handleGetDataBookingOnDay : undefined}
                        time-data={time}
                        sport-detail={
                            dataSport &&
                                dataSport[selectSport] &&
                                dataSport[selectSport].sportFielDetails &&
                                dataSport[selectSport].sportFielDetails[index] ?
                                dataSport[selectSport].sportFielDetails[index].sportFielDetailId : 'N/A'
                        }>
                        <div className={`badge ${getBadgeClass(status)}`}>
                            <span className="status-label" >
                                {status}
                            </span>
                        </div>
                    </td>
                ))}
            </tr>
        ));
    };

    const renderTableRowsByWeek = () => {
        return (
            <Table >
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
                                <tr key={time} style={{ border: '1px solid #a1a1a1' }}>
                                    <td className="title fw-bold" style={{ textAlign: 'center' }}>{time}</td>
                                    {days?.map((_, dayIndex) => (
                                        sportFielDetails.map((item, i) => {
                                            const statusItem = sportData[item.name]?.[dayIndex] || "Còn trống";
                                            const isAvailable =
                                                dayYears &&
                                                dayYears[dayIndex] &&
                                                new Date().setHours(0, 0, 0, 0) <= new Date(dayYears[dayIndex]).setHours(0, 0, 0, 0) &&
                                                statusItem === "Còn trống";
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
                                                    onClick={isAvailable ? handleGetDataBookingOnWeek : undefined}
                                                    className={`w-10 ${getBadgeClass(statusItem)}`}
                                                    style={{ textAlign: 'center' }}
                                                >
                                                    <div className={`badge ${getBadgeClass(statusItem)}`}>
                                                        <span className="status-label">{statusItem}</span><br />
                                                    </div>
                                                </td>
                                            );
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

    const [sportDetail, setSportDetail] = useState<SportFieldDetail>();
    const [startTime, setStartTime] = useState("");
    const [dayStartBooking, setDayStartBooking] = useState("");
    const [startTimeKey, setStartTimeKey] = useState<boolean>(true);

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

    if (isLoading) return <h2>Data is comming</h2>

    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}> LỊCH ĐẶT SÂN</h3>
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
                        <div className="header-date">
                            <i className="bi bi-arrow-left" onClick={() => setOnDayAndOnWeek('backward')}></i>
                            <span className="mx-3">{onDay}</span>
                            <i className="bi bi-arrow-right" onClick={() => setOnDayAndOnWeek('forward')}></i>
                        </div>
                        :
                        <div className="header-date">
                            <i className="bi bi-arrow-left" onClick={() => setOnDayAndOnWeek('backward')}></i>
                            <span className="mx-3">Từ {formatDate(startWeek)} đến {formatDate(endWeek)}</span>
                            <i className="bi bi-arrow-right" onClick={() => setOnDayAndOnWeek('forward')}></i>
                        </div>
                    }
                </Col>

                <Col md={4}>
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
        </>
    );
}
