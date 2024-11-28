'use client'
import UserLayout from "@/components/User/UserLayout";
import { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row, Pagination, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import '../../types/user.scss';
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import { decodeString } from "@/components/Utils/Format";

const CommentPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [fieldFetchAPI, setFieldFetchAPI] = useState<string>('');
    const [productFetchAPI, setProductFetchAPI] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string>('1');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [reviews, setReviews] = useState<(FieldReview | ProductReview)[]>([]);
    const [filteredReviews, setFilteredRiviews] = useState<(FieldReview | ProductReview)[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const username = decodeString(String(localStorage.getItem('username')));
        if (username) {
            setFieldFetchAPI(`http://localhost:8080/rest/user/fieldReview/${username}`);
            setProductFetchAPI(`http://localhost:8080/rest/user/productReview/${username}`);
        }
    }, []);

    const apiFilter = selectedOption === '1' ? fieldFetchAPI : productFetchAPI;

    const { data, error, isLoading } = useSWR(apiFilter ? apiFilter : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            const sortedData = data.sort((a: any, b: any) => new Date(b.datedAt).getTime() - new Date(a.datedAt).getTime());
            setReviews(sortedData);
            setFilteredRiviews(sortedData);
        }
    }, [data]);

    const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleDeleteReview = (id: number, isFieldReview: boolean) => {
        if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
            const username = localStorage.getItem('username');
            if (username) {
                const url = isFieldReview ? `http://localhost:8080/rest/user/fieldReview/${id}`
                    : `http://localhost:8080/rest/user/productReview/rest/user/productReview/${id}`;
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                }).then((res) => {
                    if (!res.ok) {
                        toast.error('Xóa bình luận không thành công! Vui lòng thử lại sau!');
                        return;
                    }
                    setFilteredRiviews((prev) => prev.filter((review) => isFieldReview
                        ? (review as FieldReview).fieldReviewId !== id
                        : (review as ProductReview).productReviewId !== id
                    ));
                    toast.success('Xóa bình luận thành công!');
                });
            }
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const renderPagination = () => {
        if (filteredReviews.length <= 10) return null;

        const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
            );
        }

        return (
            <Pagination>
                <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

    const handleDateFilter = () => {
        let filtered = reviews;

        if (startDate) filtered = filtered.filter(review => new Date(review.datedAt) >= startDate);
        if (endDate) filtered = filtered.filter(review => new Date(review.datedAt) <= endDate);

        setFilteredRiviews(filtered);
        setCurrentPage(1);
    }

    const handleRefresh = () => {
        let filtered = reviews;
        setFilteredRiviews(filtered);
        setCurrentPage(1);
        setStartDate(null);
        setEndDate(null);
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
                            <DatePicker selected={startDate || undefined} onChange={(date) => { setStartDate(date); handleDateFilter(); }}
                                selectsStart startDate={startDate || undefined} endDate={endDate || undefined}
                                placeholderText="Từ ngày" className="form-control start" dateFormat="dd/MM/yyyy" />
                            <InputGroup.Text><i className="bi bi-three-dots"></i></InputGroup.Text>
                            <DatePicker selected={endDate || undefined} onChange={(date) => { setEndDate(date); handleDateFilter(); }}
                                selectsEnd startDate={startDate || undefined} endDate={endDate || undefined} minDate={startDate || undefined}
                                placeholderText="Đến ngày" className="form-control end" dateFormat="dd/MM/yyyy" />
                            <div className="btn-clear-date" onClick={handleRefresh}>
                                <i className="bi bi-x-circle-fill text-muted"></i>
                            </div>
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
            {filteredReviews && filteredReviews.length > 0 ? (
                filteredReviews.map((review) => {
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
                                    <Link href={`/categories/sport_field/detail/${fieldReview.sportField.sportFieldId}`}
                                        className="box-comment" style={{ fontSize: '15px' }}>
                                        <b>{fieldReview.user.fullname}</b> đã đánh giá sân <b>{fieldReview.sportField?.name}</b>.
                                        <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                                            <div>{fieldReview.comment}</div>
                                            <span>{new Date(fieldReview.datedAt).toLocaleDateString('en-GB')}</span>
                                        </div>
                                    </Link>
                                    <div className="btn-cmt" onClick={() => handleDeleteReview(fieldReview.fieldReviewId, true)}>
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
                                    <Link href={`/product-detail/${productReview.product.productId}`}
                                        className="box-comment" style={{ fontSize: '15px' }}>
                                        <b>{productReview.fullname}</b> đã đánh giá sản phẩm <b>{productReview.product.productName}</b>.
                                        <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                                            <div>{productReview.comment}</div>
                                            <span>{new Date(productReview.datedAt).toLocaleDateString('en-GB')}</span>
                                        </div>
                                    </Link>
                                    <div className="btn-cmt" onClick={() => handleDeleteReview(productReview.productReviewId, false)}>
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
            {renderPagination()}
        </UserLayout>
    )
}

export default CommentPage;