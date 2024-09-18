'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import RootLayout from '../page'

export default function Profile() {
    const [name, setName] = useState('Nguyen Phi Hung (FPL HCM)')
    const [email, setEmail] = useState('hungnpps30910@fpt.edu.vn')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [showAddAddress, setShowAddAddress] = useState<boolean>(false)
    // const [openSport, setOpenSport] = useState(false)

    return (
        <RootLayout>
            <div className='bg-white' style={{ height: "96%" }}>
                <div className='mb-3 text-danger' style={{ fontSize: '20px', fontWeight: '700' }}>Sửa thông tin</div>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Floating className="mb-3">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Họ và tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Form.Label htmlFor="nameInput">Họ và tên <b className='text-danger'>*</b></Form.Label>
                        </Form.Floating>
                    </Form.Group>

                    <Row>
                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="date"
                                        placeholder="Ngày sinh"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                    <Form.Label htmlFor="dobInput">Ngày sinh</Form.Label>
                                </Form.Floating>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontSize: "15px" }}>Email:</Form.Label>
                                <div style={{ fontSize: "15px" }}>{email} <Link href="#">(Cập nhật)</Link></div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giới tính</Form.Label>
                                <Form.Select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">-- Giới tính --</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Floating>
                                    <Form.Select
                                        className="py-0"
                                        size="sm"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    >
                                        <option value="">-- Chọn địa chỉ --</option>
                                        <option value="addNew" onClick={() => setShowAddAddress(true)}>-- Thêm địa chỉ --</option>
                                    </Form.Select>
                                </Form.Floating>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontSize: "15px" }}>Số điện thoại</Form.Label>
                                {!phone ? (
                                    <div style={{ fontSize: "15px" }}>
                                        Chưa có thông tin <Link href="#">(Cập nhật)</Link>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "15px" }}>
                                        {phone} <Link href="#">(Cập nhật)</Link>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        style={{ width: "15%", border: "1px solid #142239", backgroundColor: "#142239", color: "#fff", fontSize: "15px" }}
                        type="submit"
                    >
                        <i className="bi bi-pencil-square"></i> Cập nhật
                    </Button>
                </Form>
            </div>
        </RootLayout>
    )
}
