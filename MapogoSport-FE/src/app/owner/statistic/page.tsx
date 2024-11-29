'use client'
import BookingChart from '@/components/Owner/Statistic/BookingChart';
import RevenueChart from '@/components/Owner/Statistic/RevenuaChart';
import { useEffect, useState } from 'react';
import { InputGroup, Nav, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { decodeString, formatPrice } from "@/components/Utils/Format"
import ModalTableDetail from '@/components/Owner/modal/tableDetailStatictis.modal';
import CustomerLineChart from '@/components/Owner/Statistic/CustomerLineChart';
import ModalTableDetailCustomer from '@/components/Owner/modal/tableDetailCustomer.modal';
import ModalTableDetailCustomerByFullName from '@/components/Owner/modal/tableDetailCustomerByFullName.modal,';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { RobotoBase64 } from '../../../../public/font/Roboto-Regular';
import { toast } from 'react-toastify';



export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeTabCustomer, setActiveTabCustomer] = useState('offline');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<Booking[]>([]);
  const [sportFieldByOwner, setSportFieldByOwner] = useState<SportField[]>([]);
  const [bookingdetailBySportField, setBookingdetailBySportField] = useState<BookingDetail[]>([])
  const [owner, setOwner] = useState<Owner>();
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  // const [selectSportFieldDetail, setSelectSportFieldDetail] = useState<any>([]);
  const [sportFieldDetailIds, setSportFieldDetailIds] = useState<number[]>([]);
  // const [revenueBySportFieldDetail, setRevenueBySportFieldDetail] = useState<any>([])
  const [chartData, setChartData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  // const [idSportFieldDetailTable, setIdSportFieldDetailTable] = useState<number | null>(null);
  const [bookingDetailBySpFDetail, setBookingDetailBySpFDetail] = useState<BookingDetail[]>([]);
  // by Date
  const [bookingSuccessByDate, setBookingSuccessByDate] = useState<Booking[]>([]);
  const [bookingdetailBySportFieldByDate, setBookingdetailBySportFieldByDate] = useState<BookingDetail[]>([])
  //chart customer
  const [totalCustomer, setTotalCustomer] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [rankCustomerOffline, setRankCustomerOffline] = useState<any[]>([])
  const [rankCustomerOnline, setRankCustomerOnline] = useState<any[]>([])
  // const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [showModalRank, setShowModalRank] = useState(false);
  const [showModalRankOffline, setShowModalRankOffline] = useState(false);
  const [bookingByUsernameModal, setBookingByUsernameModal] = useState<Booking[]>([])
  const [bookingByFullNameOffline, setBookingByFullNameOffline] = useState<Booking[]>([])
  // Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //Offline
  const currentItems = rankCustomerOffline.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rankCustomerOffline.length / itemsPerPage);
  //Online
  const currentItemsOnline = rankCustomerOnline.slice(indexOfFirstItem, indexOfLastItem);
  const totalPagesOnline = Math.ceil(rankCustomerOnline.length / itemsPerPage);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTabCustomer])
  const years = Array.from(new Array(10), (val, index) => currentYear - index);

  // Definition getOwner function
  const getOwner = async () => {
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      const responseOwner = await fetch(`http://localhost:8080/rest/owner/${decodeString(storedUsername)}`);
      if (!responseOwner.ok) {
        throw new Error('Error fetching data');
      }
      const dataOwner = await responseOwner.json() as Owner;
      setOwner(dataOwner);
    }
  };

  useEffect(() => {
    getOwner(); // Call  getOwner function in useEffect
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

  const bookingIds = bookingSuccess.map(booking => booking.bookingId);
  const bookingIdsString = bookingIds.join(',');
  console.log("id Booking theo owner", bookingIdsString)


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

  // Get element first of sportField base select sportfieldetail
  useEffect(() => {
    if (sportFieldByOwner.length > 0) {
      setSelectedFieldId(sportFieldByOwner[0].sportFieldId);
    } else {
      setSelectedFieldId(null);
    }
  }, [sportFieldByOwner]);

  //Fetch sportFieldDetail by sportFieldID

  useEffect(() => {
    if (selectedFieldId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/sport_field/${selectedFieldId}`);
          const data = await response.json();
          // setSelectSportFieldDetail(data);
          console.log("sportFieldDetail", data);
          // Get array sportFielDetailId and save in state sportFieldDetailIds
          const ids = data.sportFielDetails.map((detail: any) => detail.sportFielDetailId);
          setSportFieldDetailIds(ids); // Save ID in sportFieldDetailIds
          console.log("sportFieldDetailIds:", ids);
        } catch (error) {
          console.log("error fetch bookingdetail", error);
          // setSelectSportFieldDetail([]);
          setSportFieldDetailIds([]);
        }
      };
      fetchData();
    } else {
      // setSelectSportFieldDetail([]);
      setSportFieldDetailIds([]);
    }
  }, [selectedFieldId]);

  console.log("hiiiiiiiiiiiiiiii", sportFieldDetailIds);

  //Fetch bookingdetail by sportField and ownerId
  useEffect(() => {
    if (owner?.ownerId && sportFieldDetailIds.length > 0 && bookingIdsString) {
      const fetchData = async () => {
        try {
          const idsString = sportFieldDetailIds.join(',');
          const response = await fetch(`http://localhost:8080/rest/bookingdetail/booking/bysportField/byowner/${idsString}/${bookingIdsString}/Đã hoàn thành,Chưa bắt đầu`);
          const data = await response.json();
          setBookingdetailBySportField(data);
          console.log("bookingDetail", data);
        } catch (error) {
          console.log("error fetch bookingdetail", error);
          setBookingdetailBySportField([]);
        }
      };
      fetchData();
    } else {
      setBookingdetailBySportField([]);
    }
  }, [owner?.ownerId, sportFieldDetailIds, bookingIdsString]);


  //Calculate total price from booking details
  const totalBookingPrice = bookingdetailBySportField.reduce((total, bookingDetail) => {
    return total + bookingDetail.price;
  }, 0);

  //Fetch data revenueField by sportFieldDetail

  useEffect(() => {
    if (sportFieldDetailIds.length > 0 && bookingIdsString) {
      const fetchData = async () => {
        try {
          const idsString = sportFieldDetailIds.join(',');
          const response = await fetch(`http://localhost:8080/rest/bookingdetail/booking/bysportFieldDetail/${idsString}/${bookingIdsString}/Đã hoàn thành,Chưa bắt đầu`);
          const data = await response.json();
          const formattedData = [
            ["Field", "Revenue", "StarDate", "EndDate", "IdSportFieldDetail"],
            ...data.map((item: any) => [item[0], item[1], item[2], item[3], item[4]])
          ];
          setChartData(formattedData);
          console.log("revenuedata oooooooooooooooooooo", data);
        } catch (error) {
          console.log("error fetch ", error);
          setChartData([["Field", "Revenue", "StarDate", "EndDate", "IdSportFieldDetail"]]);
        }
      };
      fetchData();
    } else {
      setChartData([["Field", "Revenue", "StarDate", "EndDate", "IdSportFieldDetail"]]);
    }
  }, [sportFieldDetailIds, bookingIdsString]);



  //Calculate total totalAmount from booking
  const totalAmountBooking = bookingSuccess.reduce((totalAmount, booking) => {
    return totalAmount + booking.totalAmount
  }, 0)



  // Revenue by Date

  // Fetch booking success by Date
  useEffect(() => {
    if (owner?.ownerId) {
      const fetchData = async () => {
        try {
          // Set endDate to startDate if only startDate is provided
          const effectiveEndDate = endDate || startDate;

          const formatDate = (date: Date | null) => {
            if (!date) return '';
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            return utcDate.toISOString().split('T')[0];
          };

          const response = await fetch(
            `http://localhost:8080/rest/booking/success/revenue/byDate/Đã thanh toán/${owner?.ownerId}/${formatDate(startDate)}${effectiveEndDate ? '/' + formatDate(effectiveEndDate) : ''}`
          );

          if (!response.ok) {
            throw new Error('Error fetching data');
          }

          const data = await response.json();
          if (!data || data.length === 0) {
            console.log("No booking success data available");
            setBookingSuccessByDate([]);
          } else {
            setBookingSuccessByDate(data);
            console.log("Booking Success Data By Date:", data);
          }
        } catch (error) {
          console.log("Error fetching revenue", error);
          setBookingSuccessByDate([]);
        }
      };
      fetchData();
    } else {
      setBookingSuccessByDate([]);
    }
  }, [owner, startDate, endDate]);

  const bookingIdsDate = bookingSuccessByDate.map(booking => booking.bookingId);
  const bookingIdsStringDate = bookingIdsDate.join(',');
  console.log("id Booking theo owner by Date", bookingIdsStringDate)

  //Calculate total totalAmount from booking
  const totalAmountBookingByDate = bookingSuccessByDate.reduce((totalAmount, booking) => {
    return totalAmount + booking.totalAmount
  }, 0)

  console.log(totalAmountBookingByDate)
  // Fetch bookingdetail by sportField and ownerId by Date
  useEffect(() => {
    if (owner?.ownerId && sportFieldDetailIds.length > 0 && bookingIdsStringDate) {
      const fetchData = async () => {
        try {
          // Ensure endDate is set to startDate if only startDate is provided
          const effectiveEndDate = endDate || startDate;

          // Helper function to format date to UTC and only include YYYY-MM-DD
          const formatDate = (date: Date | null) => {
            if (!date) return '';
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            return utcDate.toISOString().split('T')[0];
          };

          // Create a comma-separated string of IDs for the API request
          const idsString = sportFieldDetailIds.join(',');

          // Fetch data from the API
          const response = await fetch(
            `http://localhost:8080/rest/bookingDetail/byOwner/bySportField/byDate/${idsString}/${bookingIdsStringDate}/Đã hoàn thành,Chưa bắt đầu/${formatDate(startDate)}${effectiveEndDate ? '/' + formatDate(effectiveEndDate) : ''}`
          );

          if (!response.ok) {
            throw new Error('Error fetching booking details');
          }

          const data = await response.json();
          if (!data || data.length === 0) {
            console.log("No booking details available");
            setBookingdetailBySportFieldByDate([]);
          } else {
            setBookingdetailBySportFieldByDate(data);
            console.log("Booking Detail by Date:", data);
          }
        } catch (error) {
          console.error("Error fetching booking details:", error);
          setBookingdetailBySportFieldByDate([]);
        }
      };

      fetchData();
    } else {
      setBookingdetailBySportFieldByDate([]);
    }
  }, [owner?.ownerId, sportFieldDetailIds, bookingIdsStringDate, startDate, endDate]);

  // Calculate total price from booking details
  const totalBookingDetailPriceByDate = bookingdetailBySportFieldByDate.reduce((total, bookingDetail) => {
    return total + bookingDetail.price;
  }, 0);

  //Fetch data revenueField by sportFieldDetail by Date

  useEffect(() => {
    if (sportFieldDetailIds.length > 0 && bookingIdsStringDate) {
      const fetchData = async () => {
        try {
          // Set endDate to startDate if only startDate is provided
          const effectiveEndDate = endDate || startDate;

          // Helper function to format date to UTC and only include YYYY-MM-DD
          const formatDate = (date: Date | null) => {
            if (!date) return '';
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            return utcDate.toISOString().split('T')[0];
          };

          const idsString = sportFieldDetailIds.join(',');
          const response = await fetch(`http://localhost:8080/rest/bookingDetail/bySportField/byDate/${idsString}/${bookingIdsStringDate}/Đã hoàn thành,Chưa bắt đầu/${formatDate(startDate)}${effectiveEndDate ? '/' + formatDate(effectiveEndDate) : ''}`);
          const data = await response.json();

          if (!data || data.length === 0) {
            console.log("No data available");
            setChartData([["Field", "Revenue", "StarDate", "EndDate", "IdSportFieldDetail"]]);
          } else {
            const formattedData = [
              ["Field", "Revenue", "StarDate", "EndDate", "IdSportFieldDetail"],
              ...data.map((item: any) => [item[0], item[1], item[2], item[3], item[4]])
            ];
            setChartData(formattedData);
            console.log("revenuedata oooooooooooooooooooo", data);
          }
        } catch (error) {
          console.log("error fetch ", error);
          setChartData([["Field", "Revenue", "StarDate", "EndDate", "IdSportFieldDetail"]]);
        }
      };
      fetchData();
    } else {
      setChartData([["Field", "Revenue", "StarDate", "EndDate", "IdSportFieldDetail"]]);
    }
  }, [sportFieldDetailIds, bookingIdsStringDate, startDate, endDate]);

  // Function handel detail table

  const handleOpenModal = (id: number) => {
    setShowModal(true);
    console.log('chartData:', chartData);
    console.log('totalBookingPrice:', totalBookingPrice);
    console.log("idSportFieldDetailTable", id);

    if (startDate || endDate) {
      // Fetch modal data based on the provided id and date range
      const fetchModalDataByDate = async () => {
        try {
          const effectiveEndDate = endDate || startDate;
          const formatDate = (date: Date | null) => {
            if (!date) return '';
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            return utcDate.toISOString().split('T')[0];
          };

          const response = await fetch(
            `http://localhost:8080/rest/bookingdetail/bysportFieldDetailAndDate/${id}/${bookingIdsString}/Đã hoàn thành,Chưa bắt đầu/${formatDate(startDate)}${effectiveEndDate ? '/' + formatDate(effectiveEndDate) : ''}`
          );
          const data = await response.json();
          setBookingDetailBySpFDetail(data); // Store modal-specific data
          console.log("Booking Detail by SportFieldDetail for Modal by Date", data);
        } catch (error) {
          console.log("Error fetching modal booking details by date", error);
        }
      };

      fetchModalDataByDate();
    } else {
      // Fetch modal data based on the provided id
      const fetchModalData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/bookingdetail/bysportFieldDetail/${id}/${bookingIdsString}/Đã hoàn thành,Chưa bắt đầu`);
          const data = await response.json();
          setBookingDetailBySpFDetail(data); // Store modal-specific data
          console.log("Booking Detail by SportFieldDetail for Modal", data);
        } catch (error) {
          console.log("Error fetching modal booking details", error);
        }
      };

      fetchModalData();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBookingDetailBySpFDetail([]);
  }

  console.log("id spf", selectedFieldId)


  console.log('sate', startDate);

  //char Customer

  //Fetch totalCustomer by OwnerId from Booking
  useEffect(() => {
    if (owner?.ownerId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/booking/byOwnerId/totalCustomer/${owner?.ownerId}`)
          const data = await response.json();
          setTotalCustomer(data);
          console.log("Tổng khách hàng", data)
        } catch (error) {
          console.log("Lỗi khi lấy data totalCustomer", error)
        }
      }
      fetchData()
    }
  }, [owner?.ownerId])

  // handle year
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Fetch customer by month

  useEffect(() => {
    if (owner?.ownerId && selectedYear) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/booking/customerByMonth/byOwnerId/${selectedYear}/${owner.ownerId}`)
          const data = await response.json();
          const formattedData = [
            ['Month', 'Customers'], // Header for the chart
            ...Object.entries(data).map(([month, count]) => [parseInt(month), count])
          ];
          setCustomerData(formattedData)
          console.log("cusssssssssssssssssssssssssss", formattedData)
        } catch (error) {
          console.log("Lỗi fetch data của customer by month", error)
        }
      }
      fetchData()
    }
  }, [owner?.ownerId, selectedYear])

  //Fetch rank customer offline
  useEffect(() => {
    if (owner?.ownerId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/booking/customer/byOwner/byUsernameOffline/${owner?.ownerId}`)
          const data = await response.json()
          setRankCustomerOffline(data)
        } catch (error) {
          console.log("Error fetch data rank customer", error)
        }
      }
      fetchData()
    }
  }, [owner?.ownerId])

  //Fetch rank customer online 
  useEffect(() => {
    if (owner?.ownerId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/rest/booking/rank/customer/online/byOwerId/${owner?.ownerId}`)
          const data = await response.json()
          setRankCustomerOnline(data)

        } catch (error) {
          console.log("Error fetch data rank customer", error)
        }
      }
      fetchData()
    }
  }, [owner?.ownerId])

  // Detail modal rank by username
  const handleOpenModalRank = (username: string) => {
    console.log("username", username)
    setShowModalRank(true);
    // Fetch modal data based on the provided username
    const fetchModalData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/rest/booking/rank/customer/online/${username}`);
        const data = await response.json();
        setBookingByUsernameModal(data); // Store modal-specific data
        console.log("Booking Detail Customer", data);
      } catch (error) {
        console.log("Error fetching modal booking details", error);
      }
    };
    fetchModalData();
  };

  const handleCloseModalRank = () => {
    setShowModalRank(false);
    setBookingByUsernameModal([]);
  }

  //Detail modal rank by fullname
  const handleOpenModalRankOffline = (fullname: string) => {
    console.log("fullName", fullname)
    setShowModalRankOffline(true);
    // Fetch modal data based on the provided username
    const fetchModalData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/rest/booking/detail/tableCustomer/byFullname/${fullname}`);
        const data = await response.json();
        setBookingByFullNameOffline(data); // Store modal-specific data
        console.log("Booking Detail Customer Rank Offline", data);
      } catch (error) {
        console.log("Error fetching modal booking details", error);
      }
    };
    fetchModalData();
  };

  const handleCloseModalRankOffline = () => {
    setShowModalRankOffline(false);
    setBookingByFullNameOffline([]);
  }

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Loại sản phẩm');

      worksheet.columns = [
        { header: 'Số thứ tự', key: 'stt', width: 15 },
        { header: 'Thời gian', key: 'time', width: 25 },
        { header: 'Tên sân', key: 'name', width: 15 },
        { header: 'Tổng doanh thu', key: 'totalRevenue', width: 20 },
        { header: 'Doanh thu', key: 'revenue', width: 20 },
        { header: 'Tỉ lệ', key: 'rate', width: 20 },
      ];

      chartData.slice(1).forEach((field, index) => {
        worksheet.addRow({
          stt: `#${index + 1}`,
          time: `${new Date(field[2]).toLocaleDateString('en-GB')} / ${new Date(field[3]).toLocaleDateString('en-GB')}`,
          name: field[0],
          totalRevenue: formatPrice(totalBookingPrice),
          revenue: formatPrice(field[1]),
          rate: `${(field[1] / totalBookingPrice * 100).toFixed(1)}%`,
        });
      });

      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Doanh thu.xlsx');
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  const exportPDF = () => {
    try {
      const doc: any = new jsPDF();

      doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.setFont("Roboto");

      doc.text("Danh Sách Doanh Thu", 14, 16);
      const tableColumn = ["Số thứ tự", "Thời gian", "Tên sân", "Tổng doanh thu", "Doanh thu", "Tỉ lệ"];
      const tableRows: string[][] = [];

      chartData.slice(1).forEach((field, index) => {
        const revenueData = [
          `#${index + 1}`,
          `${new Date(field[2]).toLocaleDateString('en-GB')} / ${new Date(field[3]).toLocaleDateString('en-GB')}`,
          field[0],
          formatPrice(totalBookingPrice),
          formatPrice(field[1]),
          `${(field[1] / totalBookingPrice * 100).toFixed(1)}%`,
        ];
        tableRows.push(revenueData);
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
            5: { halign: 'left' },
          },
          didParseCell: (data: any) => {
            if (data.cell.text.length > 0) {
              data.cell.text[0] = data.cell.text[0];
            }
          }
        });
      });



      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;

      doc.save(`QuanLyLoai-Mapogo(${formattedDay}/${formattedMonth}).pdf`);
      toast.success("Đã xuất file PDF thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình xuất file! Vui lòng thử lại sau!");
      console.log(error)
    }

  };

  // File customer
  const exportExcelCustomer = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Loại sản phẩm');

      worksheet.columns = [
        { header: 'Số thứ tự', key: 'stt', width: 15 },
        { header: 'Tháng', key: 'time', width: 25 },
        { header: 'Số lượng khách hàng', key: 'customer', width: 15 },
      ];

      customerData.slice(1).forEach((field, index) => {
        worksheet.addRow({
          stt: `#${index + 1}`,
          time: field[0],
          customer: field[1],
        });
      });

      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Thống kê khách.xlsx');
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  const exportPDFCustomer = () => {
    try {
      const doc: any = new jsPDF();

      doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.setFont("Roboto");

      doc.text("Danh Sách Customer", 14, 16);
      const tableColumn = ["Số thứ tự", "Tháng", "Số lượng khách hàng"];
      const tableRows: string[][] = [];

      customerData.slice(1).forEach((field, index) => {
        const revenueData = [
          `#${index + 1}`,
          field[0],
          field[1],
        ];
        tableRows.push(revenueData);
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
          },
          didParseCell: (data: any) => {
            if (data.cell.text.length > 0) {
              data.cell.text[0] = data.cell.text[0];
            }
          }
        });
      });



      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;

      doc.save(`Thống kê khách hàng-Mapogo(${formattedDay}/${formattedMonth}).pdf`);
      toast.success("Đã xuất file PDF thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình xuất file! Vui lòng thử lại sau!");
      console.log(error)
    }

  };

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <>
            <ModalTableDetail showModal={showModal} onClose={handleCloseModal} data={bookingDetailBySpFDetail} />
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
                    <span className="price-amount">Tổng doanh thu: {formatPrice(
                      startDate || endDate ? totalAmountBookingByDate ?? 0 : totalAmountBooking
                    )} </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3 mt-2">
                    <span className="price-amount">Doanh thu theo khu vực: {formatPrice(
                      startDate || endDate ? totalBookingDetailPriceByDate ?? 0 : totalBookingPrice
                    )} </span>
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
                        dateFormat={"dd/MM/yyyy"}
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
                        dateFormat={"dd/MM/yyyy"}
                      />
                    </InputGroup>
                  </div>
                  <div className="col-2 d-flex align-items-center float-end">
                    <select
                      className="form-select float-end"
                      style={{ fontSize: '15px', cursor: 'pointer' }}
                      aria-label="Export format"
                      onChange={(e) => {
                        if (e.target.value === 'excel') {
                          exportExcel();
                        } else if (e.target.value === 'pdf') {
                          exportPDF();
                        }
                      }}
                    >
                      <option value="">Xuất file </option>
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                    </select>
                    {/* <Button variant="outline-dark">Export</Button> */}
                  </div>


                </div>

              </div>
            </div>
            <RevenueChart data={chartData} />
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thời gian</th>
                    <th>Tên sân</th>
                    <th>Tổng doanh thu</th>
                    <th>Doanh thu</th>
                    <th>Tỉ lệ</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.slice(1).map((field, index) => {
                    const isDateSelected = startDate || endDate;
                    const displayDate = startDate || endDate
                      ? `${startDate ? new Date(startDate).toLocaleDateString('en-GB') : ''} / ${endDate ? new Date(endDate).toLocaleDateString('en-GB') : ''}`
                      : `${new Date(field[2]).toLocaleDateString('en-GB')} / ${new Date(field[3]).toLocaleDateString('en-GB')}`;
                    const displayTotalBookingPrice = isDateSelected ? totalBookingDetailPriceByDate : totalBookingPrice;
                    const displayFieldRevenue = isDateSelected ? field[1] : field[1];
                    return (

                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {displayDate}
                        </td>
                        <td>{field[0]}</td>
                        <td>{formatPrice(displayTotalBookingPrice)}</td>
                        <td>{formatPrice(displayFieldRevenue)}</td>
                        <td>{(displayFieldRevenue / displayTotalBookingPrice * 100).toFixed(1)}%</td>
                        <td>
                          <button
                            style={{ cursor: 'pointer' }}
                            className="bg-success border-0"
                            onClick={
                              () => {
                                handleOpenModal(field[4])
                              }
                            }
                          >
                            <i className="bi bi-eye-fill text-light"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </>
        );
      case 'deposit':
        return (
          <>
            <BookingChart />
          </>

        );
      case 'withdraw':
        return (
          <>
            {/* Nội dung chính của switch 'withdraw' */}
            <ModalTableDetailCustomer showModal={showModalRank} onClose={handleCloseModalRank} data={bookingByUsernameModal} />
            <ModalTableDetailCustomerByFullName showModal={showModalRankOffline} onClose={handleCloseModalRankOffline} data={bookingByFullNameOffline} />
            <div className="card mb-3">
              <div className="card-body">
                <div className="row mt-0">
                  <div className="col-10 card-title d-flex">
                    <h4 style={{ fontSize: '20px', marginTop: '5px' }}> <i className="bi bi-box"></i> Khách hàng </h4>
                  </div>
                  <div className="col-2">
                    <div className="col d-flex align-items-center float-end">
                      <select
                        className="form-select float-end"
                        style={{ fontSize: '15px', cursor: 'pointer' }}
                        aria-label="Export format"
                        onChange={(e) => {
                          if (e.target.value === 'excel') {
                            exportExcelCustomer();
                          } else if (e.target.value === 'pdf') {
                            exportPDFCustomer();
                          }
                        }}
                      >
                        <option value="">Xuất file </option>
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                      </select>
                      {/* <Button variant="outline-dark">Export</Button> */}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <span className="price-amount">Tổng có {totalCustomer} khách hàng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê khách hàng */}
            <div className='row'>
              <div className="row mt-0">
                <div className="col-10 card-title d-flex">
                  <h4>Thống kê khách hàng</h4>
                </div>
                <div className="col-2 card-title text-end" style={{ fontSize: '20px' }}>
                  <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <CustomerLineChart data={customerData} />

            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tháng</th>
                    <th>Số lượng khách</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.slice(1).map((field, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{field[0]}</td>
                      <td>{field[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div>
              <h4 className='bg-dark text-light p-3'><i className="bi bi-graph-down me-2"></i>Bảng xếp hạng khách hàng</h4>

              {/* Nav Tab */}
              <Nav variant="pills" activeKey={activeTabCustomer} onSelect={(selectedKey) => setActiveTabCustomer(selectedKey as string)} className="custom-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="offline" className="tab-link">Khách hàng đặt Offline</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="online" className="tab-link">Khách hàng đặt Online</Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Nội dung Tab */}
              <div className="tab-content mt-3">
                {activeTabCustomer === "offline" && (
                  <div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Họ và tên khách hàng</th>
                          <th>Lượt đặt</th>
                          <th>Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((field, index) => (
                          <tr key={index}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{field[2]}</td>
                            <td>{field[0]}</td>
                            <td>
                              <button
                                style={{ cursor: 'pointer' }}
                                className="bg-success border-0"
                                onClick={() => handleOpenModalRankOffline(field[2])}
                              >
                                <i className="bi bi-eye-fill text-light"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                          {/* First Page */}
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" style={{ cursor: 'pointer' }} aria-label="First" onClick={() => handlePageChange(1)} title="Go to first page">
                              <span aria-hidden="true">&laquo;</span>
                            </a>
                          </li>

                          {/* Page Numbers */}
                          {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            return (
                              pageNumber >= Math.max(1, currentPage - 2) && pageNumber <= Math.min(totalPages, currentPage + 2) && (
                                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                  <a className="page-link" style={{ cursor: 'pointer' }} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</a>
                                </li>
                              )
                            );
                          })}

                          {/* Last Page */}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" style={{ cursor: 'pointer' }} aria-label="Last" onClick={() => handlePageChange(totalPages)} title="Go to last page">
                              <span aria-hidden="true">&raquo;</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                )}
                {activeTabCustomer === "online" && (
                  <div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Họ và tên khách hàng</th>
                          <th>Lượt đặt</th>
                          <th>Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItemsOnline.map((field, index) => (
                          <tr key={index}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{field[2]}</td>
                            <td>{field[0]}</td>
                            <td>
                              <button
                                style={{ cursor: 'pointer' }}
                                className="bg-success border-0"
                                onClick={() => handleOpenModalRank(field[1])}
                              >
                                <i className="bi bi-eye-fill text-light"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {/* Pagination */}
                    {totalPagesOnline > 1 && (
                      <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                          {/* First Page */}
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" style={{ cursor: 'pointer' }} aria-label="First" onClick={() => handlePageChange(1)} title="Go to first page">
                              <span aria-hidden="true">&laquo;</span>
                            </a>
                          </li>

                          {/* Page Numbers */}
                          {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            return (
                              pageNumber >= Math.max(1, currentPage - 2) && pageNumber <= Math.min(totalPagesOnline, currentPage + 2) && (
                                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                  <a className="page-link" style={{ cursor: 'pointer' }} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</a>
                                </li>
                              )
                            );
                          })}

                          {/* Last Page */}
                          <li className={`page-item ${currentPage === totalPagesOnline ? 'disabled' : ''}`}>
                            <a className="page-link" style={{ cursor: 'pointer' }} aria-label="Last" onClick={() => handlePageChange(totalPagesOnline)} title="Go to last page">
                              <span aria-hidden="true">&raquo;</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
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