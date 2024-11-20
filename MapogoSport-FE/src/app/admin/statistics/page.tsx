'use client';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure to import the styles
import MyVerticallyCenteredModal from '@/components/ModalOrder/MoDal'
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { toast } from "react-toastify";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { formatPrice, formatDate, formatDateForApi, formatDateNotime } from '@/components/Utils/Format';

const Admin = () => {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Set Date type or null
    const [selectedDate1, setSelectedDate1] = useState<Date | null>(null); // Set Date type or null
    // Tạo state để lưu trữ mục được chọn
    const [selectedOption, setSelectedOption] = useState('Danh Sách Hóa Đơn');
    const [selectedOptionDay, setSelectedOptionDay] = useState('Hôm Nay');
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Để lưu trữ orderId của đơn hàng được chọn
    const [dataColumnnToday, setDataColumnnChartToday] = useState([]);
    const [dataColumnnYesterday, setDataColumnnChartYesterday] = useState([]);
    const [dataColumnnChart7Day, setDataColumnnChart7Day] = useState([]);
    const [dataColumnnChartOneMonth, setDataColumnnChartOneMonth] = useState([]);
    const [dataListOther, setDataListOther] = useState([]);
    const [dataColumnnChartOther, setDataColumnnChartOther] = useState([]);
    const [dataOrderToDay, setDataOrderToDay] = useState([]);
    const [dataOrderYesterday, setDataOrderYesterday] = useState([]);
    const [dataOrderOneMonth, setDataOrderOneMonth] = useState([]);
    const [dataOrder7day, setDataOrder7day] = useState([]);
    // Hàm xử lý khi người dùng chọn một mục

    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
    };

    const handleSelectDay = (e) => {
        const value = e.target.value;
        setSelectedOptionDay(value);
    };


    const handleFindDate = async () => {
        try {
            if (selectedOptionDay === "Một Ngày") {
                const date = formatDateForApi(selectedDate);
                console.log(date);

                const response = await axios.get(`http://localhost:8080/rest/admin/order-between?date=${date}`);
                const response1 = await axios.get(`http://localhost:8080/rest/admin/category-product-total-between?date=${date}`)
                setDataListOther(response.data);
                setDataColumnnChartOther(response1.data);
                // console.log(">>>date ", date);

            } else if (selectedOptionDay === "Nhiều Ngày") {
                const startDay = formatDateForApi(selectedDate);
                const endDay = formatDateForApi(selectedDate1);
                console.log("end day: ", endDay);
                const response = await axios.get(`http://localhost:8080/rest/admin/order-between?startDay=${startDay}&endDay=${endDay}`);
                const response1 = await axios.get(`http://localhost:8080/rest/admin/category-product-total-between?startDay=${startDay}&endDay=${endDay}`)
                setDataListOther(response.data);
                setDataColumnnChartOther(response1.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            // Optional: Show error message to the user
        }
    };

    const ColumnChart = () => {
        useEffect(() => {
            const fetchData = async () => {
                try {

                    const [todayResp, yesterdayResp, weekResp, monthResp] = await Promise.all([
                        axios.get('http://localhost:8080/rest/admin/category-product-totals-today'),
                        axios.get('http://localhost:8080/rest/admin/category-product-totals-yesterday'),
                        axios.get('http://localhost:8080/rest/admin/category-product-totals-7day'),
                        axios.get('http://localhost:8080/rest/admin/category-product-totals-one-month'),
                    ]);

                    setDataColumnnChartToday(todayResp.data);
                    setDataColumnnChartYesterday(yesterdayResp.data);
                    setDataColumnnChart7Day(weekResp.data);
                    setDataColumnnChartOneMonth(monthResp.data);
                } catch (error) {
                    console.error("Error fetching chart data", error);
                }
            };

            if (!dataColumnnToday.length && !dataColumnnYesterday.length && !dataColumnnChart7Day.length && !dataColumnnChartOneMonth.length) {
                fetchData();
            }
        }, []);

        const chartOptions = [
            {
                option: 'Hôm Nay',
                title: 'Biểu đồ hoạt động hôm nay',
                data: dataColumnnToday.length > 0
                    ? [['Category', { role: 'style' }, 'Total'],
                    ...dataColumnnToday.map(item => [
                        item[1] || 'Chưa có tên',
                        'color: #76A7FA',
                        parseFloat(item[3]) || 0])]
                    : [['Category', { role: 'style' }, 'Total'], ['Loading', 'color: #76A7FA', 0]]
            },
            {
                option: 'Hôm Qua',
                title: 'Biểu đồ hoạt động hôm qua',
                data: dataColumnnYesterday.length > 0
                    ? [['Category', { role: 'style' }, 'Total'],
                    ...dataColumnnYesterday.map(item => [
                        item[1] || 'Chưa có tên',
                        'color: #76A7FA',
                        parseFloat(item[3]) || 0])]
                    : [['Category', { role: 'style' }, 'Total'], ['Loading', 'color: #76A7FA', 0]]
            },
            {
                option: 'Một Tuần',
                title: 'Biểu đồ hoạt động một tuần',
                data: dataColumnnChart7Day.length > 0
                    ? [['Category', { role: 'style' }, 'Total'],
                    ...dataColumnnChart7Day.map(item => [
                        item[1] || 'Chưa có tên',
                        'color: #76A7FA',
                        parseFloat(item[3]) || 0])]
                    : [['Category', { role: 'style' }, 'Total'], ['Loading', 'color: #76A7FA', 0]]
            },
            {
                option: 'Một Tháng',
                title: 'Biểu đồ hoạt động một tháng',
                data: dataColumnnChartOneMonth.length > 0
                    ? [['Category', { role: 'style' }, 'Total'],
                    ...dataColumnnChartOneMonth.map(item => [
                        item[1] || 'Chưa có tên',
                        'color: #76A7FA',
                        parseFloat(item[3]) || 0])]
                    : [['Category', { role: 'style' }, 'Total'], ['Loading', 'color: #76A7FA', 0]]
            },
            {
                option: 'Một Ngày',
                title: 'Biểu đồ hoạt động Một ngày',
                data: dataColumnnChartOther.length > 0
                    ? [['Category', { role: 'style' }, 'Total'],
                    ...dataColumnnChartOther.map(item => [
                        item[1] || 'Chưa có tên',
                        'color: #76A7FA',
                        parseFloat(item[3]) || 0])]
                    : [ // No data case
                        ['Category', { role: 'style' }, 'Total'],
                        ['Loading', 'Loading', 'color: #76A7FA', 0]
                    ]
            },
            {
                option: 'Nhiều Ngày',
                title: 'Biểu đồ hoạt động Nhiều ngày',
                data: dataColumnnChartOther.length > 0
                    ? [['Category', { role: 'style' }, 'Total'],
                    ...dataColumnnChartOther.map(item => [
                        item[1] || 'Chưa có tên',
                        'color: #76A7FA',
                        parseFloat(item[3]) || 0])]
                    : [ // No data case
                        ['Category', { role: 'style' }, 'Total'],
                        ['Loading', 'Loading', 'color: #76A7FA', 0]
                    ]
            },
        ];

        useEffect(() => {
            const loadGoogleCharts = () => {
                const script = document.createElement('script');
                script.src = 'https://www.gstatic.com/charts/loader.js';
                script.async = true;
                script.onload = () => {
                    if (window.google) {
                        window.google.charts.load('current', { packages: ['corechart'] });
                        window.google.charts.setOnLoadCallback(drawChart);
                    }
                };

                document.body.appendChild(script);
            };

            const drawChart = () => {
                const chartData = chartOptions.find(option => option.option === selectedOptionDay)?.data || [];
                const data = window.google.visualization.arrayToDataTable(chartData);

                const options = {
                    title: chartOptions.find(option => option.option === selectedOptionDay)?.title || 'Biểu đồ',
                    width: 1000,
                    height: 500,
                    hAxis: { title: 'Loại Sản Phẩm' },
                    vAxis: { title: 'Tiền (VND)' },
                };

                const chart = new window.google.visualization.ColumnChart(document.getElementById('columnChart'));
                chart.draw(data, options);
            };

            loadGoogleCharts();
        }, [selectedOptionDay, dataColumnnToday, dataColumnnYesterday, dataColumnnChart7Day, dataColumnnChartOneMonth, dataColumnnChartOther]);

        return (
            <div id="columnChart" className='justify-content-center'></div>
        );
    };




    useEffect(() => {
        const fetchDataOrderToDay = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/rest/admin/orderToDay`);
                // console.log('Response received:', response); // In ra toàn bộ response
                setDataOrderToDay(response.data);
                // console.log('dataOrderToDay:', response.data); // In ra dữ liệu
            } catch (error) {
                console.error('Error:', error); // Sử dụng console.error để hiển thị lỗi
            }
        };
        fetchDataOrderToDay();
    }, []);


    useEffect(() => {
        const fetchDataOrderYesterday = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/rest/admin/orderYesterday`);
                // console.log('Response received:', response);
                setDataOrderYesterday(response.data);
                // console.log('dataOrderYesterday:', response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchDataOrderYesterday();

    }, [])


    useEffect(() => {
        const fetchDataOrder7day = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/rest/admin/order7day`);
                // console.log('Response received:', response);
                setDataOrder7day(response.data);
                // console.log('dataOrderYesterday:', response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchDataOrder7day();

    }, [])


    useEffect(() => {
        const fetchDataOrderOneMonth = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/rest/admin/orderOneMonth`);
                // console.log('Response received:', response);
                setDataOrderOneMonth(response.data);
                // console.log('dataOrderYesterday:', response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchDataOrderOneMonth();

    }, [])
    // Effect to reset selectedDate when switching to "Nhiều Ngày"
    useEffect(() => {
        if (selectedOptionDay === "Nhiều Ngày") {
            setSelectedDate(null); // Reset selectedDate when switching to "Nhiều Ngày"
            setSelectedDate1(null); // Optionally reset selectedDate1 as well
        }
    }, [selectedOptionDay]); // Dependency array to run when selectedOptionDay changes



    const LisOrder = () => {
        const renderTable = (title: string, data: []) => {
            // Tính tổng tiền
            const totalAmount = data.reduce((sum, order) => sum + order.amount, 0);
            const [currentPage, setCurrentPage] = useState(1);
            const itemsPerPage = 10;

            // Sắp xếp dữ liệu từ ngày mới nhất đến cũ nhất
            const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

            // Tính toán dữ liệu cho trang hiện tại
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);
            // Tính số trang
            const totalPages = Math.ceil(sortedData.length / itemsPerPage);

            // Hàm chuyển trang
            const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
            const renderPaginationItems = () => {
                const items = [];
                for (let page = 1; page <= totalPages; page++) {
                    items.push(
                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => paginate(page)}
                        >
                            {page}
                        </Pagination.Item>
                    );
                }
                return items;
            };

            return (
                <div>
                    <h5>{title}</h5>
                    {currentData.length > 0 ? (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên Khách Hàng</th>
                                        <th>Số Điện Thoại</th>
                                        <th>Ngày mua</th>
                                        <th>Trạng thái</th>
                                        <th>Tiền</th>
                                        <th>Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((order, index) => (
                                        <tr key={order.orderId}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{order.user.fullname || 'Chưa có tên'}</td>
                                            <td>{order.phoneNumber || 'Chưa có số điện thoại'}</td>
                                            <td>{formatDate(order.date)}</td>
                                            <td>{order.status}</td>
                                            <td>{formatPrice(order.amount)}</td>
                                            <td>
                                                <i style={{ cursor: 'pointer' }}
                                                    className="bi bi-three-dots"
                                                    onClick={() => {
                                                        setSelectedOrderId(order.orderId); // Lưu orderId
                                                        setShowModal(true); // Hiển thị modal
                                                    }}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold', color: 'red' }}>Tổng Tiền:</td>
                                        <td colSpan={2} style={{ fontWeight: 'bold', color: 'red' }}>{formatPrice(totalAmount)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Hiển thị Modal bên ngoài tbody */}
                            <MyVerticallyCenteredModal
                                showModal={showModal}
                                setShowModal={setShowModal}
                                orderId={selectedOrderId}
                                onHide={() => setShowModal(false)} // Đóng modal
                            />

                            {/* Nút phân trang */}
                            <Pagination style={{ justifyContent: 'center' }}>
                                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                {renderPaginationItems()}
                                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        </>
                    ) : (
                        <p>Không có đơn hàng nào.</p>
                    )}
                </div>
            );

        };
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        // Tính ngày cách đây 1 tuần (7 ngày)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        // Tính ngày cách đây 1 tháng
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const orderOptions = [
            {
                option: 'Hôm Nay',
                title: `Danh sách đơn hàng hôm nay ${formatDateNotime(today)}`,
                data: dataOrderToDay, // Dữ liệu cho hôm nay
            },
            {
                option: 'Hôm Qua',
                title: `Danh sách hóa đơn hôm qua ngày ${formatDateNotime(yesterday)}`,
                data: dataOrderYesterday
            },
            {
                option: 'Một Tuần',
                title: `Danh sách đơn hàng một tuần từ ngày ${formatDateNotime(oneWeekAgo)} đến ${formatDateNotime(today)}`,
                data: dataOrder7day, // Thay thế bằng dữ liệu thực tế cho một tuần
            },
            {
                option: 'Một Tháng',
                title: `Danh sách đơn hàng một tháng từ ngày ${formatDateNotime(oneMonthAgo)} đến ${formatDateNotime(today)}`,
                data: dataOrderOneMonth, // Thay thế bằng dữ liệu thực tế cho một tháng
            },
            {
                option: 'Một Ngày',
                title: `Danh sách đơn hàng ngày ${selectedDate === null ? '...' : formatDateNotime(selectedDate)}`,
                data: dataListOther, // Thay thế bằng dữ liệu thực tế cho tùy chọn
            },
            {
                option: 'Nhiều Ngày',
                title: `Danh sách đơn hàng từ ${selectedDate === null || selectedDate1 === null ? '...' : formatDateNotime(selectedDate)} đến ${selectedDate1 === null ? '...' : formatDateNotime(selectedDate1)}`,
                data: dataListOther, // Thay thế bằng dữ liệu thực tế cho tùy chọn
            },

        ];

        return (
            <>
                {orderOptions.map(({ option, title, data }) => (
                    selectedOptionDay === option ? (
                        <div key={option}> {/* Use 'option' as the unique key */}
                            {renderTable(title, data)}
                        </div>
                    ) : null
                ))}
            </>
        );
    };


    // Hàm export dữ liệu ra file Excel
    const exportToExcel = async () => {
        // Hàm lấy dữ liệu hóa đơn dựa trên selectedOptionDay
        const getOrderData = () => {
            switch (selectedOptionDay) {
                case 'Hôm Nay':
                    return dataOrderToDay;
                case 'Hôm Qua':
                    return dataOrderYesterday;
                case 'Một Tuần':
                    return dataOrder7day;
                case 'Một Tháng':
                    return dataOrderOneMonth;
                case 'Một Ngày':
                case 'Nhiều Ngày':
                    return dataListOther;
                default:
                    return [];
            }
        };

        // Hàm lấy dữ liệu biểu đồ dựa trên selectedOptionDay
        const getChartData = () => {
            switch (selectedOptionDay) {
                case 'Hôm Nay':
                    return dataColumnnToday;
                case 'Hôm Qua':
                    return dataColumnnYesterday;
                case 'Một Tuần':
                    return dataColumnnChart7Day;
                case 'Một Tháng':
                    return dataColumnnChartOneMonth;
                case 'Một Ngày':
                case 'Nhiều Ngày':
                    return dataColumnnChartOther;
                default:
                    return [];
            }
        };
        try {
            const workbook = new ExcelJS.Workbook();

            // Tạo worksheet cho "Danh sách Hóa đơn"
            const worksheet1 = workbook.addWorksheet('Danh sách Hóa đơn');

            // Định dạng các cột
            worksheet1.columns = [
                { header: 'STT', key: 'index', width: 5 },
                { header: 'Tên Khách Hàng', key: 'fullname', width: 25 },
                { header: 'Số Điện Thoại', key: 'phoneNumber', width: 15 },
                { header: 'Ngày mua', key: 'date', width: 15 },
                { header: 'Trạng thái', key: 'status', width: 15 },
                { header: 'Tiền', key: 'amount', width: 15, style: { numFmt: '#,##0 ₫' } }
            ];

            const orderData = getOrderData();
            orderData.forEach((order, index) => {
                worksheet1.addRow({
                    index: index + 1,
                    fullname: order.user.fullname || 'Chưa có tên',
                    phoneNumber: order.phoneNumber || 'Chưa có số điện thoại',
                    date: new Date(order.date).toLocaleDateString('en-GB'),
                    status: order.status,
                    amount: order.amount,
                });
            });

            // Thêm tổng tiền vào cuối sheet "Danh sách Hóa đơn"
            const totalAmount = orderData.reduce((sum, order) => sum + order.amount, 0);
            worksheet1.addRow({ date: '', status: 'Tổng Tiền', amount: totalAmount });

            // Tạo worksheet cho "Biểu đồ"
            const worksheet2 = workbook.addWorksheet('Biểu đồ');
            const chartData = getChartData();

            // Định dạng các cột
            worksheet2.columns = [
                { header: 'Category', key: 'category', width: 25 },
                { header: 'Total', key: 'total', width: 15 }
            ];

            // Thêm dữ liệu cho "Biểu đồ"
            if (chartData.length > 0) {
                chartData.forEach((item) => {
                    worksheet2.addRow({
                        category: item[1],
                        total: item[3],
                    });
                });
            } else {
                worksheet2.addRow({ category: 'Loading', total: 0 });
            }

            // Áp dụng border cho từng ô trong worksheet "Biểu đồ"
            worksheet2.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // Tạo tên file dựa trên ngày hiện tại
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day;

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `BaoCaoHoaDon-BieuDo(${formattedDay}/${formattedMonth}).xlsx`);
            toast.success('Đã xuất file Excel thành công!');
        } catch (error) {
            toast.error('Xuất file Excel không thành công! Vui lòng thử lại sau!');
        }
    };


    return (
        <>
            <Container>
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 mt-3">
                    <div className="white-box">
                        <div className="d-flex">
                            {/* Your Dropdown component here */}
                            {selectedOptionDay === "Một Ngày" && (
                                <>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={date => setSelectedDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control mb-3"
                                        placeholderText="Chọn ngày"
                                    />
                                    <Button onClick={handleFindDate} variant="outline-info" style={{ width: "100px", height: '39px' }}>
                                        <i className="bi bi-search"></i>
                                    </Button>
                                </>
                            )}
                            {selectedOptionDay === "Nhiều Ngày" && (
                                <>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={date => setSelectedDate(date)} // Set the start date
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control mb-3"
                                        placeholderText="Từ ngày"
                                    />
                                    <DatePicker
                                        selected={selectedDate1}
                                        onChange={date => setSelectedDate1(date)} // Set the end date
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control ms-1"
                                        placeholderText="Đến ngày"
                                    />
                                    <Button onClick={handleFindDate} variant="outline-info" style={{ width: "100px", height: '39px' }}>
                                        <i className="bi bi-search"></i>
                                    </Button>
                                </>
                            )}

                            <div className="select-option mb-3 ms-auto me-1">
                                <Form.Select
                                    aria-label=""
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                >
                                    <option value="Danh Sách Hóa Đơn">Danh Sách Hóa Đơn</option>
                                    {/* <option value="Tài Khoản Mới">Tài Khoản Mới</option>
                                    <option value="Tồn Kho">Tồn Kho</option> */}
                                </Form.Select>
                            </div>

                            <div style={{ position: 'relative', display: 'inline-block' }} className='me-1'>
                                <Form.Select
                                    aria-label="Chọn Ngày"
                                    value={selectedOptionDay}
                                    onChange={handleSelectDay}
                                >
                                    <option value="Hôm Nay">Hôm Nay</option>
                                    <option value="Hôm Qua">Hôm Qua</option>
                                    <option value="Một Tuần">Một Tuần</option>
                                    <option value="Một Tháng">Một Tháng</option>
                                    <option value="Một Ngày"> Một Ngày</option>
                                    <option value="Nhiều Ngày"> Nhiều Ngày</option>
                                </Form.Select>
                            </div>
                            <div className="select-option">
                                <Form.Select
                                    aria-label=""
                                    onChange={(e) => {
                                        if (e.target.value === "Excel") {
                                            exportToExcel();
                                        }
                                    }}
                                >
                                    <option value="Export">Export</option>
                                    <option value="Excel">Excel</option>
                                </Form.Select>
                            </div>

                        </div>
                    </div>
                </div>



                {selectedOption === "Danh Sách Hóa Đơn" ? (
                    <>
                        <ColumnChart />
                        <LisOrder />

                    </>
                ) : null}

            </Container>
        </>

    );
};
export default Admin;