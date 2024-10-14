'use client';
import BookingModal from "@/components/Owner/modal/booking.modal";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR from "swr";

type BookingsType = {
    [key: string]: string[];
};

export default function BookingSport() {
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

    const [bookings, setBookings] = useState<BookingsType>({
        // "6h00": ["Đã đặt", "Tạm đóng", "Còn trống"],
        // "6h10": ["Đã đặt", "Tạm đóng"]

    });
    const [selectTime, setSelectTime] = useState('');
    const [selectDate, setSelectDate] = useState("0");
    const [selectSport, setSelectSport] = useState<number>(0);

    const [dataSport, setDataSport] = useState<SportField[]>([])

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/sport_field_by_owner/1`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        console.log(data);
        setDataSport(data);
    }, [data])

    useEffect(() => {
        console.log(dataSport);
        getTime();
    }, [dataSport])

    const checkAndAddStatus = (time: string, newStatus: string) => {
        let checkAdd = true;
        // alert('Check checkAndAddStatus')

        setBookings((prevBookings) => {
            if (checkAdd) {
                const updatedBookings = { ...prevBookings };
                if (!updatedBookings[time]) {
                    updatedBookings[time] = [];
                }
                updatedBookings[time].push(newStatus);
                // alert('Check setBookings')
                checkAdd = false;
                return updatedBookings;
            } else {
                const updatedBookings = { ...prevBookings };
                return updatedBookings;
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
            const newBookings = { ...bookings };

            const validTimes = dataTimeSport.filter(time => time !== "undefinedh00" && time !== null);

            validTimes.forEach((time) => {
                if (!newBookings[time]) {
                    newBookings[time] = [];
                    // console.log(newBookings[time]);
                }
            });
            setBookings(newBookings); // Cập nhật state bookings
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

    useEffect(() => {
        const today = new Date(); // Ngày hiện tại
        const days = [];
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

        setDays(days);
    }, [])
    // SET STATUS
    const targetTimes = ["5h00", "6h00", "6h30", "7h00", "7h30", "8h00"];
    const targetSport = ["Sân 1", "Sân 2", "Sân 3", "Sân 4", "Sân 5", "Sân 6"];

    const [checkDataBooking, setCheckDataBooking] = useState<boolean>(false);
    const [checkDataBooking1, setCheckDataBooking1] = useState<boolean>(false);

    useEffect(() => {
        console.log("Bookings đã được cập nhật:", bookings);
        for (let index = 0; index < 1; index++) {
            setCheckDataBooking(!checkDataBooking);
        }
    }, [checkDataBooking1]);

    useEffect(() => {
        const i = Number(dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails.length);

        const sportDetails = dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails;
        console.log("Booking ", bookings);
        // for (let index = 0; index < i; index++) {
        Object.entries(bookings).forEach(([time, statuses]) => {
            console.log(`Thời gian: ${time}, Trạng thái: ${statuses.join(", ")}`);


            for (let index = 0; index < targetSport.length - 1; index++) {
                const nameSport = sportDetails && sportDetails[index].name;
                if (targetSport[index] == nameSport) {
                    const targetIndex = targetTimes.indexOf(time);

                    console.log(nameSport);

                    if (targetTimes[index] == time) {
                        checkAndAddStatus(time, "Đã đặt")
                        console.log("ok ", targetIndex);
                    } else {
                        checkAndAddStatus(time, "Còn trống")
                    }

                }
            }

        })
        // }
        console.log("Ngon" + i);
    }, [checkDataBooking])

    const setStatus = (targetTimes: string[]) => {
        dataSport && dataSport.length > selectSport && dataSport[selectSport].sportFielDetails &&
            dataSport[selectSport].sportFielDetails.map(sportDetail => {
                Object.entries(bookings).map(([time, statuses]) => {
                    const targetIndex = targetTimes.indexOf(time);
                    if (targetIndex !== -1) {
                        checkAndAddStatus(time, "Còn trống")
                    }
                })
            })
    }

    // LOAD TABLE
    const renderTableRows = () => {
        return Object.entries(bookings).map(([time, statuses]) => (
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

    const renderTableRowsByWeek = () => {
        return Object.entries(bookings).map(([time, statuses]) => {
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
                        {statuses.map((status, i) => (
                            <td key={i} className={`w-10 ${getBadgeClass(status)}`}>
                                <span
                                    onClick={() => setShowBookingModal(true)}
                                    className={`badge ${getBadgeClass(status)}`}
                                >
                                    {status}
                                </span>
                            </td>
                        ))}
                    </tr>
                ));
            }
            return null;
        });
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
        setBookings({});
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
                <select defaultValue={selectDate} onChange={(e) => setSelectDate(e.target.value)}
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
            {selectDate == "0" ?
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
                    <Table bordered>
                        <thead className="tb-head">
                            <tr>
                                <th>Thời gian</th>
                                <th>Sân</th>
                                {days?.map(day => (
                                    <th>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRowsByWeek()}
                        </tbody>
                    </Table>
                </div>
            }
            <BookingModal showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal}></BookingModal>
        </>
    );
}
