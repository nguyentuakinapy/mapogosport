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
    const [selectDate, setSelectDate] = useState('');
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
            <button onClick={() => checkAndAddStatus("8h00", "Tạm đóng")
            }></button >
            {selectDate} - {selectSport} - {selectTime}
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}> LỊCH ĐẶT SÂN</h3>
            <div className="input-group my-2">
                <select defaultValue={selectDate} onChange={(e) => setSelectDate(e.target.value)}
                    className="form-select" aria-label="Default select example">
                    <option value="Một ngày">Một ngày</option>
                    <option value="Một tuần">Một tuần</option>
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
            <BookingModal showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal}></BookingModal>
        </>
    );
}
