'use client'
import UserLayout from "@/components/User/UserLayout"
import { Col, Row, Image, Button } from "react-bootstrap";
import '../types/user.scss'
import useSWR from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";

const CouponPage = () => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');
    const [voucherData, setVoucherData] = useState<UserVoucher[]>([]);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/voucher/${parsedUserData.username}`);
        }
    }, []);
    const { data, error, isLoading } = useSWR(usernameFetchApi, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setVoucherData(data);
        }
    }, [data]);

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Kho voucher</b>
            <div style={{ fontSize: '15px' }}>
                <Row>
                    {voucherData.length > 0 ?
                        voucherData.map((item) => (
                            <Col xs={4} className="mt-4" key={item.userVoucherId}>
                                <div className="box-coupon py-2">
                                    <div className="me-2">
                                        <Image src={"/images/logo.png"} width={100} alt="LogoShop" />
                                    </div>
                                    <div className="box-coupon-content">
                                        <b>{item.voucher.name}</b>
                                        <div className="text-muted">Hết hạn: {new Date(item.voucher.endDate).toLocaleDateString('en-GB')}</div>
                                        <Link href={"/categories/products"}><div className="btn-voucher">Dùng ngay</div></Link>
                                    </div>
                                </div>
                            </Col>
                        ))
                        :
                        <div>Chưa có mã giảm giá nào trong kho!</div>
                    }
                </Row>
            </div>
        </UserLayout>
    )
}

export default CouponPage;