'use client';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
// import Form from 'react-bootstrap/Form';
import { Dropdown, Button } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure to import the styles
import MyVerticallyCenteredModal from '@/components/ModalOrder/MoDal'
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { formatPrice, formatDate, formatDateForApi, formatDateNotime } from '@/components/Utils/Format';

const Admin = () => {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Set Date type or null
    const [selectedDate1, setSelectedDate1] = useState<Date | null>(null); // Set Date type or null
    // Tạo state để lưu trữ mục được chọn
    const [selectedOption, setSelectedOption] = useState('Danh Sách Hóa Đơn');
    const [selectedOptionDay, setSelectedOptionDay] = useState('Hôm Nay');
    const [showSubOptions, setShowSubOptions] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Để lưu trữ orderId của đơn hàng được chọn

    // Hàm xử lý khi người dùng chọn một mục
    const handleSelect = (eventKey) => {
        setSelectedOption(eventKey);
    };

    const handleSelectDay = (eventKey) => {
        if (eventKey === "Tùy Chọn") {
            setShowSubOptions((prev) => !prev); // Toggle hiển thị menu con
        } else {
            setSelectedOptionDay(eventKey);
            setShowSubOptions(false); // Ẩn menu con nếu chọn mục khác
            setShowDropdown(false); // Ẩn Dropdown chính khi chọn một mục
        }
    };
    const handleToggle = (isOpen: boolean) => {
        setShowDropdown(isOpen);
    };



    const [dataListOther, setDataListOther] = useState([]);
    const [dataColumnnChartOther, setDataColumnnChartOther] = useState([]);
    const handleFindDate = async () => {
        try {
            if (selectedOptionDay === "Một Ngày") {
                const date = formatDateForApi(selectedDate);
                console.log(date);

                const response = await axios.get(`http://localhost:8080/rest/admin/order-between?date=${date}`);
                const response1 = await axios.get(`http://localhost:8080/rest/admin/category-product-total-between?date=${date}`)
                setDataListOther(response.data);
                setDataColumnnChartOther(response1.data);
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
        const [dataColumnnToday, setDataColumnnChartToday] = useState([]);
        const [dataColumnnYesterday, setDataColumnnChartYesterday] = useState([]);
        const [dataColumnnChart7Day, setDataColumnnChart7Day] = useState([]);
        const [dataColumnnChartOneMonth, setDataColumnnChartOneMonth] = useState([]);
        const [loading, setLoading] = useState(true); // Set loading to true initially


        useEffect(() => {
            const fetchData = async () => {
                try {
                    setLoading(true); // Set loading to true when starting fetch
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
                } finally {
                    setLoading(false); // Stop loading when data fetch is done
                }
            };

            fetchData();
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
            <div>
                {loading ? (
                    <>
                        <Spinner animation="border" variant="info" /> Đang tải.....
                    </>
                ) : (
                    <div id="columnChart" className='justify-content-center'></div>
                )}
            </div>
        );
    };



    const PieChart = () => {
        useEffect(() => {
            // Load Google Charts
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

            // Function to draw the chart
            const drawChart = () => {
                const data = window.google.visualization.arrayToDataTable([
                    ['Task', 'Hours per Day'],
                    ['Work', 10],
                    ['Eat', 2],
                    ['Commute', 2],
                    ['Watch TV', 2],
                    ['Sleep', 7],
                ]);

                const options = {
                    title: 'My Daily Activities',
                    width: 1000,  // Set chart width
                    height: 500, // Set chart height
                };

                const chart = new window.google.visualization.PieChart(document.getElementById('piechart'));
                chart.draw(data, options);
            };

            loadGoogleCharts();
        }, []);

        const renderTable = (title) => (
            <div>
                <h5>{title}</h5>
                <Table striped="columns" responsive className='border'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );

        return (
            <>
                {/* Pie chart */}
                <div id="piechart" className='justify-conten-center'></div>

                {selectedOptionDay === "Hôm Nay" && renderTable("Tổng Doanh thu hôm nay")}
                {selectedOptionDay === "Một Tuần" && renderTable("Tổng Doanh thu Một Tuần")}
                {selectedOptionDay === "Một Tháng" && renderTable("Tổng Doanh thu Một Tháng")}
            </>
        );
    };


    const [dataOrderToDay, setDataOrderToDay] = useState([]);
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

    const [dataOrderYesterday, setDataOrderYesterday] = useState([]);
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

    const [dataOrder7day, setDataOrder7day] = useState([]);
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

    const [dataOrderOneMonth, setDataOrderOneMonth] = useState([]);
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
                title: `Danh sách đơn hàng một tuần từ ngày ${formatDateNotime(today)} đến ${formatDateNotime(oneWeekAgo)}`,
                data: dataOrder7day, // Thay thế bằng dữ liệu thực tế cho một tuần
            },
            {
                option: 'Một Tháng',
                title: `Danh sách đơn hàng một tháng từ ngày ${formatDateNotime(today)} đến ${formatDateNotime(oneWeekAgo)}`,
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
                {orderOptions.map(({ option, title, data }) =>
                    selectedOptionDay === option ? renderTable(title, data) : null
                )}
            </>
        );
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
                                <Dropdown>
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        Danh Sách Hóa Đơn
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey={"Danh Sách Hóa Đơn"}>Danh Sách Hóa Đơn</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Tài Khoản Mới"}>Tài Khoản Mới</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Tồn Kho"}>Tồn Kho</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div style={{ position: 'relative', display: 'inline-block' }} className='me-1'>
                                <Dropdown
                                    show={showDropdown}
                                    onToggle={(isOpen) => {
                                        // Chỉ đổi trạng thái khi cần thiết
                                        handleToggle(isOpen);
                                    }}
                                    onSelect={(eventKey) => handleSelectDay(eventKey)}
                                >
                                    <Dropdown.Toggle
                                        variant="info"
                                        id="dropdown-basic"
                                        onMouseDown={(e) => e.preventDefault()} // Ngăn sự kiện ảnh hưởng đến toggle
                                    >
                                        {selectedOptionDay}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey="Hôm Nay">Hôm Nay</Dropdown.Item>
                                        <Dropdown.Item eventKey="Hôm Qua">Hôm Qua</Dropdown.Item>
                                        <Dropdown.Item eventKey="Một Tuần">Một Tuần</Dropdown.Item>
                                        <Dropdown.Item eventKey="Một Tháng">Một Tháng</Dropdown.Item>
                                        <Dropdown.Item
                                            as="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowSubOptions(!showSubOptions);
                                            }}
                                        >
                                            Tùy Chọn
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>




                                {/* Hiển thị sub-options bên phải của Dropdown */}
                                {showSubOptions && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '156px',
                                            left: '100%',
                                            marginLeft: '50px',
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '5px',
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            zIndex: 1000,
                                        }}
                                    >
                                        <Dropdown.Item
                                            eventKey="Một Ngày"
                                            onClick={() => { handleSelectDay("Một Ngày"); }}
                                        >
                                            Một Ngày
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            eventKey="Nhiều Ngày"
                                            onClick={() => { handleSelectDay("Nhiều Ngày"); }}
                                        >
                                            Nhiều Ngày
                                        </Dropdown.Item>
                                    </div>
                                )}
                            </div>

                            <div className="select-option">
                                <Dropdown>
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        <i className="bi bi-box-arrow-down"></i> Export
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Excel</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>


                {selectedOption === "Tổng Doanh Thu" ? <PieChart /> : null}
                {selectedOption === "Tài Khoảng Mới" ? <PieChart /> : null}
                {selectedOption === "Tồn Kho" ? <ColumnChart /> : null}
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
