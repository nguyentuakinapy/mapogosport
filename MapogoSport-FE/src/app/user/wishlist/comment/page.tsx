'use client'
import UserLayout from "@/components/User/UserLayout";
import { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import '../../types/user.scss';
import Link from "next/link";
import useSWR from "swr";
const CommentPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [fieldFetchAPI, setFieldFetchAPI] = useState<string>('');
    const [productFetchAPI, setProductFetchAPI] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string>('1');

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setFieldFetchAPI(`http://localhost:8080/rest/user/fieldReview/${parsedUserData.username}`);
            setProductFetchAPI(`http://localhost:8080/rest/user/productReview/${parsedUserData.username}`);
        }
    }, []);

    const apiFilter = selectedOption === '1' ? fieldFetchAPI : productFetchAPI;

    const { data, error, isLoading } = useSWR(apiFilter ? apiFilter : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [reviews, setReviews] = useState<(FieldReview | ProductReview)[]>([]);

    useEffect(() => {
        setReviews(data);
    }, [data]);

    const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Nhật ký hoạt động</b>
            <div className="my-3">
                <Row className="d-flex justify-content-between align-items-center">
                    <Col xs={12} md={6}>
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
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Select value={selectedOption} onChange={handleFilter}>
                            <option value="1">Đánh giá sân</option>
                            <option value="2">Đánh giá sản phẩm</option>
                            <option value="3">Bình luận bài viết</option>
                        </Form.Select>
                    </Col>
                </Row>
            </div>
            {reviews && reviews.length > 0 ? (
                reviews.sort((a: any, b: any) => new Date(b.datedAt).getTime() - new Date(a.datedAt).getTime())
                    .map((review) => {
                        let key = '';
                        if (selectedOption === '1') {
                            const fieldReview = review as FieldReview;
                            key = `field-${fieldReview.fieldReviewId}`;
                            if (fieldReview.fieldReviewId === undefined) {
                                return null;
                            }
                            return (
                                <div className="box-comment-container mb-2" key={key}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link href={"#"} className="box-comment" style={{ fontSize: '15px' }}>
                                            <b>{fieldReview.user.fullname}</b> đã đánh giá sân <b>{fieldReview.sportField?.name}</b>.
                                            <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                                                <div>{fieldReview.comment}</div>
                                                <span>{new Date(fieldReview.datedAt).toLocaleDateString('en-GB')}</span>
                                            </div>
                                        </Link>
                                        <div className="d-flex align-items-center me-2">
                                            <i className="bi bi-trash3-fill fs-5"></i>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            const productReview = review as ProductReview;
                            key = `product-${productReview.productReviewId}`;
                            if (productReview.productReviewId === undefined) {
                                return null;
                            }
                            return (
                                <div className="box-comment-container mb-2" key={key}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link href={"#"} className="box-comment" style={{ fontSize: '15px' }}>
                                            <b>{productReview.fullname}</b> đã đánh giá sản phẩm <b>{productReview.productName}</b>.
                                            <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                                                <div>{productReview.comment}</div>
                                                <span>{new Date(productReview.datedAt).toLocaleDateString('en-GB')}</span>
                                            </div>
                                        </Link>
                                        <div className="d-flex align-items-center me-2">
                                            <i className="bi bi-trash3-fill fs-5"></i>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })
            ) : (
                <div>Chưa có bình luận nào!</div>
            )}
        </UserLayout>
    )
}

export default CommentPage;