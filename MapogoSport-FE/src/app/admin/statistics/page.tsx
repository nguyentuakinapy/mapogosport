'use client';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
// import Form from 'react-bootstrap/Form';
import { Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure to import the styles

const PieChart = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Set Date type or null
    const [selectedDate1, setSelectedDate1] = useState<Date | null>(null); // Set Date type or null

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);  // Update state with selected date
    };
    const handleDateChange1 = (date: Date | null) => {
        setSelectedDate1(date);  // Update state with selected date
    };

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


                    <div className="select-option mb-3 ms-auto me-2">
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                <i className="bi bi-graph-up-arrow"></i> Tổng doanh thu
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-2">Tài Khoảng mới</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Other...</Dropdown.Item>
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

                {/* Pie chart */}
                <div id="piechart" className='justify-conten-center'></div>
            </div>
        </div>
    );
};

const Admin = () => {
    return (
        <Container>
            <PieChart />
        </Container>
    );
};
export default Admin;
