'use client'
import BookingChart from '@/components/Owner/Statistic/BookingChart';
import CustomerChartPage from '@/components/Owner/Statistic/CustomerChartPage';
import RevenueChart from '@/components/Owner/Statistic/RevenuaChart';
import { useState } from 'react';
import { Button, InputGroup, Nav, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <>
            <div className="card">
              <div className="card-body">
                <div className="row mt-0">
                  <div className="col-6 card-title">
                    <h4 style={{ fontSize: '20px' }}> <i className="bi bi-box"></i> Doanh thu</h4>

                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <span className="price-amount">100.000</span>
                    <span className="price-currency">VNĐ</span>
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

              </div>
            </div>
            <RevenueChart />
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thời gian</th>
                    <th>Loại sân</th>
                    <th>Tổng doanh thu</th>
                    <th>Doanh thu</th>
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
          </>
        );
      case 'deposit':
        return (
          <BookingChart />
        );
      case 'withdraw':
        return (
          <CustomerChartPage />
        );
      default:
        return (
          <div className="font-14">
            Loading...
          </div>
        );
    }
  };

  return (
    <>
      <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>THỐNG KÊ</h3>
      <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs">
        <Nav.Item>
          <Nav.Link eventKey="all" className="tab-link">Doanh thu</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="deposit" className="tab-link">Tỉ lệ sử dụng sân</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="withdraw" className="tab-link">Tương tác với khách hàng</Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="mt-3">
        {renderContent()}
      </div>
    </>

  );
}
