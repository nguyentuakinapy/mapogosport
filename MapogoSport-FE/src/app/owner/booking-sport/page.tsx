'use client';
import BookingModal from "@/components/Owner/modal/booking.modal";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

type BookingsType = {
    [key: string]: string[];
};

export default function BookingSport() {
    const [bookings, setBookings] = useState<BookingsType>({
        "6h00": ["Đã đặt", "Tạm đóng"]
    });
    const [selectTime, setSelectTime] = useState('');
    const [selectDate, setSelectDate] = useState('');
    const [selectSport, setSelectSport] = useState('');

    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

    let isUpdating = false;

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

    const addNew = () => {
        checkAndAddStatus("09h00", "Tạm đóng");
    }

    const renderTableRows = () => {
        return Object.entries(bookings).map(([time, statuses]) => (
            <tr key={time}>
                <td className="title" style={{ textAlign: 'center' }}>{time}</td>
                {statuses.map((status, index) => (
                    <td key={index} className={`w-10`}>
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

    return (
        <>
            <button onClick={() => addNew()} className="btn btn-success">Đặt sân 06h00</button>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>LỊCH ĐẶT SÂN</h3>
            <div className="input-group my-2">
                <select defaultValue={selectDate} onChange={(e) => setSelectDate(e.target.value)}
                    className="form-select" aria-label="Default select example">
                    <option value="Một ngày">Một ngày</option>
                    <option value="Một tuần">Một tuần</option>
                </select>
                <input type="time" className="form-control" value={selectTime}
                    onChange={(e) => setSelectTime(e.target.value)} />
                <select defaultValue={selectSport} onChange={(e) => setSelectSport(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value="Sân 1">Sân 1</option>
                    <option value="Sân 2">Sân 2</option>
                    <option value="Sân3">Sân 3</option>
                </select>
            </div>
            <div className="div-tb">
                <Table >
                    <thead className="tb-head">
                        <tr>
                            <th>Thời gian</th>
                            <th>Sân 1</th>
                            <th>Sân 2</th>
                            <th>Sân 3</th>
                            <th>Sân 4</th>
                            <th>Sân 5</th>
                            <th>Sân 6</th>
                            <th>Sân 7</th>
                            <th>Sân 8</th>
                            <th>Sân 9</th>
                            <th>Sân 10</th>
                            <th>Sân 11</th>
                            <th>Sân 12</th>
                            <th>Sân 13</th>
                            <th>Sân 14</th>
                            <th>Sân 15</th>
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
