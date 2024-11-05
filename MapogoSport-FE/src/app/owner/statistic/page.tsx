'use client'
import BookingChart from '@/components/Owner/Statistic/BookingChart';
import CustomerChartPage from '@/components/Owner/Statistic/CustomerChartPage';
import RevenueChart from '@/components/Owner/Statistic/RevenuaChart';
import { useEffect, useState } from 'react';
import { Button, InputGroup, Nav, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatPrice } from "@/components/Utils/Format"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<Booking[]>([]);
  const [revenueByDate, setRevenueByDate] = useState<number | null>(null);
  const [sportFieldByOwner, setSportFieldByOwner] = useState<SportField[]>([]);
  const [bookingdetailBySportField, setBookingdetailBySportField] = useState<BookingDetail[]>([])
  const [owner, setOwner] = useState<Owner>();
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [selectSportFieldDetail, setSelectSportFieldDetail] = useState<any>([]);
  const [sportFieldDetailIds, setSportFieldDetailIds] = useState<number[]>([]);
  const [revenueBySportFieldDetail, setRevenueBySportFieldDetail] = useState<any>([])

  // Định nghĩa hàm getOwner
  const getOwner = async () => {
    const user = sessionStorage.getItem('user');

    if (user) {
      const parsedUserData = JSON.parse(user) as User;
      const responseOwner = await fetch(`http://localhost:8080/rest/owner/${parsedUserData.username}`);
      if (!responseOwner.ok) {
        throw new Error('Error fetching data');
      }
      const dataOwner = await responseOwner.json() as Owner;
      setOwner(dataOwner);
    }
  };

  useEffect(() => {
    getOwner(); // Gọi hàm getOwner trong useEffect
  }, []);

  console.log(owner?.ownerId);


  // Fetch success booking revenue 
  useEffect(() => {
    if (owner?.ownerId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/booking/successful/revenue/Đã thanh toán/${owner.ownerId}`);
          if (!response.ok) {
            throw new Error('Error fetching data');
          }
          const data = await response.json();
          setBookingSuccess(data);
          console.log("Booking Success Data:", data);
        } catch (error) {
          console.log("Error fetching revenue", error);
        }
      };
      fetchData();
    }
  }, [owner]);

  // Fetch sportField by Owner
  useEffect(() => {
    if (owner?.ownerId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/sport_field_by_owner/${owner.ownerId}`);
          if (!response.ok) {
            throw new Error('Error fetching data');
          }
          const data = await response.json();
          setSportFieldByOwner(data);
          console.log("Field Owner Data:", data);
        } catch (error) {
          console.log("Error fetching sport field data", error);
        }
      };
      fetchData();
    }
  }, [owner]);

  useEffect(() => {
    if (sportFieldByOwner.length > 0) {
      setSelectedFieldId(sportFieldByOwner[0].sportFieldId);
    }
  }, [sportFieldByOwner]);

  //Fetch sportFieldDetail by sportFieldID

  useEffect(() => {
    if (selectedFieldId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/sport_field/${selectedFieldId}`);
          const data = await response.json();
          setSelectSportFieldDetail(data);
          console.log("sportFieldDetail", data);
          // Lấy mảng các sportFielDetailId và lưu vào state sportFieldDetailIds
          const ids = data.sportFielDetails.map((detail: any) => detail.sportFielDetailId);
          setSportFieldDetailIds(ids); // Lưu các ID vào sportFieldDetailIds
          console.log("sportFieldDetailIds:", ids);

        } catch (error) {
          console.log("error fetch bookingdetail", error);
        }
      };
      fetchData();
    }
  }, [selectedFieldId]);

  console.log("hiiiiiiiiiiiiiiii", sportFieldDetailIds)

  //Fetch bookingdetail by sportField and ownerId
  useEffect(() => {
    if (owner?.ownerId && sportFieldDetailIds.length > 0) {
      const fetchData = async () => {
        try {
          const idsString = sportFieldDetailIds.join(',');
          const response = await fetch(`http://localhost:8080/rest/bookingdetail/booking/bysportField/byowner/${idsString}/${owner?.ownerId}`);
          const data = await response.json();
          setBookingdetailBySportField(data)
          console.log("bookingDetail", data)
        } catch (error) {
          console.log("error fetch bookingdetail", error)
        }
      }
      fetchData()
    }
  }, [owner?.ownerId, sportFieldDetailIds])

  //Fetch data revenueField by sportFieldDetail

  useEffect(() => {
    if (sportFieldDetailIds.length > 0) {
      const fetchData = async () => {
        try {
          const idsString = sportFieldDetailIds.join(',');
          const response = await fetch(`http://localhost:8080/rest/bookingdetail/booking/bysportFieldDetail/${idsString}`);
          const data = await response.json();
          setRevenueBySportFieldDetail(data)
          console.log("revenuedata oooooooooooooooooooo", data)
        } catch (error) {
          console.log("error fetch ", error)
        }
      }
      fetchData()
    }
  }, [sportFieldDetailIds])


  // Calculate total price from booking details
  const totalBookingPrice = bookingdetailBySportField.reduce((total, bookingDetail) => {
    return total + bookingDetail.price;
  }, 0);

  //Calculate total totalAmount from booking
  const totalAmountBooking = bookingSuccess.reduce((totalAmount, booking) => {
    return totalAmount + booking.totalAmount
  }, 0)

  console.log("id spf", selectedFieldId)


  console.log('sate', startDate);
  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <>
            <div className="card">
              <div className="card-body">
                <div className="row mt-0">
                  <div className="col-6 card-title d-flex">
                    <h4 style={{ fontSize: '20px', marginTop: '5px' }}> <i className="bi bi-box"></i> Doanh thu  /</h4>

                    <select
                      name="sportField"
                      id="sportField"
                      style={{ padding: '5px 7px 7px 7px', borderRadius: '5px', marginLeft: '10px', fontWeight: 'bold' }}
                      onChange={(e) => {
                        setSelectedFieldId(Number(e.target.value));
                        console.log('Selected Sport Field ID:', selectedFieldId);
                      }}
                      value={selectedFieldId || ''}
                    >
                      {sportFieldByOwner.map((field, index) => (
                        <option key={`${field.categoriesField}-${index}`} value={field.sportFieldId}>
                          {field.name}
                        </option>
                      ))}
                    </select>


                  </div>
                  <div className="col-6 card-title text-end " style={{ fontSize: '20px' }}>

                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <span className="price-amount">{formatPrice(totalAmountBooking)} /</span>
                    <span className="price-currency">{formatPrice(totalBookingPrice)}</span>
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

//Fetch sum revenue by Date
// useEffect(() => {
//   if (startDate) {
//     const fetchData = async () => {
//       try {

//         const response = await fetch(
//           `http://localhost:8080/rest/booking/success/revenue/byDate/2/2/${startDate.toISOString().split('T')[0]}${endDate ? '/' + endDate.toISOString().split('T')[0] : ''}`
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const text = await response.text();
//         console.log('Raw Response:', text);

//         // Check if the response is empty
//         if (text.trim() === '') {
//           console.warn('Empty response received');
//           setRevenueByDate(null); // or set a default value if needed
//         } else {
//           const data = JSON.parse(text);
//           setRevenueByDate(data);
//           console.log('Revenue By Date:', data);
//         }
//       } catch (error) {
//         console.error('Error fetching revenue by date:', error);
//       }
//     };
//     fetchData();
//   }
// }, [startDate, endDate]);

//Fetch sportField by Owner