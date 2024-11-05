'use client';
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Badge, Button, Col, Form, InputGroup, Pagination, Row, Table } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import '../types/user.scss';
import useSWR, { mutate } from "swr";

const Orders = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');
    const [orderUsers, setOrderUsers] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/order/${parsedUserData.username}`);
        }
    }, []);

    const { data, error, isLoading } = useSWR(usernameFetchApi ? usernameFetchApi : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setOrderUsers(data);
            setFilteredOrders(data);
        }
    }, [data]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Chờ thanh toán': return 'warning';
            case 'Đang xử lí': return 'info';
            case 'Đang vận chuyển': return 'primary';
            case 'Đã hủy': return 'danger';
            case 'Đã hoàn thành': return 'success';
            default: return 'secondary';
        }
    };

    const handleViewDetail = (order: Order) => {
        sessionStorage.setItem('selectedOrder', JSON.stringify(order));
    };

    const handleFilter = () => {
        let filtered = orderUsers;
        if (startDate) {
            filtered = filtered.filter(order => new Date(order.date) >= startDate);
        };
        if (endDate) {
            filtered = filtered.filter(order => new Date(order.date) <= endDate);
        };
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        };

        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        let filtered = orderUsers;
        setFilteredOrders(filtered);
        setCurrentPage(1);
        setStartDate(null);
        setEndDate(null);
        setStatusFilter("");
    };


    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const renderPagination = () => {
        if (filteredOrders.length === 0) return null;

        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Quản lý đơn hàng</b>
            <div className="my-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex" style={{ width: '30%' }}>
                        <InputGroup className="search-date">
                            <DatePicker selected={startDate || null} onChange={(date) => setStartDate(date)}
                                selectsStart startDate={startDate || undefined} endDate={endDate || undefined}
                                placeholderText="Từ ngày" className="form-control start" dateFormat="dd/MM/yyyy"
                            />
                            <InputGroup.Text><i className="bi bi-three-dots"></i></InputGroup.Text>
                            <DatePicker selected={endDate || null} onChange={(date) => setEndDate(date)}
                                selectsEnd startDate={startDate || undefined} endDate={endDate || undefined}
                                minDate={startDate || undefined} placeholderText="Đến ngày" className="form-control end"
                                dateFormat="dd/MM/yyyy"
                            />
                        </InputGroup>
                    </div>
                    <div className="d-flex" style={{ width: '30%' }}>
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">-- Trạng thái --</option>
                            <option value="Chờ thanh toán">Chờ thanh toán</option>
                            <option value="Đang xử lí">Đang xử lí</option>
                            <option value="Đang vận chuyển">Đang vận chuyển</option>
                            <option value="Đã hủy">Đã hủy</option>
                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                        </Form.Select>
                    </div>
                    <div className="d-flex justify-content-between" style={{ width: '30%' }}>
                        <Button variant="danger" style={{ width: '48%' }} onClick={handleFilter}>
                            <i className="bi bi-search"></i> Tìm kiếm
                        </Button>
                        <Button variant="secondary" style={{ width: '48%' }} onClick={handleRefresh}>
                            <i className="bi bi-arrow-clockwise"></i> Làm mới
                        </Button>
                    </div>
                </div>
            </div>
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: '150px' }}>Mã đơn hàng</th>
                            <th>Ngày</th>
                            <th>Tình trạng</th>
                            <th>Tổng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((order) => (
                                    <tr key={order.orderId}>
                                        <td className="ps-3 text-start">
                                            <Link href={`/user/orders/detail/${order.orderId}`} onClick={() => handleViewDetail(order)}>#{order.orderId}</Link>
                                        </td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>
                                            <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
                                        </td>
                                        <td>{order.amount.toLocaleString()} ₫</td>
                                        <td>
                                            <Link href={`/user/orders/detail/${order.orderId}`} onClick={() => handleViewDetail(order)}>
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
            {renderPagination()}
        </UserLayout>
    );
}

export default Orders;
