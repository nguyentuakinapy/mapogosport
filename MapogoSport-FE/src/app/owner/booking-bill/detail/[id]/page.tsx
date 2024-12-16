'use client';
import CancelBookingDetailModal from "@/components/Owner/modal/booking.cancelBookingDetail";
import { useEffect, useState } from "react";
import { Dropdown, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

const BookingsDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [bookingDetail, setBookingDetail] = useState<BookingDetailMap[]>([]);
    const [bookingInfo, setBookingInfo] = useState<BookingMap>();
    const [showCancelBooking, setShowCancelBooking] = useState(false);
    const [aBookingDetail, setABookingDetail] = useState<BookingDetailMap | null>(null);
    const [booking, setBooking] = useState<BookingMap>();

    const { data, isLoading, error } = useSWR(`${BASE_URL}rest/user/booking/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.bookingDetails.sort((a: BookingDetailMap, b: BookingDetailMap) =>
                new Date(a.date).getTime() - new Date(b.date).getTime());
            setBookingDetail(sortedData);
            setBookingInfo(data.booking);
        }
    }, [data]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Đã hoàn thành': return 'success';
            case 'Chưa bắt đầu': return 'info';
            case 'Đã hủy': return 'danger';
            default: return 'secondary';
        }
    };

    const bookingStatuses = [
        'Đã hủy'
    ];

    const canChangeStatus = (date: string, startTime: string, currentStatus: string, targetStatus: string, statusBooking: string) => {
        const currentDateTime = new Date();
        const formattedTime = startTime.replace('h', ':').padStart(5, '0');
        const bookingDateTime = new Date(`${date}T${formattedTime}:00`);
        const diffMinutes = (currentDateTime.getTime() - bookingDateTime.getTime()) / (1000 * 60);

        if (diffMinutes < 0 && currentStatus === "Chưa bắt đầu") {
            return true;
        }

        if (diffMinutes >= 0 && targetStatus === "Đã hủy" && statusBooking === "Chờ thanh toán" && currentStatus != "Đã hoàn thành") {
            return true;
        }

        return false;
    };

    const handleStatusChange = async (bookingDetailId: number, newStatus: string) => {
        const detail = bookingDetail.find(item => item.bookingDetailId === bookingDetailId)
        if (bookingInfo && detail && newStatus === "Đã hủy") {
            setABookingDetail(detail);
            setShowCancelBooking(true);
            setBooking(bookingInfo);
        } else {
            await fetch(`${BASE_URL}rest/owner/bookingDetail/update`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingDetailId, status: newStatus, refundAmount: 0 }),
            }).then((res) => {
                if (!res.ok) {
                    toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                    return;
                }
                mutate(`${BASE_URL}rest/user/booking/detail/${params.id}`);
                toast.success('Cập nhật thành công!');
            });
        }
    };

    if (isLoading) return <div style={{ height: 'calc(100vh - 160px)' }} className="d-flex align-items-center justify-content-center">
        <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <>
            <b className='text-danger' style={{ fontSize: '20px' }}>Thông tin người đặt</b>
            <Table className="my-3">
                <thead>
                    <tr>
                        <th className="text-secondary">Mã hóa đơn</th>
                        <th className="text-secondary">Tên sân</th>
                        <th className="text-secondary">Họ và tên</th>
                        <th className="text-secondary">Ngày đặt</th>
                        <th className="text-secondary">Số điện thoại</th>
                        <th className="text-secondary">Phương thức thanh toán</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>#{bookingInfo?.bookingId}</b></td>
                        <td>{bookingInfo?.sportFieldName}</td>
                        <td>{bookingInfo?.userFullname}</td>
                        <td>{bookingInfo?.date && new Date(bookingInfo.date).toLocaleDateString('en-GB')}</td>
                        <td>{bookingInfo?.userPhoneNumber || "Chưa cập nhật số điện thoại"}</td>
                        <td>{bookingInfo?.paymentMethodName}</td>
                    </tr>
                </tbody>
            </Table>
            <b className='text-danger' style={{ fontSize: '20px' }}>Chi tiết đặt sân</b>
            <div style={{ fontSize: '15px' }}>
                <Table className="my-3">
                    <thead>
                        <tr>
                            <th className="text-secondary">Ngày đá</th>
                            <th className="text-secondary">Sân</th>
                            <th className="text-secondary">Thời gian</th>
                            <th className="text-secondary">Giá</th>
                            <th className="text-secondary">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingDetail.map((booking) => {
                            const isDropdownDisabled = !bookingStatuses.some(status => canChangeStatus(booking.date, booking.startTime,
                                booking.status, status, bookingInfo!.statusBooking!));
                            return (
                                <tr key={booking?.bookingDetailId}>
                                    <td>{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                                    <td>{booking.sportFieldDetailName}</td>
                                    <td>{booking.startTime} - {booking?.endTime}</td>
                                    <td>{booking.price.toLocaleString()} ₫</td>
                                    <td>
                                        <Dropdown onSelect={(newStatus) => {
                                            if (canChangeStatus(booking.date, booking.startTime, booking.status,
                                                newStatus || booking.status, bookingInfo!.statusBooking!)) {
                                                handleStatusChange(booking.bookingDetailId, newStatus || booking.status);
                                            }
                                        }}>
                                            <Dropdown.Toggle disabled={isDropdownDisabled} variant={getStatusVariant(booking.status)}>
                                                {booking.status}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {bookingStatuses.filter((status) => canChangeStatus(booking.date, booking.startTime,
                                                    booking.status, status, bookingInfo!.statusBooking!))
                                                    .map((status) => (
                                                        <Dropdown.Item key={status} eventKey={status}>{status}</Dropdown.Item>
                                                    ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <CancelBookingDetailModal showCancelBooking={showCancelBooking} setShowCancelBooking={setShowCancelBooking}
                aBookingDetail={aBookingDetail} booking={booking} />
        </>
    );
};

export default BookingsDetail;
