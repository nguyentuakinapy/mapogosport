'use client';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
// import Form from 'react-bootstrap/Form';
import { Dropdown, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure to import the styles

import axios from 'axios';
import { formatPrice, formatDate } from '@/components/Utils/Format';

const Admin = () => {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Set Date type or null
    const [selectedDate1, setSelectedDate1] = useState<Date | null>(null); // Set Date type or null
    // Tạo state để lưu trữ mục được chọn
    const [selectedOption, setSelectedOption] = useState('Danh Sách Hóa Đơn');
    const [selectedOptionDay, setSelectedOptionDay] = useState('Hôm Nay');

    // Hàm xử lý khi người dùng chọn một mục
    const handleSelect = (eventKey) => {
        setSelectedOption(eventKey);
    };
    const handleSelectDay = (eventKey) => {
        setSelectedOptionDay(eventKey);
    };
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);  // Update state with selected date
    };
    const handleDateChange1 = (date: Date | null) => {
        setSelectedDate1(date);  // Update state with selected date
    };
    const [dataColumnnCharOther, setDataColumnnChartOther] = useState([]);
    const handleFindDate = async () => {

        console.log(" date: ", formatDate(selectedDate) || formatDate(selectedDate1));
        console.log("start date: ", formatDate(selectedDate));
        console.log("end date: ", formatDate(selectedDate1));

        try {

            const date = formatDate(selectedDate) || formatDate(selectedDate1); // Ngày cụ thể
            const startDay = formatDate(selectedDate); // Ngày bắt đầu
            const endDay = formatDate(selectedDate1); // Ngày kết thúc

            const resp = await axios.get(`http://localhost:8080/admin/order-between?date=${date}&startDay=${startDay}&endDay=${endDay}`);
            setDataColumnnChartOther(resp.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };


    const ColumnChart = () => {
        const [dataColumnnChart7Day, setDataColumnnChart7Day] = useState([]);
        const [dataColumnnChartOneMonth, setDataColumnnChartOneMonth] = useState([]);

        // Fetch data for the last 7 days
        useEffect(() => {
            const fetchDataColumnnChart7Day = async () => {
                try {
                    const resp = await axios.get('http://localhost:8080/rest/admin/category-product-totals-7day');
                    setDataColumnnChart7Day(resp.data);
                    console.log(">>> dataChart111: ", resp.data);
                } catch (error) {
                    console.error("Error fetching data for 7-day chart", error);
                }
            };

            fetchDataColumnnChart7Day();
        }, []);

        // Fetch data for the last month
        useEffect(() => {
            const fetchDataColumnnChartMonth = async () => {
                try {
                    const resp = await axios.get('http://localhost:8080/rest/admin/category-product-totals-one-month'); // Corrected endpoint
                    setDataColumnnChartOneMonth(resp.data);
                    console.log(">>> dataChart 1 month: ", resp.data);
                } catch (error) {
                    console.error("Error fetching data for 1-month chart", error);
                }
            };

            fetchDataColumnnChartMonth();
        }, []);



        const chartOptions = [
            {
                option: 'Hôm Nay',
                title: 'Biểu đồ hoạt động hôm nay',
                data: [
                    ['Task', 'Hours per To Day'],
                    ['Work', 8],
                    ['Eat', 2],
                    ['Commute', 2],
                    ['Watch TV', 3],
                    ['Sleep', 9],
                ]
            },
            {
                option: 'Hôm Qua',
                title: 'Biểu đồ hoạt động hôm nay',
                data: [
                    ['Task', 'Hours per To Day'],
                    ['Work', 8],
                    ['Eat', 2],
                    ['Commute', 2],
                    ['Watch TV', 3],
                    ['Sleep', 9],
                ]
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
                    : [ // No data case
                        ['Category', { role: 'style' }, 'Total'],
                        ['Loading', 'Loading', 'color: #76A7FA', 0]
                    ]
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
                    : [ // No data case
                        ['Category', { role: 'style' }, 'Total'],
                        ['Loading', 'Loading', 'color: #76A7FA', 0]
                    ]
            },
            {
                option: 'Tùy Chọn',
                title: 'Biểu đồ hoạt động hôm nay',
                data: [
                    ['Task', 'Hours per To Day'],
                    ['Work', 8],
                    ['Eat', 2],
                    ['Commute', 2],
                    ['Watch TV', 3],
                    ['Sleep', 9],
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
                    hAxis: { title: 'Loại Sản Phẩm' },  // Tiêu đề trục hoành
                    vAxis: { title: 'Tiền (VND)' },      // Tiêu đề trục tung
                };

                const chart = new window.google.visualization.ColumnChart(document.getElementById('columnChart'));
                chart.draw(data, options);
            };

            loadGoogleCharts();
        }, [selectedOptionDay, dataColumnnChart7Day, dataColumnnChartOneMonth]); // Add dataColumnnChartOneMonth to the dependency array

        return (
            <div>
                <div id="columnChart" className='justify-content-center'></div>
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



    const LisOrder = () => {
        const renderTable = (title, data) => {
            // Tính tổng tiền
            const totalAmount = data.reduce((sum, order) => sum + order.amount, 0);

            return (
                <div>
                    <h5>{title}</h5>
                    {data.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên Khách Hàng</th>
                                    <th>Số Điện Thoại</th>
                                    <th>Ngày mua</th>
                                    <th>Trạng thái</th>
                                    <th>Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((order, index) => (
                                    <tr key={order.orderId}>
                                        <td>{index + 1}</td>
                                        <td>{order.user.fullname || 'Chưa có tên'}</td>
                                        <td>{order.phoneNumber || 'Chưa có số điện thoại'}</td>
                                        <td>{formatDate(order.date)}</td>
                                        <td>{order.status}</td>
                                        <td>{formatPrice(order.amount)}</td>
                                    </tr>
                                ))}
                                {/* Hiển thị tổng tiền */}
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold', color: 'red' }}>Tổng Tiền:</td>
                                    <td style={{ fontWeight: 'bold', color: 'red' }}>{formatPrice(totalAmount)}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có đơn hàng nào.</p>
                    )}
                </div>
            );
        };

        const orderOptions = [
            {
                option: 'Hôm Nay',
                title: 'Danh sách đơn hàng hôm nay',
                data: dataOrderToDay, // Dữ liệu cho hôm nay
            },
            {
                option: 'Hôm Qua',
                title: 'Danh sách hóa đơn hôm qua',
                data: dataOrderYesterday
            },
            {
                option: 'Một Tuần',
                title: 'Danh sách đơn hàng một tuần',
                data: dataOrder7day, // Thay thế bằng dữ liệu thực tế cho một tuần
            },
            {
                option: 'Một Tháng',
                title: 'Danh sách đơn hàng một tháng',
                data: dataOrderOneMonth, // Thay thế bằng dữ liệu thực tế cho một tháng
            },
            {
                option: 'Tùy Chọn',
                title: 'Danh sách đơn hàng tùy chọn',
                data: dataColumnnCharOther, // Thay thế bằng dữ liệu thực tế cho tùy chọn
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
                            {selectedOptionDay === "Tùy Chọn" ? (
                                <>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}  // Corrected event handler
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control mb-3"
                                        placeholderText="Từ ngày" // "From date" in English
                                        popperPlacement="bottom-end"
                                        showPopperArrow={false}
                                    />
                                    <DatePicker
                                        selected={selectedDate1}
                                        onChange={handleDateChange1}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control ms-1"
                                        placeholderText="Đến ngày" // "To date" in English
                                        popperPlacement="bottom-end"
                                        showPopperArrow={false}
                                    />
                                    <Button
                                        onClick={handleFindDate}  // Corrected event handler
                                        variant="outline-info"
                                        className='ms-3'
                                        style={{ width: "100px", height: '39px' }}>
                                        <i className="bi bi-search"></i> {/* Search icon */}
                                    </Button>
                                </>

                            ) : <div></div>}


                            <div className="select-option mb-3 ms-auto me-2">
                                <Dropdown onSelect={handleSelect}>
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        {selectedOption}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey={"Danh Sách Hóa Đơn"}>Danh Sách Hóa Đơn</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Tài Khoảng Mới"}>Tài Khoảng mới</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Tồn Kho"}>Tồn Kho</Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="select-option mb-3 me-2">
                                <Dropdown onSelect={handleSelectDay}>
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        {selectedOptionDay}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey={"Hôm Nay"}>Hôm Nay</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Hôm Qua"}>Hôm Qua</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Một Tuần"}>Một Tuần</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Một Tháng"}>Một Tháng</Dropdown.Item>
                                        <Dropdown.Item eventKey={"Tùy Chọn"}>Tùy Chọn</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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
