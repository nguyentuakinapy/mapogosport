'use client';
import { useEffect, useState } from "react";
import { Dropdown, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

const BookingsDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [bookingDetail, setBookingDetail] = useState<BookingDetailMap[]>([]);

    const { data, isLoading, error } = useSWR(`http://localhost:8080/rest/user/booking/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: BookingDetailMap, b: BookingDetailMap) =>
                new Date(a.date).getDate() - new Date(b.date).getDate());
            setBookingDetail(sortedData);
        }
    }, [data]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Đã đá': return 'success';
            case 'Chưa đá': return 'info';
            case 'Đã hủy': return 'danger';
            default: return 'secondary';
        }
    };

    const bookingStatuses = [
        'Đã đá',
        'Đã hủy'
    ];

    const canChangeStatus = (date: string, startTime: string, currentStatus: string, targetStatus: string) => {
        const currentDateTime = new Date();
        const formattedTime = startTime.replace('h', ':').padStart(5, '0');
        const bookingDateTime = new Date(`${date}T${formattedTime}:00`);
        const diffMinutes = (currentDateTime.getTime() - bookingDateTime.getTime()) / (1000 * 60);

        if (currentStatus === "Chưa đá" && targetStatus === "Đã hủy") { // Chỉ cho đổi "Chưa đá" sang "Đã hủy"
            return true;
        }
        // Trong vòng 15 phút, cho đổi qua lại giữa "Đã đá" và "Đã hủy"
        if ((currentStatus === "Đã đá" || currentStatus === "Đã hủy") && (targetStatus === "Đã đá" || targetStatus === "Đã hủy")) {
            return diffMinutes >= 0 && diffMinutes <= 15;
        }

        return false;
    };

    const handleStatusChange = (bookingDetailId: number, newStatus: string) => {
        fetch(`http://localhost:8080/rest/owner/bookingDetail/update`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingDetailId, status: newStatus }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return;
            }
            mutate(`http://localhost:8080/rest/user/booking/detail/${params.id}`);
            toast.success('Cập nhật thành công!');
        });
    };

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <>
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
                            const isDropdownDisabled = !bookingStatuses.some(status => canChangeStatus(booking.date, booking.startTime, booking.status, status));
                            return (
                                <tr key={booking?.bookingDetailId}>
                                    <td>{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                                    <td>{booking.sportFieldDetailName}</td>
                                    <td>{booking.startTime} - {booking?.endTime}</td>
                                    <td>{booking.price.toLocaleString()} ₫</td>
                                    <td>
                                        <Dropdown onSelect={(newStatus) => {
                                            if (canChangeStatus(booking.date, booking.startTime, booking.status, newStatus || booking.status)) {
                                                handleStatusChange(booking.bookingDetailId, newStatus || booking.status);
                                            }
                                        }}>
                                            <Dropdown.Toggle disabled={isDropdownDisabled} variant={getStatusVariant(booking.status)}>
                                                {booking.status}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {bookingStatuses.filter((status) => canChangeStatus(booking.date, booking.startTime, booking.status, status))
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
                <div>
                    <div className="text-secondary mb-2 fw-bold">Địa chỉ</div>
                    <b>{bookingDetail[0]?.address}</b>
                    <Table className="my-3">
                        <thead>
                            <tr>
                                <th className="text-secondary">Tên chủ sân</th>
                                <th className="text-secondary">Số điện thoại</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="title">{bookingDetail[0]?.ownerFullname}</td>
                                <td>{bookingDetail[0]?.ownerPhoneNumberUsers || "Chưa cập nhật số điện thoại"}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default BookingsDetail;
