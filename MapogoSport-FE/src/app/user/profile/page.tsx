'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap'
import UserLayout from '@/components/User/UserLayout'
import ModalUpdateEmail from '@/components/User/modal/user.updateEmail'
import ModalUpdatePhone from '@/components/User/modal/user.updatePhone'
import '../types/user.scss'

export default function Profile() {
    const [name, setName] = useState('Nguyen Phi Hung (FPL HCM)')
    const [email, setEmail] = useState('hungnpps30910@fpt.edu.vn')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    // const [openSport, setOpenSport] = useState(false)
    const [showUpdateEmail, setShowUpdateEmail] = useState<boolean>(false);
    const [showUpdatePhone, setShowUpdatePhone] = useState<boolean>(false);

    return (
        <UserLayout>
            <div className='mb-3 text-danger' style={{ fontSize: '20px' }}><b>Thông tin cá nhân</b></div>
            <div style={{ fontSize: '15px' }}>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Floating className="mb-3">
                            <Form.Control size="sm" type="text" placeholder="Họ và tên"
                                value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label>Họ và tên <b className='text-danger'>*</b></Form.Label>
                        </Form.Floating>
                    </Form.Group>

                    <Row>
                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Floating className="mb-3">
                                    <Form.Control size="sm" type="date" placeholder="Ngày sinh"
                                        value={dob} onChange={(e) => setDob(e.target.value)} />
                                    <Form.Label>Ngày sinh</Form.Label>
                                </Form.Floating>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email:</Form.Label>
                                <div>{email} <Link href="#" onClick={() => setShowUpdateEmail(true)}>(<i className="bi bi-pencil-square"></i> Cập nhật)</Link></div>
                            </Form.Group>
                        </Col>

                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="district" label="Giới tính">
                                    <Form.Select aria-label="Floating label select example">
                                        <option>-- Nhấn để chọn --</option>
                                        <option value="1">Nam</option>
                                        <option value="2">Nữ</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                {!phone ? (
                                    <div>
                                        Chưa có thông tin
                                        <Link href="#" onClick={() => setShowUpdatePhone(true)}>(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                                    </div>
                                ) : (
                                    <div>
                                        {phone}
                                        <Link href="#">(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Link href={"#"} className='btn btn-profile' type="submit" >
                        <i className="bi bi-floppy2"></i> Lưu
                    </Link>
                </Form>
            </div>
            <ModalUpdateEmail showUpdateEmail={showUpdateEmail} setShowUpdateEmail={setShowUpdateEmail} />
            <ModalUpdatePhone showUpdatePhone={showUpdatePhone} setShowUpdatePhone={setShowUpdatePhone} />
        </UserLayout>
    )
}
