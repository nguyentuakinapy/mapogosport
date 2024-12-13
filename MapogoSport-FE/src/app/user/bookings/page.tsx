'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import '../types/user.scss';
import { Badge, Button, Col, Form, InputGroup, Nav, NavDropdown, OverlayTrigger, Pagination, Row, Table, Tooltip } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { Suspense, useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { useData } from "@/app/context/UserContext";
import { toast } from "react-toastify";
import Loading from "@/components/loading";

const Bookings = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [bookingUser, setBookingUser] = useState<BookingByUserMap[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [filteredBookings, setFilteredBookings] = useState<BookingByUserMap[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const userData = useData();

    const { data, error, isLoading } = useSWR<BookingByUserMap[]>(userData && `${BASE_URL}rest/user/booking/${userData.username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: BookingByUserMap, b: BookingByUserMap) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setBookingUser(sortedData);
            setFilteredBookings(sortedData);
        }
    }, [data]);

    const getStatusVariant = useCallback((status: string) => {
        switch (status) {
            case 'Đã thanh toán': return 'success';
            case 'Chờ thanh toán': return 'info';
            case 'Đã hủy': return 'danger';
            default: return 'secondary';
        }
    }, []);

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
        const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
        const pages = [];

        if (totalPages <= 1) return null;

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
        let filtered = [...bookingUser];
        if (startDate) {
            filtered = filtered.filter(booking => new Date(booking.date) >= startDate);
        };
        if (endDate) {
            filtered = filtered.filter(booking => new Date(booking.date) <= endDate);
        };
        if (statusFilter) {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        };
        if (nameFilter) {
            filtered = filtered.filter(booking =>
                booking.sportFieldName.toLowerCase().includes(nameFilter.toLowerCase()) ||
                booking.bookingId.toString().includes(nameFilter)
            );
        };

        setFilteredBookings(filtered);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setFilteredBookings(bookingUser);
        setCurrentPage(1);
        setStartDate(null);
        setEndDate(null);
        setStatusFilter("");
        setNameFilter("");
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        if (currentItems) {
            currentItems.map((booking) => (
                console.log(booking.bookingDetails)
            ))
        }
    }, [currentItems]);

    const handleStatusChange = (bookingId: number, refundAmount: number) => {
        fetch(`${BASE_URL}rest/owner/booking/update`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingId, status: "Đã hủy", refundAmount: refundAmount }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return;
            }
            mutate(`${BASE_URL}rest/user/booking/${userData?.username}`);
            mutate(`${BASE_URL}rest/user/booking/detail/${bookingId}`);
            toast.success('Cập nhật thành công!');
        });
    };

    if (isLoading) return <UserLayout><div className="d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
        <Loading></Loading>
    </div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UserLayout>
                <div className='title-header' style={{ fontSize: '20px' }}>Danh sách đặt sân</div>
                <div className="my-3">
                    <Row className="d-flex justify-content-between align-items-center">
                        <Col xs={12} md={4}>
                            <Form.Control value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="input-search-user" type="text" placeholder="Tìm kiếm..." />
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
                    <Table striped className="mb-0" style={{ fontSize: '14px' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Mã</th>
                                <th style={{ width: '220px' }}>Tên sân</th>
                                <th style={{ width: '200px' }}>Ngày đặt</th>
                                <th style={{ width: '100px' }}>Tổng tiền</th>
                                <OverlayTrigger overlay={<Tooltip>Hoàn lại/Trả thêm</Tooltip>}>
                                    <th style={{ width: '130px' }}>Hoàn / Thêm</th>
                                </OverlayTrigger>
                                <th style={{ width: '100px' }}>Tình trạng</th>
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
                                        {/* <td>{new Date(booking.date).toLocaleDateString('en-GB')}</td> */}
                                        <td>{new Date(booking.date).toLocaleString('en-GB', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour12: false,
                                            timeZone: 'Asia/Ho_Chi_Minh'  // Múi giờ Việt Nam
                                        })}</td>
                                        <td>{booking.totalAmount.toLocaleString()} ₫</td>
                                        <td className={booking.status === 'Đã thanh toán' && booking.oldTotalAmount !== 0
                                            && booking.oldTotalAmount - booking.totalAmount <= 0 ? 'text-danger' : 'text-success'}>
                                            {booking.status === 'Đã thanh toán' ?
                                                booking.oldTotalAmount !== undefined && booking.oldTotalAmount !== 0 ? (booking.oldTotalAmount - booking.totalAmount).toLocaleString() + ' đ' : "0 đ" :
                                                booking.status === 'Đã hủy' ? 0 :
                                                    (booking.totalAmount - (booking.totalAmount * (booking.percentDeposit / 100))).toLocaleString() + ' đ'}
                                        </td>
                                        <td>
                                            <Badge bg={getStatusVariant(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            {booking.bookingDetails.every(item => item.bookingDetailStatus !== "Đã hủy" && item.bookingDetailStatus !== "Đã hoàn thành") ? (
                                                <Nav>
                                                    <NavDropdown id="nav-dropdown-dark-example" title="Thao tác">
                                                        <Link href={`/user/bookings/detail/${booking.bookingId}`} className="dropdown-item">
                                                            Xem
                                                        </Link>
                                                        <NavDropdown.Item onClick={() => {
                                                            const a = booking.bookingDetails.filter(item => item.bookingDetailStatus != "Chưa bắt đầu");
                                                            const b = booking.bookingDetails.filter(item => item.bookingDetailStatus === "Chưa bắt đầu");
                                                            const subtract = a.reduce((total, item) => total + item.price, 0);
                                                            const currentDateTime = new Date();
                                                            const formattedTime = b[0].startTime.replace('h', ':').padStart(5, '0');
                                                            const bookingDateTime = new Date(`${b[0].bookingDetailDate}T${formattedTime}:00`);
                                                            const diffMinutes = (bookingDateTime.getTime() - currentDateTime.getTime()) / (1000 * 60);
                                                            const refundAmount = (booking.totalAmount * (booking.percentDeposit / 100));
                                                            if (diffMinutes >= 120) {
                                                                if (booking.status === "Chờ thanh toán") {
                                                                    handleStatusChange(booking.bookingId, refundAmount - (subtract * (booking.percentDeposit / 100)));
                                                                } else {
                                                                    handleStatusChange(booking.bookingId, booking.totalAmount - subtract);
                                                                }
                                                            } else {
                                                                if (booking.status === "Chờ thanh toán") {
                                                                    handleStatusChange(booking.bookingId, (refundAmount - (subtract * (booking.percentDeposit / 100))) * 0.75);
                                                                } else {
                                                                    handleStatusChange(booking.bookingId, (booking.totalAmount - subtract) * 0.75);
                                                                }
                                                            }
                                                        }}>Hủy sân</NavDropdown.Item>
                                                    </NavDropdown>
                                                </Nav>
                                            ) : (
                                                <Link href={`/user/bookings/detail/${booking.bookingId}`}>
                                                    Xem
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center">Không có đơn hàng nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                {renderPagination()}
            </UserLayout>
        </Suspense>
    )
}

export default Bookings;