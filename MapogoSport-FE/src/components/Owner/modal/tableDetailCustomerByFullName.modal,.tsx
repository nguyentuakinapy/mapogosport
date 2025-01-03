import { useState } from "react";
import { Modal, Spinner, Table } from "react-bootstrap";
import { formatPrice } from "@/components/Utils/Format"

interface ModalTableDetailCustomerByFullNameProps {
    showModal: boolean;
    onClose: () => void;
    data: Booking[]
}

const ModalTableDetailCustomerByFullName = ({ showModal, onClose, data }: ModalTableDetailCustomerByFullNameProps) => {
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (data)
        return (
            <Modal
                show={showModal}
                onHide={onClose}
                aria-labelledby="contained-modal-title-vcenter"
                size="lg"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className='ms-3'>
                        Chi tiết lượt đặt khách hàng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(data.length > 0) ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên khách hàng</th>
                                    <th>Mã hóa đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((booking, index) => (
                                    <tr key={index}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{booking.fullName}</td>
                                        <td>{booking.bookingId}</td>
                                        <td>{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                                        <td>{formatPrice(booking.totalAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* Table content here */}

                        </Table>
                    ) : (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="sr-only"></span>
                            </Spinner>
                        </div>
                    )}

                    <>
                        {totalPages > 1 && (
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center">
                                    {/* Nút về trang đầu tiên */}
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="First"
                                            onClick={() => handlePageChange(1)}
                                            title="Go to first page"
                                        >
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>

                                    {/* Hiển thị 5 trang tùy theo currentPage */}
                                    {Array.from({ length: totalPages }, (_, index) => {
                                        let startPage = 1;
                                        let endPage = 5;

                                        // Nếu tổng số trang lớn hơn 5
                                        if (totalPages > 5) {
                                            // Điều chỉnh để luôn hiển thị 5 trang
                                            if (currentPage > 3) {
                                                startPage = currentPage - 2;
                                                endPage = currentPage + 2;
                                                if (endPage > totalPages) {
                                                    endPage = totalPages;
                                                    startPage = totalPages - 4; // Đảm bảo vẫn hiển thị đủ 5 trang
                                                }
                                            }
                                        } else {
                                            // Nếu tổng số trang ít hơn hoặc bằng 5, hiển thị tất cả
                                            endPage = totalPages;
                                        }

                                        // Hiển thị các trang từ startPage đến endPage
                                        if (index + 1 >= startPage && index + 1 <= endPage) {
                                            return (
                                                <li
                                                    key={index + 1}
                                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                    title={`Go to page ${index + 1}`}
                                                >
                                                    <a
                                                        className="page-link"
                                                        href="#"
                                                        onClick={() => handlePageChange(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </a>
                                                </li>
                                            );
                                        }

                                        return null;
                                    })}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="Last"
                                            onClick={() => handlePageChange(totalPages)}
                                            title="Go to last page"
                                        >
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                </Modal.Body>
            </Modal>
        );
};

export default ModalTableDetailCustomerByFullName;
