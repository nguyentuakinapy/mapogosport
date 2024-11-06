'use client'
import Link from "next/link";
import { Form, Button, Table, Nav, Pagination, Dropdown } from "react-bootstrap";
import '../owner.scss'
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { RobotoBase64 } from '../../../../public/font/Roboto-Regular';
import { toast } from "react-toastify";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const OwnerBookingBill = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [bookingData, setBookingData] = useState<BookingFindAll[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const orderStatuses = [
        'Chờ thanh toán',
        'Đã thanh toán',
        'Đã hủy'
    ];

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/owner/booking/findAll`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setBookingData(data);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Đã thanh toán': return 'success';
            case 'Chờ thanh toán': return 'info';
            case 'Đã hủy': return 'danger';
            default: return 'secondary';
        }
    };

    const handleStatusChange = (bookingId: number, newStatus: string) => {
        fetch(`http://localhost:8080/rest/owner/booking/update`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingId, status: newStatus }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return;
            }
            mutate(`http://localhost:8080/rest/owner/booking/findAll`);
            toast.success('Cập nhật thành công!');
        });
    };

    const renderStatusDropdown = (booking: BookingFindAll) => {
        return (
            <Dropdown onSelect={(newStatus) => handleStatusChange(booking.bookingId, newStatus || booking.status)}>
                <Dropdown.Toggle variant={getStatusVariant(booking.status)}>{booking.status}</Dropdown.Toggle>
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

    const renderTable = (filteredBookings: BookingFindAll[]) => {
        return (
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>Mã hóa đơn</th>
                            <th style={{ width: '250px' }}>Họ và tên</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Số điện thoại</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ?
                            filteredBookings.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td className="text-start title">
                                            <Link href={`/owner/booking-bill/${booking.bookingId}`}>{`#${booking.bookingId}`}</Link>
                                        </td>
                                        <td>{booking.userFullname}</td>
                                        <td>{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                                        <td>{`${booking.totalAmount.toLocaleString()} ₫`}</td>
                                        <td>{booking.userPhone || 'Chưa cập nhật số điện thoại'}</td>
                                        <td>{renderStatusDropdown(booking)}</td>
                                        <td>
                                            <Link href={`/owner/booking-bill/${booking.bookingId}`}>Xem</Link>
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

    const renderContent = () => {
        let filteredBookings = bookingData;
        switch (activeTab) {
            case 'unpaid':
                filteredBookings = filteredBookings.filter(booking => booking.status === 'Chờ thanh toán');
                break;
            case 'cancel':
                filteredBookings = filteredBookings.filter(booking => booking.status === 'Đã hủy');
                break;
            case 'complete':
                filteredBookings = filteredBookings.filter(booking => booking.status === 'Đã thanh toán');
                break;
            default:
                break;
        }

        filteredBookings = filteredBookings.filter(booking =>
            booking.userFullname.toLowerCase().includes(searchTerm)
        );

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
        return renderTable(currentItems);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(bookingData.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPagination = () => {
        const filteredOrders = bookingData.filter(booking =>
            booking.userFullname.toLowerCase().includes(searchTerm)
        ).filter(booking => {
            switch (activeTab) {
                case 'unpaid': return booking.status === 'Chờ thanh toán';
                case 'cancel': return booking.status === 'Đã hủy';
                case 'complete': return booking.status === 'Đã thanh toán';
                default: return true;
            }
        });

        if (filteredOrders.length === 0) {
            return null;
        }

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

    const exportPDF = () => {
        try {
            const doc: any = new jsPDF();

            doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");

            doc.text("Danh Sách Hóa Đơn", 14, 16);

            const tableColumn = ["Mã HD", "Họ và tên", "Ngày đặt", "Tổng tiền", "Số điện thoại", "Trạng thái"];
            const tableRows: string[][] = [];

            const filteredBookings = bookingData.filter(booking =>
                booking.userFullname.toLowerCase().includes(searchTerm)
            ).filter(booking => {
                switch (activeTab) {
                    case 'unpaid': return booking.status === 'Chờ thanh toán';
                    case 'cancel': return booking.status === 'Đã hủy';
                    case 'complete': return booking.status === 'Đã thanh toán';
                    default: return true;
                }
            });

            filteredBookings.forEach(booking => {
                const orderData = [
                    `#${booking.bookingId}`,
                    booking.userFullname,
                    new Date(booking.date).toLocaleDateString('en-GB'),
                    `${booking.totalAmount.toLocaleString()} ₫`,
                    booking.userPhone || 'Chưa cập nhật số điện thoại',
                    booking.status
                ];
                tableRows.push(orderData);
            });

            doc.autoTable({
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
                didParseCell: (data: any) => {
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

            doc.save(`HoaDonDatSan-Mapogo(${formattedDay}/${formattedMonth}).pdf`);
            toast.success("Đã xuất file PDF thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình xuất file! Vui lòng thử lại sau!");
        }

    };

    const exportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Hóa Đơn');

            const filteredBookings = bookingData.filter(booking =>
                booking.userFullname.toLowerCase().includes(searchTerm)
            ).filter(booking => {
                switch (activeTab) {
                    case 'unpaid': return booking.status === 'Chờ thanh toán';
                    case 'cancel': return booking.status === 'Đã hủy';
                    case 'complete': return booking.status === 'Đã thanh toán';
                    default: return true;
                }
            });

            worksheet.columns = [
                { header: 'Mã hóa đơn', key: 'orderId', width: 15 },
                { header: 'Họ và tên', key: 'fullname', width: 25 },
                { header: 'Ngày đặt', key: 'date', width: 15 },
                { header: 'Tổng tiền', key: 'amount', width: 15, style: { numFmt: '#,##0 ₫' } },
                { header: 'Số điện thoại', key: 'userPhone', width: 60 },
                { header: 'Trạng thái', key: 'status', width: 15 },
            ];

            filteredBookings.forEach(booking => {
                worksheet.addRow({
                    orderId: `#${booking.bookingId}`,
                    fullname: booking.userFullname,
                    date: new Date(booking.date).toLocaleDateString('en-GB'),
                    amount: booking.totalAmount,
                    userPhone: booking.userPhone || 'Chưa cập nhật số điện thoại',
                    status: booking.status
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
            saveAs(new Blob([buffer]), `HoaDonDatSan-Mapogo(${formattedDay}/${formattedMonth}).xlsx`);
            toast.success('Đã xuất file Excel thành công!');
        } catch (error) {
            toast.error('Xuất file Excel không thành công! Vui lòng thử lại sau!');
        }
    };


    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <div style={{ fontSize: '14px' }}>
            <div className="box-ultil">
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Hóa Đơn</b>
                <div>
                    <Form.Control type="text" placeholder="Tìm theo tên người dùng..." onChange={handleSearch} />
                </div>
                <div>
                    <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={exportPDF}>Xuất File PDF</Button>
                    <Button className="btn-sd-admin ms-2" style={{ fontSize: '15px' }} onClick={exportExcel}>Xuất File Excel</Button>
                </div>
            </div>
            <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                <Nav.Item>
                    <Nav.Link eventKey="all" className="tab-link">Toàn bộ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="unpaid" className="tab-link">Chờ thanh toán</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="cancel" className="tab-link">Đã hủy</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="complete" className="tab-link">Đã thanh toán</Nav.Link>
                </Nav.Item>
            </Nav>
            {renderContent()}
            {renderPagination()}
        </div>
    );
};

export default OwnerBookingBill;
