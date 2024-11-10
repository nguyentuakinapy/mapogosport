'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import '../types/user.scss';
import { Badge, Button, Col, Form, InputGroup, Pagination, Row, Table } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Bookings = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [bookingUser, setBookingUser] = useState<BookingByUserMap[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [filteredBookings, setFilteredBookings] = useState<BookingByUserMap[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const username = localStorage.getItem('username');

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/user/booking/${username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setBookingUser(sortedData);
            setFilteredBookings(sortedData);
        }
    }, [data]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Đã thanh toán': return 'success';
            case 'Chờ thanh toán': return 'info';
            case 'Đã hủy': return 'danger';
            default: return 'secondary';
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const renderPagination = () => {
        if (filteredBookings.length === 0) return null;

        const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
            );
        }

        return (
            <Pagination>
                <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

    const handleFilter = () => {
        let filtered = bookingUser;
        if (startDate) {
            filtered = filtered.filter(booking => new Date(booking.date) >= startDate);
        };
        if (endDate) {
            filtered = filtered.filter(booking => new Date(booking.date) <= endDate);
        };
        if (statusFilter && statusFilter !== "") {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        };
        if (nameFilter) {
            filtered = filtered.filter(booking => booking.sportFieldName.toLowerCase().includes(nameFilter.toLowerCase()));
        };

        setFilteredBookings(filtered);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        let filtered = bookingUser;
        setFilteredBookings(filtered);
        setCurrentPage(1);
        setStartDate(null);
        setEndDate(null);
        setStatusFilter("");
        setNameFilter("");
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Danh sách đặt sân</b>
            <div className="my-3">
                <Row className="d-flex justify-content-between align-items-center">
                    <Col xs={12} md={4}>
                        <Form.Control value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="input-search-user" type="text" placeholder="Tìm theo tên sân" />
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="search-date">
                            <DatePicker selected={startDate || undefined} onChange={(date) => setStartDate(date)}
                                selectsStart startDate={startDate || undefined} endDate={endDate || undefined}
                                placeholderText="Từ ngày" className="form-control start" dateFormat="dd/MM/yyyy"
                            />
                            <InputGroup.Text><i className="bi bi-three-dots"></i></InputGroup.Text>
                            <DatePicker selected={endDate || undefined} onChange={(date) => setEndDate(date)}
                                selectsEnd startDate={startDate || undefined} endDate={endDate || undefined}
                                minDate={startDate || undefined} placeholderText="Đến ngày" className="form-control end"
                                dateFormat="dd/MM/yyyy"
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">-- Trạng thái --</option>
                            <option value="Đã thanh toán">Đã thanh toán</option>
                            <option value="Đã hủy">Đã hủy</option>
                            <option value="Chờ thanh toán">Chờ thanh toán</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={12} className="mt-2">
                        <Button variant="danger" style={{ width: '87%', marginRight: '9.4px' }} onClick={handleFilter}>
                            <i className="bi bi-search"></i> Tìm kiếm
                        </Button>
                        <Button variant="secondary" style={{ width: '12%', padding: '6px' }} onClick={handleRefresh}>
                            <i className="bi bi-arrow-clockwise"></i> Làm mới
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>Mã đặt sân</th>
                            <th style={{ width: '240px' }}>Tên sân</th>
                            <th style={{ width: '100px' }}>Ngày đặt</th>
                            <th style={{ width: '240px' }}>Tổng tiền</th>
                            <th style={{ width: '120px' }}>Tình trạng</th>
                            <th style={{ width: '100px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td className="ps-3 text-start">
                                        <Link href={`/user/bookings/detail/${booking.bookingId}`}>
                                            #{booking.bookingId}
                                        </Link>
                                    </td>
                                    <td className="title text-start">{booking.sportFieldName}</td>
                                    <td>{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                                    <td>{booking.totalAmount.toLocaleString()} đ</td>
                                    <td>
                                        <Badge bg={getStatusVariant(booking.status)}>
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
                                <td colSpan={6} className="text-center">Không có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {renderPagination()}
        </UserLayout>
    )
}

export default Bookings;