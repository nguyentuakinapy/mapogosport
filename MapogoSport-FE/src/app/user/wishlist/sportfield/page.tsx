'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import '../../types/user.scss'
import { Suspense, useEffect, useState } from "react";
import useSWR from "swr";
import { decodeString } from "@/components/Utils/Format";

const WishListSportField = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsernameFetchApi(`http://localhost:8080/rest/user/favoriteField/${decodeString(storedUsername)}`);
        }
    }, []);

    const { data, error, isLoading } = useSWR(usernameFetchApi ? usernameFetchApi : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const rating = 1.5;
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

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
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
                        <div>Không có sân đã yêu thích!</div>
                    )}
                </Row>
            </UserLayout >
        </Suspense>
    )
}

export default WishListSportField;