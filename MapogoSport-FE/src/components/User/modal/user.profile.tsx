'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import ModalUpdateEmail from '@/components/User/modal/user.updateEmail';
import '../types/user.scss';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ModalChangePassword from '@/components/User/modal/user.changePassword';
import ModalUpdatePhone from '@/components/User/modal/user.updatePhone';
import React from 'react';

interface ProfileContentProps {
    usernameFetchApi: string;
}

const ProfileContent = (props: ProfileContentProps) => {
    const { usernameFetchApi } = props;
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [userData, setUserData] = useState<User | null>(null);
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [gender, setGender] = useState<number | null>(null);
    const [showUpdateEmail, setShowUpdateEmail] = useState<boolean>(false);
    const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
    const [showUpdatePhone, setShowUpdatePhone] = useState<boolean>(false);

    const { data, error, isLoading } = useSWR(usernameFetchApi, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setFullName(data.fullname);
            setEmail(data.email);
            setBirthday(data.birthday ? new Date(data.birthday) : null);
            setGender(data.gender);
            setUserData(data);
        }
    }, [data]);

    const updateUserData = () => {
        setUserData((prevUserData) => {
            if (!prevUserData) return prevUserData;
            return {
                ...prevUserData,
                fullname: fullName,
                email: email,
                birthday: birthday,
                gender: gender,
            };
        });
    };

    const handleSave = () => {
        if (!fullName) {
            toast.error("Bắt buộc phải nhập họ và tên!");
            return
        }
        fetch(usernameFetchApi, {
            method: 'PUT',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return
            }
            mutate(usernameFetchApi);
            toast.success('Cập nhật thành công!');
        })
    };

    useEffect(() => {
        updateUserData();
    }, [fullName, email, birthday, gender]);

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Floating className="mb-3">
                        <Form.Control size="sm" type="text" placeholder="Họ và tên"
                            value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        <Form.Label>Họ và tên <b className='text-danger'>*</b></Form.Label>
                    </Form.Floating>
                </Form.Group>

                <Row>
                    <Col xs={6}>
                        <Form.Group className="mb-3">
                            <Form.Floating className="mb-3">
                                <DatePicker
                                    selected={birthday}
                                    onChange={(date: Date | null) => setBirthday(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="dd/mm/yyyy"
                                />
                                <Form.Label className='dateLabel'>Ngày sinh</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='me-1'><b>Email:</b></Form.Label>
                            {email}
                            <Link href="#" className='ms-1' onClick={() => setShowUpdateEmail(true)}>(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                        </Form.Group>
                    </Col>

                    <Col xs={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="district" label="Giới tính">
                                <Form.Select aria-label="Floating label select example"
                                    value={gender != null ? gender.toString() : ''}
                                    onChange={(e) => setGender(e.target.value === '0' ? 0 : e.target.value === '1' ? 1 : e.target.value === '2' ? 2 : null)}>
                                    <option>-- Nhấn để chọn --</option>
                                    <option value="0">Nam</option>
                                    <option value="1">Nữ</option>
                                    <option value="2">Khác</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='me-1'><b>Số điện thoại:</b></Form.Label>
                            {userData && userData.phoneNumberUsers.length > 0
                                ? userData.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber : "Chưa có số điện thoại"}
                            <Link href="#" className='ms-1' onClick={() => setShowUpdatePhone(true)}>(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                        </Form.Group>
                    </Col>
                </Row>
                <Button className='btn btn-profile me-2' onClick={() => setShowChangePassword(true)}>
                    <i className="bi bi-pencil-square"></i> Đổi mật khẩu
                </Button>
                <Button className='btn btn-profile' onClick={() => handleSave()}>
                    <i className="bi bi-floppy2"></i> Lưu
                </Button>
            </Form>
            <ModalUpdateEmail showUpdateEmail={showUpdateEmail} setShowUpdateEmail={setShowUpdateEmail} userData={userData} />
            <ModalChangePassword showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword} userData={userData} />
            <ModalUpdatePhone showUpdatePhone={showUpdatePhone} setShowUpdatePhone={setShowUpdatePhone} userData={userData} />
        </>
    );
}

export default ProfileContent;