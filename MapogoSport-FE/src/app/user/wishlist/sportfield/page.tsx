'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Col, Row, Image } from "react-bootstrap";
import '../../types/user.scss'
import { useEffect, useState } from "react";
import useSWR from "swr";

const WishListSportField = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/favoriteField/${parsedUserData.username}`);
        }
    }, []);
    const { data, error, isLoading } = useSWR(usernameFetchApi ? usernameFetchApi : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [rating, setRating] = useState<number>(1.5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6; //Số lượng sân mỗi trang
    const [favoriteField, setFavoriteField] = useState<FavoriteField[]>([]);

    useEffect(() => {
        if (data) {
            setFavoriteField(data);
        }
    }, [data]);

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

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
            <b className='text-danger' style={{ fontSize: '20px' }}>Sân yêu thích</b>
            <Row className="my-3">
                {favoriteField.length > 0 ? (
                    favoriteField.map((ff) => (
                        <Col xs={4} key={ff.favoriteFieldId}>
                            <div className="user-border">
                                <div className="mb-3">
                                    <Link href={"#"}>
                                        {ff.sportField.image}
                                    </Link>
                                </div>
                                <div className="content">
                                    <div className="mb-1 title">
                                        <Link href={"#"}><b>{ff.sportField.name}</b></Link>
                                    </div>
                                    <div className="address mb-1">
                                        {/* <span className="me-2">Khu vực:</span>Quận 7 <span className="mx-2">- </span>Hồ Chí Minh */}
                                        <span className="me-2">Khu vực: {ff.sportField.address}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>Số sân: {ff.sportField.sportFielDetails.length}</div>
                                        <div className="star-item text-warning">
                                            {renderStars(rating)}
                                        </div>
                                    </div>
                                    <Link href={"#"} className="btn btn-user mt-2">Đặt sân</Link>
                                </div>
                            </div>
                        </Col>
                    ))
                ) : (
                    <UserLayout><div>Không có sân đã yêu thích!</div></UserLayout>
                )}
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

export default WishListSportField;