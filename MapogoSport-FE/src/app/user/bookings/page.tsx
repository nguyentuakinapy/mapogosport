'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import '../types/user.scss';
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { useState } from "react";

const Bookings = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Danh sách đặt sân</b>
            <div className="my-3">
                <Row className="d-flex justify-content-between align-items-center">
                    <Col xs={12} md={4}>
                        <Form.Control className="input-search-user" type="text" placeholder="Tìm theo tên sân" />
                    </Col>
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
                            <option>-- Trạng thái --</option>
                            <option value="1">Xác nhận</option>
                            <option value="2">Đã hủy</option>
                            <option value="3">Chờ xác nhận</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={12} className="mt-2">
                        <Button variant="danger" style={{ width: '100%' }} type="submit">
                            <i className="bi bi-search"></i> Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>Mã đặt sân</th>
                            <th style={{ width: '250' }}>Tên sân</th>
                            <th>Ngày</th>
                            <th>Tình trạng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="ps-3 text-start"><Link href={"#"}>#1</Link></td>
                            <td className="title">GG Stadiummmmmmmmmmmmmmmmmmmmmmm</td>
                            <td>22/09/2024</td>
                            <td>Đã hoàn thành</td>
                            <td>
                                <Link href={"/user/bookings/detail/1"} as={`/user/bookings/detail/1`} key={Math.random()}>
                                    Xem
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </UserLayout>
    )
}

export default Bookings;