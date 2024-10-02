'use client'
import UserLayout from "@/components/User/UserLayout";
import Link from "next/link";
import { Badge, Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { useState } from "react";
import '../types/user.scss'

const Orders = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Quản lý đơn hàng</b>
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
                            <option>-- Trạng thái --</option>
                            <option value="1">Chờ thanh toán</option>
                            <option value="2">Đang xử lí</option>
                            <option value="3">Đang vận chuyển</option>
                            <option value="4">Đã hủy</option>
                            <option value="5">Đã hoàn thành</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={4}>
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
                            <th style={{ width: '150px' }}>Mã đơn hàng</th>
                            <th>Ngày</th>
                            <th>Tình trạng</th>
                            <th>Tổng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="ps-3 text-start"><Link href={"#"}>#1</Link></td>
                            <td>22/09/2024</td>
                            <td><Badge bg="badge-user">Đã hoàn thành</Badge></td>
                            <td>1.000.000 ₫</td>
                            <td><Link href={"#"}>Xem</Link></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </UserLayout>
    )
}

export default Orders;