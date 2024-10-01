'use client'
import UserLayout from "@/components/User/UserLayout";
import { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import '../../types/user.scss';
import Link from "next/link";
const CommentPage = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Nhật ký hoạt động</b>
            <div className="my-3">
                <Row className="d-flex justify-content-between align-items-center">
                    <Col xs={12} md={4}>
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
                    <Col xs={12} md={4}>
                        <Form.Select>
                            <option>-- Loại --</option>
                            <option value="1">Bình luận</option>
                            <option value="2">Đánh giá</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={4}>
                        <Button variant="danger" style={{ width: '100%' }} type="submit">
                            <i className="bi bi-search"></i> Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="box-comment-container mb-2">
                <div className="d-flex justify-content-between align-items-center">
                    <Link href={"#"} className="box-comment" style={{ fontSize: '15px' }}>
                        <b>Nguyễn Phi Hùng</b> đã trả lời bình luận của <b>Mapogo</b>.
                        <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                            <div>Nhóm gì đỉnh dữ thần!!??</div>
                            <span>25/6/2024</span>
                        </div>
                    </Link>
                    <div className="d-flex align-items-center me-2">
                        <i className="bi bi-trash3-fill fs-5"></i>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default CommentPage;