'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import '../types/user.scss';
import { Badge, Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Bookings = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/booking/${parsedUserData.username}`);
        }
    }, []);

    const { data, error, isLoading } = useSWR(usernameFetchApi ? usernameFetchApi : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [bookingUser, setBookingUser] = useState<Booking[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (data) {
            setBookingUser(data);
        }
    }, [data]);

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Danh sách đặt sân</b>
            <div className="my-3">
                <Row className="d-flex justify-content-between align-items-center">
                    <Col xs={12} md={4}>
                        <Form.Control className="input-search-user" type="text" placeholder="Tìm theo tên sân" />
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="search-date">
                            <DatePicker
                                selected={startDate || undefined}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate || undefined}
                                endDate={endDate || undefined}
                                placeholderText="Từ ngày"
                                className="form-control start"
                            />
                            <InputGroup.Text><i className="bi bi-three-dots"></i></InputGroup.Text>
                            <DatePicker
                                selected={endDate || undefined}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate || undefined}
                                endDate={endDate || undefined}
                                minDate={startDate || undefined}
                                placeholderText="Đến ngày"
                                className="form-control end"
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Select>
                            <option>-- Trạng thái --</option>
                            <option value="Xác nhận">Xác nhận</option>
                            <option value="Đã hủy">Đã hủy</option>
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={12} className="mt-2">
                        <Button variant="danger" style={{ width: '100%' }} type="submit">
                            <i className="bi bi-search"></i> Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th>Mã đặt sân</th>
                            <th>Ngày</th>
                            <th>Tình trạng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingUser.length > 0 ? (
                            bookingUser.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td className="ps-3 text-start">
                                        <Link href={`/user/bookings/detail/${booking.bookingId}`}>
                                            #{booking.bookingId}
                                        </Link>
                                    </td>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>
                                        <Badge bg={booking.status === 'Xác nhận' ? 'success' : booking.status === 'Chờ xác nhận' ? 'badge-user' : 'danger'}>
                                            {booking.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Link href={`/user/bookings/detail/${booking.bookingId}`}>
                                            Xem
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">Không có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </UserLayout>
    )
}

export default Bookings;