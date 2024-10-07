'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap'
import UserLayout from '@/components/User/UserLayout'
import ModalUpdateEmail from '@/components/User/modal/user.updateEmail'
import ModalUpdatePhone from '@/components/User/modal/user.updatePhone'
import '../types/user.scss'
import useSWR, { mutate } from 'swr'
import { toast } from 'react-toastify'

export default function Profile() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>("");
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/${parsedUserData.username}`)
        }
    }, [])
    const { data, error, isLoading } = useSWR(
        usernameFetchApi, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    );

    const [userData, setUserData] = useState<User | null>(null);

    const handleSave = (username: string) => {
        if (!fullName) {
            console.log("Fullname đang trống!");
            return;
        }

        fetch(`http://localhost:8080/rest/user/${username}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }).then(async (res) => {
            if (res.ok) {
                // Kiểm tra nếu server trả về nội dung rỗng
                const result = await res.text();  // Sử dụng text() thay vì json()
                if (result) {
                    // Nếu có phản hồi, cố gắng parse nó thành JSON
                    const jsonResult = JSON.parse(result);
                    mutate(`http://localhost:8080/rest/user/${username}`);
                    toast.success("Cập nhật thành công!");
                } else {
                    toast.success("Cập nhật thành công!");
                }
            } else {
                toast.error("Cập nhật không thành công!");  // Trường hợp không thành công
            }
        }).catch(error => {
            toast.error("Đã xảy ra lỗi:", error);
        });
    }

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState<string>('');

    // const [openSport, setOpenSport] = useState(false)
    const [showUpdateEmail, setShowUpdateEmail] = useState<boolean>(false);
    const [showUpdatePhone, setShowUpdatePhone] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setUsername(data.username);
            setFullName(data.fullname);
            setEmail(data.email);
            setBirthday(data.birthday);
            setGender(data.gender);
            setUserData(data);
        }
    }, [data]);

    useEffect(() => {
        setUserData((prevUserData) => {
            // Kiểm tra nếu userData là null hoặc không hợp lệ
            if (!prevUserData) {
                console.log("User data đang trống hoặc không hợp lệ");
                return prevUserData;
            }

            const updateUser = { ...prevUserData };

            updateUser.fullname = fullName;
            updateUser.email = email;
            updateUser.birthday = new Date(birthday);
            updateUser.gender = gender === 'true';

            return updateUser;

        });
        console.log(userData?.fullname);

    }, [fullName, email, birthday, gender]);

    if (isLoading) return <UserLayout>Đang tải...</UserLayout>;
    if (error) return <UserLayout>Error loading data</UserLayout>;

    return (
        <UserLayout>
            <div className='mb-3 text-danger' style={{ fontSize: '20px' }}><b>Thông tin cá nhân</b></div>
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
                                <Form.Control size="sm" type="date" placeholder="Ngày sinh"
                                    value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                                <Form.Label>Ngày sinh</Form.Label>
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
                                <Form.Select aria-label="Floating label select example" value={gender}
                                    onChange={(e) => setGender(e.target.value)}>
                                    <option>-- Nhấn để chọn --</option>
                                    <option value="true">Nam</option>
                                    <option value="false">Nữ</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>

                        {/* <Form.Group className="mb-3">
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
                        </Form.Group> */}
                    </Col>
                </Row>

                <Button className='btn btn-profile' onClick={() => handleSave(username)}>
                    <i className="bi bi-floppy2"></i> Lưu
                </Button>
            </Form>
            <ModalUpdateEmail showUpdateEmail={showUpdateEmail} setShowUpdateEmail={setShowUpdateEmail} email={email} setEmail={setEmail} />
            {/* <ModalUpdatePhone showUpdatePhone={showUpdatePhone} setShowUpdatePhone={setShowUpdatePhone} /> */}
        </UserLayout>
    )
}
