import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, InputGroup, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Chart } from "react-google-charts";
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

export default function BookingChart() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // Dữ liệu cho biểu đồ tỷ lệ đặt sân
  const bookingData = [
    ["Sân", "Giờ đặt sân"],
    ["Sân 5", 11],
    ["Sân 7", 2],
    ["Sân 9", 2],
    ["Sân 11", 2],
  ];

  const bookingOptions = {
    title: "Biểu đồ tỷ lệ đặt sân trung bình theo loại sân",
  };

  // Dữ liệu cho biểu đồ lịch hoạt động đặt sân
  const calendarData = [
    [{ type: "date", label: "Date" }, { type: "number", label: "Bookings" }],
    [new Date(2024, 0, 1), 5],
    [new Date(2024, 0, 2), 7],
    // Thêm dữ liệu lịch khác ở đây
  ];

  const calendarOptions = {
    title: "Lịch sử hoạt động đặt sân",
    height: 500,
  };

  return (
    <div>
      {/* Biểu đồ Calendar */}
      <div className="card">
        <div className="card-body">
          <div className="row mt-0">
            <div className="col-6 card-title">
              <h4 style={{ fontSize: '20px' }}><i className="bi bi-calendar-week-fill me-2"></i>Lịch sử hoạt động</h4>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <Chart
                chartType="Calendar"
                width="100%"
                height="200px"
                data={calendarData}
                options={calendarOptions}
              />
            </div>
          </div>
        </div>
      </div>



      {/* Biểu đồ PieChart */}

      <div className="card">
        <div className="card-body">
          <div className="row mt-0">
            <div className="col-6 card-title">
              <h4><i className="bi bi-percent"></i>Tỷ lệ hoạt động theo sân</h4>
            </div>
          </div>
          <div className="row border-bottom">
            <div className="col-3">
              <span className="price-amount">100</span>
              <span className="price-currency">lượt</span>
            </div>

            <div className="col-7 text-center">
              <InputGroup className="search-date">
                <DatePicker
                  selected={startDate || undefined}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  placeholderText="Từ ngày"
                  className="form-control start"
                />
                <InputGroup.Text><i className="bi bi-three-dots"></i></InputGroup.Text>
                <DatePicker
                  selected={endDate || undefined}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  minDate={startDate || undefined}
                  placeholderText="Đến ngày"
                  className="form-control end"
                />
              </InputGroup>
            </div>
            <div className="col-2 ">
              <Button variant="outline-dark" className='float-end' style={{ fontSize: '15px', cursor: 'pointer' }}>Export  <FontAwesomeIcon icon={faFileExport} /></Button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Chart
                chartType="PieChart"
                width="100%"
                height="300px"
                data={bookingData}
                options={bookingOptions}
              />
            </div>
          </div>
          <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thời gian</th>
                    <th>Loại sân</th>
                    <th>Tổng lượt đặt</th>
                    <th>Lượt đặt</th>
                    <th>Tỉ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                  </tr>
                </tbody>
              </Table>
            </div>
        </div>
      </div>
    </div>
  );
}
