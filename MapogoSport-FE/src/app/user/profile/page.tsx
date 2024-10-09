'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import UserLayout from '@/components/User/UserLayout';
import ModalUpdateEmail from '@/components/User/modal/user.updateEmail';
import '../types/user.scss';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Profile() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/${parsedUserData.username}`);
        }
    }, []);
    const { data, error, isLoading } = useSWR(usernameFetchApi ? usernameFetchApi : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [userData, setUserData] = useState<User | null>(null);

    const handleSave = (username: string) => {
        if (!fullName) {
            console.log('Fullname đang trống!');
            return;
        }
        fetch(`http://localhost:8080/rest/user/${username}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                toast.error(`Cập nhật không thành công! Chi tiết lỗi: ${errorText}`);
                return
            }
            mutate(`http://localhost:8080/rest/user/${username}`);
            toast.success('Cập nhật thành công!');
        }).catch((error) => {
            toast.error(`Đã xảy ra lỗi: ${error.message}`);
        });
    };

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [gender, setGender] = useState<number | null>(null);
    const [username, setUsername] = useState<string>('');

    const [showUpdateEmail, setShowUpdateEmail] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setUsername(data.username);
            setFullName(data.fullname);
            setEmail(data.email);
            setBirthday(data.birthday ? new Date(data.birthday) : null);
            setGender(data.gender);
            setUserData(data);
        }
        console.log(data);

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

    useEffect(() => {
        updateUserData();
        console.log('Dữ liệu người dùng đã được cập nhật:', { username, fullName, email, birthday, gender });
    }, [fullName, email, birthday, gender]);

    if (isLoading) return <UserLayout>Đang tải...</UserLayout>;
    if (error) return <UserLayout>Error loading data</UserLayout>;

    return (
        <UserLayout>
            <div className='mb-3 text-danger' style={{ fontSize: '20px' }}>
                <b>Thông tin cá nhân</b>
            </div>
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
                            <Form.Label>Email:</Form.Label>
                            {!email ? (
                                <div>
                                    Chưa có thông tin
                                    <Link href="#" onClick={() => setShowUpdateEmail(true)}>(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                                </div>
                            ) : (
                                <div>
                                    {email}
                                    <Link href="#" onClick={() => setShowUpdateEmail(true)}>(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                                </div>
                            )}
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
                    </Col>
                </Row>

                <Button className='btn btn-profile' onClick={() => handleSave(username)}>
                    <i className="bi bi-floppy2"></i> Lưu
                </Button>
            </Form>
            <ModalUpdateEmail showUpdateEmail={showUpdateEmail} setShowUpdateEmail={setShowUpdateEmail} email={email} setEmail={setEmail} />
        </UserLayout>
    );
}
