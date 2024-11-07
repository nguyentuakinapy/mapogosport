import * as XLSX from 'xlsx';

const exportToExcel = (selectedOptionDay, orderOptions, chartOptions, filename = 'data.xlsx') => {
    // Lấy dữ liệu của `selectedOptionDay` từ `orderOptions` và `chartOptions`
    const selectedOrder = orderOptions.find(option => option.option === selectedOptionDay);
    const selectedChart = chartOptions.find(option => option.option === selectedOptionDay);

    // Tạo dữ liệu cho trang tính LisOrder
    const orderSheetData = [
        ["STT", "Tên Khách Hàng", "Số Điện Thoại", "Ngày mua", "Trạng thái", "Tiền"],
        ...(selectedOrder?.data || []).map((order, index) => [
            index + 1,
            order.user?.fullname || 'Chưa có tên',
            order.phoneNumber || 'Chưa có số điện thoại',
            order.date,
            order.status,
            order.amount,
        ])
    ];
    const orderSheet = XLSX.utils.aoa_to_sheet(orderSheetData);

    // Tạo dữ liệu cho trang tính ChartData
    const chartSheetData = [
        ["Category", "Color", "Total"],
        ...(selectedChart?.data.slice(1) || [])
    ];
    const chartSheet = XLSX.utils.aoa_to_sheet(chartSheetData);

    // Tạo workbook và thêm các sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, orderSheet, 'LisOrder');
    XLSX.utils.book_append_sheet(workbook, chartSheet, 'ChartData');

    // Tải file về
    XLSX.writeFile(workbook, filename); // Kích hoạt tải xuống file
};

export default exportToExcel;
