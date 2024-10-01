'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Col, Row, Image } from "react-bootstrap";
import '../../types/user.scss'
import { useState } from "react";

const WishListProduct = () => {
    const [rating, setRating] = useState<number>(1.5);
    const [stadiums, setStadiums] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6; //Số lượng sân mỗi trang

    // useEffect(() => {
    //     const fetchSportField = async () => {
    //         try {
    //             const response = await fetch('/api/...'); // Gọi API từ database
    //             const data = await response.json();
    //             setStadium(data.stadiums);
    //         } catch (error) {
    //             console.error('Lỗi:', error);
    //         }
    //     };
    //     fetchRating();
    // }, []);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5; // Kiểm tra nếu có nửa sao
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="bi bi-star-fill"></i>);
        }
        if (halfStar) {
            stars.push(<i key={fullStars} className="bi bi-star-half"></i>);
        }
        // Thêm sao trống
        for (let i = stars.length; i < 5; i++) {
            stars.push(<i key={i} className="bi bi-star"></i>);
        }
        return stars;
    };

    // const handlePageChange = (pageNumber: number) => {
    //     setCurrentPage(pageNumber);
    // };

    //Tính số sân hiển thị trên trang hiện tại
    // const indexOfLast = currentPage * itemsPerPage;
    // const indexOfFirst = indexOfLast - itemsPerPage;
    // const currentStadiums = stadiums.slice(indexOfLast, indexOfFirst);
    //Tính tổng số trang
    // const totalPages = Math.ceil(stadiums.length / itemsPerPage);

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Sản phẩm yêu thích</b>
            <Row className="my-3">
                {/* {currentStadiums.map((stadium, index) => ( */}
                <Col xs={4}>
                    <div className="user-border">
                        <div className="mb-3">
                            <Link href={"#"}>
                                <Image src={"/images/ck3.jpg"} alt="Tên sản phẩm" />
                            </Link>
                        </div>
                        <div className="content">
                            <div className="mb-1 title" style={{ fontSize: '15px' }}>
                                <Link href={"#"}><b>Crusader King 3 - Royal Edition</b></Link>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div style={{ fontSize: '15px' }}><b className="text-danger">Giá:</b> <b>1.000.000 ₫</b></div>
                                <div className="star-item text-warning">
                                    {renderStars(rating)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                {/* ))} */}
            </Row>
            {/* <nav className="d-flex justify-content-center">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <span className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</span>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <span className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</span>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <span className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</span>
                    </li>
                </ul>
            </nav> */}
        </UserLayout >
    )
}

export default WishListProduct;