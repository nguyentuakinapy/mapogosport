'use client';
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Badge, Button, Col, Form, InputGroup, Pagination, Row, Table } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { Suspense, useEffect, useState } from "react";
import '../types/user.scss';
import useSWR from "swr";
import { useData } from "@/app/context/UserContext";

const Orders = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [orderUsers, setOrderUsers] = useState<OrderMap[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderMap[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const user = useData();

    const { data, error, isLoading } = useSWR(`${BASE_URL}rest/user/order/${user?.username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: OrderMap, b: OrderMap) => b.orderId - a.orderId);
            setOrderUsers(sortedData);
            setFilteredOrders(sortedData);
        }
    }, [data]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Chờ xác nhận': return 'info';
            case 'Đang vận chuyển': return 'primary';
            case 'Đã hủy': return 'danger';
            case 'Đã hoàn thành': return 'success';
            default: return 'secondary';
        }
    };

    const handleFilter = () => {
        let filtered = orderUsers;
        if (startDate) {
            filtered = filtered.filter(order => new Date(order.date) >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(order => new Date(order.date) <= endDate);
        }
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
        if (nameFilter) {
            filtered = filtered.filter(order => order.productName.toLowerCase().includes(nameFilter.toLowerCase()) ||
                order.orderId.toString().includes(nameFilter)
            );
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setFilteredOrders(orderUsers);
        setCurrentPage(1);
        setStartDate(null);
        setEndDate(null);
        setStatusFilter("");
        setNameFilter("");
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
        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UserLayout>
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản lý đơn hàng</b>
                <div className="my-3">
                    <Row className="d-flex justify-content-between align-items-center">
                        <Col xs={12} md={4}>
                            <Form.Control value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="input-search-user" type="text" placeholder="Tìm theo tên sản phẩm" />
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
                                <option value="Chờ xác nhận">Chờ xác nhận</option>
                                <option value="Đang vận chuyển">Đang vận chuyển</option>
                                <option value="Đã hoàn thành">Đã hoàn thành</option>
                                <option value="Đã hủy">Đã hủy</option>
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
                                <th style={{ width: '140px' }}>Mã hóa đơn</th>
                                <th style={{ width: '300px' }}>Tên sản phẩm</th>
                                <th>Ngày</th>
                                <th>Tình trạng</th>
                                <th>Tổng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((order) => (
                                    <tr key={order.orderId}>
                                        <td className="ps-3 text-start">
                                            <Link href={`/user/orders/detail/${order.orderId}`}>#{order.orderId}</Link>
                                        </td>
                                        <td className="title text-start">{order.productName}</td>
                                        <td>{new Date(order.date).toLocaleDateString('en-GB')}</td>
                                        <td>
                                            <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
                                        </td>
                                        <td>{order.amount.toLocaleString()} ₫</td>
                                        <td>
                                            <Link href={`/user/orders/detail/${order.orderId}`}>Xem</Link>
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
        </Suspense>
    );
}

export default Orders;
