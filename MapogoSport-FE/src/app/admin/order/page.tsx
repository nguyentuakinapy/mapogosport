'use client'
import Link from "next/link";
import { Form, Button, Table, Nav, Pagination, Dropdown, InputGroup } from "react-bootstrap";
import '../adminStyle.scss';
import { Suspense, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { RobotoBase64 } from '../../../../public/font/Roboto-Regular';
import { toast } from "react-toastify";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import autoTable from "jspdf-autotable";

const AdminOrder = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [orderData, setOrderData] = useState<OrderMap[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const orderStatuses = [
        'Chờ xác nhận',
        'Đang vận chuyển',
        'Đã hủy',
        'Đã hoàn thành'
    ];

    const { data, error, isLoading } = useSWR(`${BASE_URL}rest/admin/order/findAll`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: OrderMap, b: OrderMap) => b.orderId - a.orderId);
            setOrderData(sortedData);
        }
    }, [data]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Chờ xác nhận': return 'info';
            case 'Đang vận chuyển': return 'primary';
            case 'Đã hủy': return 'danger';
            case 'Đã hoàn thành': return 'success';
            default: return 'secondary';
        }
    };

    const handleStatusChange = (orderId: number, newStatus: string) => {
        fetch(`${BASE_URL}rest/admin/order/update`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, status: newStatus }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return;
            }
            mutate(`${BASE_URL}rest/admin/order/findAll`);
            toast.success('Cập nhật thành công!');
        });
    };

    const renderStatusDropdown = (order: OrderMap) => {
        return (
            <Dropdown onSelect={(newStatus) => handleStatusChange(order.orderId, newStatus || order.status)}>
                <Dropdown.Toggle disabled={order.status == 'Đã hủy'} variant={getStatusVariant(order.status)}>{order.status}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {orderStatuses.map((status) => (
                        <Dropdown.Item key={status} eventKey={status}>
                            {status}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    const renderTable = (filteredOrders: OrderMap[]) => {
        return (
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>Mã hóa đơn</th>
                            <th style={{ width: '250px' }}>Họ và tên</th>
                            <th>Ngày mua</th>
                            <th>Tổng tiền</th>
                            <th style={{ width: '300px' }}>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ?
                            filteredOrders.map(order => (
                                <tr key={order.orderId}>
                                    <td className="text-start">
                                        <Link href={`/admin/order/${order.orderId}`}>#{order.orderId}</Link>
                                    </td>
                                    <td className="text-start title">{order.fullname}</td>
                                    <td>{new Date(order.date).toLocaleDateString('en-GB')}</td>
                                    <td>{`${order.amount.toLocaleString()} ₫`}</td>
                                    <td className="title-brand">{order.address}</td>
                                    <td>{renderStatusDropdown(order)}</td>
                                    <td>
                                        <Link href={`/admin/order/${order.orderId}`}>Xem</Link>
                                    </td>
                                </tr>
                            )) :
                            <tr>
                                <td colSpan={7} className="text-center">Không có dữ liệu về trạng thái này!</td>
                            </tr>}
                    </tbody>
                </Table>
            </div>
        );
    };

    const filteredOrders = orderData.filter(order => {
        return (
            order.fullname.toLowerCase().includes(searchTerm) ||
            order.address.toLowerCase().includes(searchTerm) ||
            order.orderId.toString().includes(searchTerm)
        )
    }).filter(order => {
        switch (activeTab) {
            case 'processing': return order.status === "Chờ xác nhận";
            case 'shipping': return order.status === "Đang vận chuyển";
            case 'cancel': return order.status === "Đã hủy";
            case 'complete': return order.status === "Đã hoàn thành";
            default: return true;
        }
    }).filter(booking => {
        if (startDate && endDate) {
            const bookingDate = new Date(booking.date);
            return bookingDate >= startDate && bookingDate <= endDate;
        }
        return true;
    });

    const renderContent = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
        return renderTable(currentItems);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(orderData.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
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

    const exportPDF = () => {
        try {
            const doc: jsPDF = new jsPDF();

            doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");

            doc.text("Danh Sách Hóa Đơn", 14, 16);

            const tableColumn = ["STT", "Họ và tên", "Ngày mua", "Tổng tiền", "Địa chỉ", "Trạng thái"];
            const tableRows: string[][] = [];

            filteredOrders.forEach((order, index) => {
                const orderData = [
                    `#${index + 1}`,
                    order.fullname,
                    new Date(order.date).toLocaleDateString('en-GB'),
                    `${order.amount.toLocaleString()} ₫`,
                    order.address,
                    order.status
                ];
                tableRows.push(orderData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: 'grid',
                styles: {
                    font: 'Roboto',
                    fontSize: 10,
                    cellPadding: 2,
                    valign: 'middle',
                },
                columnStyles: {
                    0: { halign: 'left' },
                    1: { halign: 'left' },
                    2: { halign: 'center' },
                    3: { halign: 'right', cellWidth: 30 },
                    4: { halign: 'left' },
                    5: { halign: 'center' },
                },
                didParseCell: (data) => {
                    if (data.cell.text.length > 0) {
                        data.cell.text[0] = data.cell.text[0];
                    }
                }
            });
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day;

            doc.save(`HoaDonDatHang-Mapogo(${formattedDay}/${formattedMonth}).pdf`);
            toast.success("Đã xuất file PDF thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình xuất file! Vui lòng thử lại sau!");
        }

    };

    const exportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Hóa Đơn');

            worksheet.columns = [
                { header: 'STT', key: 'orderId', width: 15 },
                { header: 'Họ và tên', key: 'fullname', width: 25 },
                { header: 'Ngày mua', key: 'date', width: 15 },
                { header: 'Tổng tiền', key: 'amount', width: 15, style: { numFmt: '#,##0 ₫' } },
                { header: 'Địa chỉ', key: 'address', width: 60 },
                { header: 'Trạng thái', key: 'status', width: 15 },
            ];

            filteredOrders.forEach((order, index) => {
                worksheet.addRow({
                    orderId: `#${index + 1}`,
                    fullname: order.fullname,
                    date: new Date(order.date).toLocaleDateString('en-GB'),
                    amount: order.amount,
                    address: order.address,
                    status: order.status
                });
            });

            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day;

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `HoaDonDatHang-Mapogo(${formattedDay}/${formattedMonth}).xlsx`);
            toast.success('Đã xuất file Excel thành công!');
        } catch (error) {
            toast.error('Xuất file Excel không thành công! Vui lòng thử lại sau!');
        }
    };


    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <div style={{ fontSize: '14px' }}>
                <div className="box-ultil">
                    <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Hóa Đơn</b>
                    <div>
                        <Form.Control type="text" placeholder="Tìm theo tên và địa chỉ..." onChange={handleSearch} />
                    </div>
                    <div>
                        <InputGroup className="search-date-booking">
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
                    </div>
                    <div>
                        <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={exportPDF}>Xuất File PDF</Button>
                        <Button className="btn-sd-admin ms-2" style={{ fontSize: '15px' }} onClick={exportExcel}>Xuất File Excel</Button>
                    </div>
                </div>
                <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                    <Nav.Item>
                        <Nav.Link eventKey="all" className="tab-link" onClick={() => setCurrentPage(1)}>Toàn bộ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="processing" className="tab-link" onClick={() => setCurrentPage(1)}>Chờ xác nhận</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="shipping" className="tab-link" onClick={() => setCurrentPage(1)}>Đang vận chuyển</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="complete" className="tab-link" onClick={() => setCurrentPage(1)}>Đã hoàn thành</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="cancel" className="tab-link" onClick={() => setCurrentPage(1)}>Đã hủy</Nav.Link>
                    </Nav.Item>
                </Nav>
                {renderContent()}
                {renderPagination()}
            </div>
        </Suspense>
    );
};

export default AdminOrder;
