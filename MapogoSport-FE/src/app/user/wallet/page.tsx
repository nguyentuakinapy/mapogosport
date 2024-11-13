'use client'
import UserLayout from "@/components/User/UserLayout";
import '../types/user.scss';
import { Nav, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useData } from "@/app/context/UserContext";
import useSWR from "swr";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { RobotoBase64 } from "../../../../public/font/Roboto-Regular";
import { toast } from "react-toastify";

const WalletPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [activeTab, setActiveTab] = useState<string>('all');
    const [transaction, setTransaction] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const userData = useData();

    const { data, error, isLoading } = useSWR(userData &&
        `http://localhost:8080/rest/wallet/transaction/${userData?.wallet.walletId}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: Transaction, b: Transaction) =>
                new Date(b.createdAt).getDate() - new Date(a.createdAt).getDate());
            setTransaction(sortedData);
        }
    }, [data]);

    const filteredTransaction = transaction?.filter(item => {
        switch (activeTab) {
            case 'received': return item.transactionType.slice(0, 1) === '+';
            case 'used': return item.transactionType.slice(0, 1) === '-';
            default: return true;
        }
    });

    const renderContent = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredTransaction.slice(indexOfFirstItem, indexOfLastItem);
        return renderTable(currentItems);
    };

    const renderTable = (currentItems: Transaction[]) => {
        return (
            <div>
                {currentItems.length > 0 ?
                    currentItems.map(item => (
                        <div className="box-wallet-container mb-2" key={item.transactionId}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="box-comment" style={{ fontSize: '15px' }}>
                                    <b>Nội dung: {item.description}</b>
                                    <div>Ngày giao dịch: {new Date(item.createdAt).toLocaleDateString('en-Gb')}</div>
                                </div>
                                <div className={`${item.transactionType.slice(0, 1) == "+" ? 'text-success' : 'text-danger'}`}>
                                    <b>{item.transactionType}</b>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="my-5 text-center">
                            Chưa có lịch sử chuyển khoản
                        </div>
                    )

                }
            </div>

        );
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNextPage = () => {
        const totalPages = Math.ceil(transaction.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const renderPagination = () => {
        const totalPages = Math.ceil(transaction.length / itemsPerPage);
        const pages = [];

        if (totalPages <= 1) return null;

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
            )
        }

        return (
            <Pagination>
                <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
        )

    };

    const exportPDF = () => {
        try {
            const doc: any = new jsPDF();

            doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");

            doc.text("Danh Sách Hóa Đơn", 14, 16);

            const tableColumn = ["STT", "Nội dung", "Số tiền", "Ngày giao dịch"];
            const tableRows: string[][] = [];

            filteredTransaction.forEach((item, index) => {
                const transactionData = [
                    `#${index + 1}`,
                    item.description,
                    item.transactionType,
                    new Date(item.createdAt).toLocaleDateString('en-GB')
                ];
                tableRows.push(transactionData);
            });

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
                    2: { halign: 'right' },
                    3: { halign: 'center' },
                },
                didParseCell: (data: any) => {
                    if (data.cell.text.length > 0) {
                        data.cell.text[0] = data.cell.text[0];
                    }
                }
            });
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day;

            doc.save(`LichSuGiaoDich-Mapogo(${formattedDay}/${formattedMonth}).pdf`);
            toast.success("Đã xuất file PDF thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình xuất file! Vui lòng thử lại sau!");
        }

    };

    if (isLoading) return <UserLayout>Đang tải...</UserLayout>;
    if (error) return <UserLayout>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Quản lý ví</b>
            <div style={{ fontSize: '15px' }}>
                <div className="box-ultil">
                    <div><b>Số dư:</b> {userData?.wallet.balance.toLocaleString()} ₫</div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-wallet">Nạp tiền</div>
                        <div className="btn-wallet" onClick={exportPDF}>Xuất file PDF</div>
                    </div>
                </div>
                <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)}
                    className="custom-tabs mb-3 mx-2">
                    <Nav.Item>
                        <Nav.Link eventKey="all" className="tab-link">Tất cả lịch sử</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="received" className="tab-link">Đã nhận</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="used" className="tab-link">Đã dùng</Nav.Link>
                    </Nav.Item>
                </Nav>
                {renderContent()}
                {renderPagination()}
            </div>
        </UserLayout>
    )
}

export default WalletPage;