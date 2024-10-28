'use client';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
// import Form from 'react-bootstrap/Form';
import { Dropdown, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure to import the styles



const Admin = () => {
    const ColumnChart = () => {
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
                    hAxis: {
                        title: 'Task',
                    },
                    vAxis: {
                        title: 'Hours per Day',
                    },
                };

                // Change PieChart to ColumnChart
                const chart = new window.google.visualization.ColumnChart(document.getElementById('columnChart') as HTMLElement);
                chart.draw(data, options);
            };

            loadGoogleCharts();
        }, []);

        return (
            <>
                <div id="columnChart" className='justify-conten-center'></div>
            </>
        )
    }

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

                const chart = new window.google.visualization.PieChart(document.getElementById('piechart') as HTMLElement);
                chart.draw(data, options);
            };

            loadGoogleCharts();
        }, []);

        return (
            <>
                {/* Pie chart */}
                <div id="piechart" className='justify-conten-center'></div>
            </>
        );
    };
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Set Date type or null
    const [selectedDate1, setSelectedDate1] = useState<Date | null>(null); // Set Date type or null
    // Tạo state để lưu trữ mục được chọn
    const [selectedOption, setSelectedOption] = useState('Tổng Doanh Thu');

    // Hàm xử lý khi người dùng chọn một mục
    const handleSelect = (eventKey) => {
        setSelectedOption(eventKey);
    };
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);  // Update state with selected date
    };
    const handleDateChange1 = (date: Date | null) => {
        setSelectedDate1(date);  // Update state with selected date
    };
    const handleFindDate = () => {
        console.log("từ ngày: ", selectedDate, "- đến ngày: ", selectedDate1);

    }
    return (
        <>
            <Container>
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 mt-3">
                    <div className="white-box">
                        <div className="d-flex">

                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}  // Corrected event handler
                                dateFormat="dd/MM/yyyy"
                                className="form-control mb-3"
                                placeholderText="từ ngày"
                                popperPlacement="bottom-end"
                                showPopperArrow={false}
                            />
                            <DatePicker
                                selected={selectedDate1}
                                onChange={handleDateChange1}
                                dateFormat="dd/MM/yyyy"
                                className="form-control ms-2"
                                placeholderText="đến ngày"
                                popperPlacement="bottom-end"
                                showPopperArrow={false}
                            />
                            <Button
                                onClick={handleFindDate}  // Corrected event handler
                                variant="outline-info"
                                className='ms-3'
                                style={{ width: "100px", height: '39px' }}>
                                <i className="bi bi-search"></i>
                            </Button>


                            <div className="select-option mb-3 ms-auto me-2">
                                <Dropdown onSelect={handleSelect}>
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        {selectedOption}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-2" className='selected' eventKey={"Tổng Doanh Thu"}>Tổng Doanh Thu</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2" eventKey={"Tài Khoảng Mới"}>Tài Khoảng mới</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3" eventKey={"Tồn Kho"}>Tồn Kho</Dropdown.Item>
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
            </Container>
        </>

    );
};
export default Admin;
