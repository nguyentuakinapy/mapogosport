'use client';
import BookingModal from "@/components/Owner/modal/booking.modal";
import { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
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

    const [selectTime, setSelectTime] = useState('');
    const [selectDate, setSelectDate] = useState<number>(0);
    const [selectSport, setSelectSport] = useState<number>(0);

    const [dataSport, setDataSport] = useState<SportField[]>([])

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/sport_field_by_owner/1`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        // console.log(data);
        setDataSport(data);
    }, [data])

    useEffect(() => {
        console.log(dataSport);
        getTime();
    }, [dataSport])

    const checkAndAddStatus = (time: string, newStatus: string) => {
        let checkAdd = true;
        // alert('Check checkAndAddStatus')

        setBookingsOnDay((prevBookingsOnDay) => {
            if (checkAdd) {
                const updatedBookingsOnDay = { ...prevBookingsOnDay };
                if (!updatedBookingsOnDay[time]) {
                    updatedBookingsOnDay[time] = [];
                }
                updatedBookingsOnDay[time].push(newStatus);
                // alert('Check setBookings')
                checkAdd = false;
                return updatedBookingsOnDay;
            } else {
                const updatedBookingsOnDay = { ...prevBookingsOnDay };
                return updatedBookingsOnDay;
            }
        });
    };


    const [opening, setOpening] = useState<number>();
    const [closing, setClosing] = useState<number>();
    const [operatingTime, setOperatingTime] = useState<number>(0);

    const [dataTimeSport, setDataTimeSport] = useState<string[]>([]);

    useEffect(() => {
        getTime();
        console.log(selectSport);
    }, [selectSport])

    useEffect(() => {
        if (dataTimeSport.length > 0) {
            const newBookingsOnDay = { ...bookingsOnDay };

            const validTimes = dataTimeSport.filter(time => time !== "undefinedh00" && time !== null);

            validTimes.forEach((time) => {
                if (!newBookingsOnDay[time]) {
                    newBookingsOnDay[time] = [];
                    // console.log(newBookings[time]);
                }
            });
            setBookingsOnDay(newBookingsOnDay); // Cập nhật state bookings
            const newBookingsOnWeek = { ...bookingsOnWeek };

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
            }

            setBookingsOnWeek(newBookingsOnWeek);
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
        setDataTimeSport((prevData) => [...prevData, ...newData]);
    }, [operatingTime])


    const getTime = () => {
        console.log("Get time");

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
                    console.log('Không tìm thấy số trong chuỗi mở cửa.');
                }
            } else {
                console.log('Giá trị mở cửa không hợp lệ:', open);
            }
        } else {
            console.log('Không có dữ liệu thể thao hợp lệ hoặc selectSport không hợp lệ:', selectSport);
        }
    }

    const [days, setDays] = useState<string[]>();
    const [dayYears, setDayYears] = useState<string[]>();

    useEffect(() => {
        const today = new Date(); // Ngày hiện tại
        const days = [];
        const dayYears = [];
        const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']; // Mảng các thứ trong tuần

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);

            const day = nextDay.getDate().toString().padStart(2, '0');
            const month = (nextDay.getMonth() + 1).toString().padStart(2, '0');
            // const year = nextDay.getFullYear();
            const weekday = weekdays[nextDay.getDay()];

            days.push(`${weekday}, ${day}-${month}`);
        }

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);

            const day = nextDay.getDate().toString().padStart(2, '0');
            const month = (nextDay.getMonth() + 1).toString().padStart(2, '0');
            const year = nextDay.getFullYear();
            const weekday = weekdays[nextDay.getDay()];

            dayYears.push(`${year}-${month}-${day}`);
        }

        setDays(days);
        setDayYears(dayYears);
    }, [])
    // SET STATUS

    const [checkDataBooking, setCheckDataBooking] = useState<boolean>(false);
    const [checkDataBooking1, setCheckDataBooking1] = useState<boolean>(false);

    useEffect(() => {
        console.log("bookingsOnDay đã được cập nhật:", bookingsOnDay);
        console.log("bookingsOnWeek đã được cập nhật:", bookingsOnWeek);
        for (let index = 0; index < 1; index++) {
            setCheckDataBooking(!checkDataBooking);
        }
    }, [checkDataBooking1]);

    const isFirstRun = useRef(true);

    useEffect(() => {
        // Nếu là lần render đầu tiên, bỏ qua
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        console.log("selectDate ", selectDate);
        if (selectDate === 0) {
            setStatusOnDay();
        } else {
            setStatusOnWeek();
        }
    }, [checkDataBooking, selectSport, selectDate])

    const setStatusOnDay = async () => {
        const sportDetails = dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails;
        const numFields = sportDetails ? sportDetails.length : 0;

        // console.log("Booking ", bookingsOnDay);
        for (let index = 0; index < numFields; index++) {

            const response = await
                fetch(`http://localhost:8080/rest/user/booking/detail/gettoday/${sportDetails && sportDetails[index].sportFielDetailId}`);

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const dataBooking = await response.json() as BookingDetail[];
            if (dataBooking.length === 0) {
                Object.entries(bookingsOnDay).forEach(([time, statuses]) => {
                    if (sportDetails && sportDetails[index].status == "Hoạt động") {
                        statuses[index] = "Còn trống"; // Thiết lập trạng thái là "Còn trống"
                    } else {
                        statuses[index] = "Tạm đóng"; // Thiết lập trạng thái là "Còn trống"
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
                        // console.log(sportDetails[index].status);

                        if (sportDetails[index].status == "Hoạt động") {
                            let timeIndex = newData.indexOf(time)

                            if (timeIndex >= 0) {
                                statuses[index] = "Đã đặt";
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

        const difference = endTotalMinutes - startTotalMinutes;

        // const hours = Math.floor(difference / 60);

        return difference;
    };

    const setStatusOnWeek = async () => {
        const sportDetails = dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails;
        const numFields = sportDetails ? sportDetails.length : 0;

        for (let index = 0; index < numFields; index++) {
            const sportFieldId = sportDetails && sportDetails[index].sportFielDetailId;

            // Gọi API để lấy danh sách booking
            const response = await fetch(`http://localhost:8080/rest/user/booking/detail/getnextweek/${sportFieldId}`);

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const dataBooking = await response.json() as BookingDetail[];
            console.log("dataBooking", dataBooking);

            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const dayYear = dayYears && dayYears[dayIndex];
                let hasBookingForDay = false;

                // Lọc các booking trùng ngày
                const bookingsForDay = dataBooking.filter(item => item.date === dayYear);

                if (bookingsForDay.length > 0) {
                    hasBookingForDay = true;

                    // Duyệt qua từng booking trong ngày
                    bookingsForDay.forEach(item => {
                        const newData: string[] = [];
                        newData.push(item.startTime);

                        // Tạo danh sách các thời gian trong khoảng từ startTime đến endTime
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

                        // Cập nhật trạng thái cho từng khoảng thời gian
                        Object.entries(bookingsOnWeek).forEach(([time, sportData]) => {
                            const sportDataTemporary = { ...sportData }; // Tạo bản sao
                            Object.entries(sportDataTemporary).forEach(([sport, statuses], j) => {
                                if (sport == item.sportFieldDetail.name) {
                                    if (item.sportFieldDetail.status == "Hoạt động") {
                                        const timeIndex = newData.indexOf(time);

                                        if (timeIndex >= 0) {
                                            sportDataTemporary[sport][dayIndex] = "Đã đặt"; // Nếu có trong khoảng thời gian đặt, set trạng thái Đã đặt
                                        } else if (!sportDataTemporary[sport][dayIndex] || sportDataTemporary[sport][dayIndex] === "Còn trống") {
                                            sportDataTemporary[sport][dayIndex] = "Còn trống"; // Nếu chưa đặt gì, set trạng thái còn trống
                                        }
                                    } else {
                                        sportDataTemporary[sport][dayIndex] = "Tạm đóng"; // Nếu sân tạm đóng
                                    }
                                }
                            });

                            // Cập nhật trạng thái cho bookingsOnWeek
                            setBookingsOnWeek(prevBookingsOnWeek => ({
                                ...prevBookingsOnWeek,
                                [time]: sportDataTemporary
                            }));
                        });
                    });
                }

                // Nếu không có booking nào trong ngày này, set trạng thái mặc định
                if (!hasBookingForDay) {
                    Object.entries(bookingsOnWeek).forEach(([time, sportData]) => {
                        const sportDataTemporary = { ...sportData };
                        Object.entries(sportDataTemporary).forEach(([sport, statuses], j) => {
                            if (sportDetails && sport == sportDetails[index].name) {
                                if (sportDetails[index].status == "Hoạt động") {
                                    sportDataTemporary[sport][dayIndex] = "Còn trống";
                                } else {
                                    sportDataTemporary[sport][dayIndex] = "Tạm đóng";
                                }
                            }
                        });

                        setBookingsOnWeek(prevBookingsOnWeek => ({
                            ...prevBookingsOnWeek,
                            [time]: sportDataTemporary
                        }));
                    });
                }
            }
        }
    }






    // LOAD TABLE
    const renderTableRows = () => {
        return Object.entries(bookingsOnDay).map(([time, statuses]) => (
            <tr key={time}>
                <td className="title" style={{ textAlign: 'center' }}>{time}</td>
                {statuses.map((status, index) => (
                    <td key={index} className={`w-10 ${getBadgeClass(status)}`}>
                        <span onClick={() => setShowBookingModal(true)} className={`badge ${getBadgeClass(status)}`} style={{ width: '80px' }}>{status}</span>
                    </td>
                ))}
            </tr>
        ));
    };



    useEffect(() => {
        console.log("bookingsOnWeek đã được cập nhật:", bookingsOnWeek);
    }, [bookingsOnWeek])
    const renderTableRowsByWeek = () => {
        return (
            <Table bordered>
                <thead className="tb-head">
                    <tr>
                        <th>Thời gian</th>
                        <th>Sân</th>
                        {days?.map((day, index) => (
                            <th key={index}>{day}</th> // Thêm key cho mỗi phần tử
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(bookingsOnWeek).map(([time, sportData]) => {
                        if (dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails) {
                            const sportFielDetails = dataSport[selectSport].sportFielDetails;
                            const rowSpan = sportFielDetails.length;

                            return sportFielDetails.map((item, index) => (
                                <tr key={`${time}-${item.sportFielDetailId}`} style={{ border: '1px solid #a1a1a1' }}>
                                    {/* Hiển thị ô time chỉ ở hàng đầu tiên */}
                                    {index === 0 && (
                                        <td className="title" style={{ textAlign: 'center' }} rowSpan={rowSpan}>
                                            {time}
                                        </td>
                                    )}
                                    <td>{item.name}</td>
                                    {Object.entries(sportData).map(([sport, status], i) => (
                                        status.map((statusItem, j) => { // Đổi tên `status` thành `statusItem` để tránh nhầm lẫn
                                            if (sport == item.name) {
                                                return ( // Thêm return
                                                    <td key={`${sport}-${j}`} className={`w-10 ${getBadgeClass(statusItem)}`}>
                                                        <span
                                                            onClick={() => setShowBookingModal(true)}
                                                            className={`badge ${getBadgeClass(statusItem)}`}
                                                        >
                                                            {statusItem}
                                                        </span>
                                                    </td>
                                                );
                                            }
                                        })
                                    ))}
                                </tr>
                            ));
                        }
                        return null;
                    })}
                </tbody>
            </Table>
        );
    };


    const getBadgeClass = (status: string) => {
        switch (status) {
            case "Đã đặt":
                return "text-bg-warning";
            case "Còn trống":
                return "text-bg-primary";
            case "Tạm đóng":
                return "text-bg-danger";
            default:
                return "";
        }
    };
    const clearData = () => {
        setDataTimeSport([]);
        setBookingsOnDay({});
    }

    if (isLoading) {
        return (
            <h2>Data is comming</h2>
        )
    }

    return (
        <>
            {/* <button onClick={() => setStatus(targetTimes)
            }></button >
            {selectDate} - {selectSport} - {selectTime} */}
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}> LỊCH ĐẶT SÂN</h3>
            <div className="input-group my-2">
                <select value={selectDate} onChange={(e) => setSelectDate(Number(e.target.value))}
                    className="form-select" aria-label="Default select example">
                    <option value="0">Một ngày</option>
                    <option value="1">Một tuần</option>
                </select>
                <input type="time" className="form-control" value={selectTime}
                    onChange={(e) => setSelectTime(e.target.value)} />
                <select value={selectSport} onChange={(e) => {
                    setSelectSport(Number(e.target.value));
                    clearData();
                }} className="form-select" aria-label="Default select example">
                    {dataSport && dataSport.length > 0 && dataSport.map((item, index) => (
                        <option key={item.sportFieldId} value={index}>{item.name}</option>
                    ))}
                </select>
            </div>
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
            <BookingModal showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal}></BookingModal>
        </>
    );
}
