'use client'
import UserLayout from "@/components/User/UserLayout"
import { Col, Row, Image } from "react-bootstrap";
import '../types/user.scss'
import useSWR from "swr";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { decodeString } from "@/components/Utils/Format";
import Loading from "@/components/loading";

const CouponPage = () => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [username, setUsername] = useState<string | null>(null);
    const [voucherData, setVoucherData] = useState<UserVoucher[]>([]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(decodeString(storedUsername));
        }
    }, []);

    const { data, error, isLoading } = useSWR(`${BASE_URL}rest/user/voucher/${username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setVoucherData(data);
        }
    }, [data]);

    if (isLoading) return <UserLayout><div className="d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
        <Loading></Loading>
    </div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UserLayout>
                <b className='text-danger' style={{ fontSize: '20px' }}>Kho voucher</b>
                <div style={{ fontSize: '15px' }}>
                    <Row>
                        {voucherData.length > 0 ?
                            voucherData.filter(item => item.status === "Unused" && item.voucher.status === "active")
                                .map((item) => (
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
        </Suspense>
    )
}

export default CouponPage;