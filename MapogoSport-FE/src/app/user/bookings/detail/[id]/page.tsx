'use client';
import UserLayout from "@/components/User/UserLayout";
import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import '../../../types/user.scss';
import useSWR from "swr";
import MapComponent from "../../../../utils/MapComponent";
import { fetchCoordinates } from "../../../../utils/geocode";
import Loading from "@/components/loading";

const BookingsDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [bookingDetail, setBookingDetail] = useState<BookingDetailMap[]>([]);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    const { data, isLoading, error } = useSWR<BookingDetailMap[]>(`${BASE_URL}rest/user/booking/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: BookingDetailMap, b: BookingDetailMap) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setBookingDetail(sortedData);
            const address = data[0].address;
            if (address) {
                fetchCoordinates(address).then((coords) => {
                    if (coords) setCoordinates(coords);
                });
            }
        }
    }, [data]);

    if (isLoading) return <UserLayout><div className="d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
        <Loading></Loading>
    </div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Chi tiết đặt sân</b>
            <div style={{ fontSize: '15px' }}>
                <Row className="my-3 booking-container">
                    <Col className="bill-booking" xs={7}>
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
                                {bookingDetail.map((booking) => (
                                    <tr key={booking?.bookingDetailId}>
                                        <td>{new Date(booking?.date).toLocaleDateString('en-GB')}</td>
                                        <td>{booking?.sportFieldDetailName}</td>
                                        <td>{booking?.startTime} - {booking?.endTime}</td>
                                        <td>{booking?.price.toLocaleString()} ₫</td>
                                        <td>{booking.status}</td>
                                    </tr>
                                ))}
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
                    </Col>
                    <Col xs={5}>
                        <div className="map-container">
                            <div className="note-map">Nhấn vào bản đồ để xem đường đi đến sân</div>
                            {coordinates && <MapComponent coordinates={coordinates} />}
                        </div>
                    </Col>
                </Row>
            </div>
        </UserLayout>
    );
};

export default BookingsDetail;
