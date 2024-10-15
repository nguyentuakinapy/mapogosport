'use client'
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const SportFieldList = () => {
    const [sportFields, setSportFields] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userSession = sessionStorage.getItem('user');
        const user = userSession ? JSON.parse(userSession) : null;
        setUser(user); // Cập nhật user từ sessionStorage

        if (user) {
            // Gọi API từ Spring Boot
            axios.get(`http://localhost:8080/api/sportfields/lists/${user.username}`)
                .then(response => {
                    setSportFields(response.data); // Cập nhật state với dữ liệu từ API
                })
                .catch(error => console.error('Error:', error));
        }
    }, []);
    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>QUẢN LÝ SÂN</h3>
            <div className='card p-2'>
                <div className='d-flex justify-content-between'>
                    <div>
                        <b className='mx-3 me-5 '>STT</b>
                        <b className='mx-3 ms-5 '>Hình ảnh</b>
                    </div>
                    <div className=''>
                        <b className='mx-3 '>Thông tin sân </b>
                    </div>
                    <div><b className='mx-3 '>Hành động</b></div>
                </div>
            </div>
            <br />
            {sportFields && sportFields.map((sf, index: number) => (
                <div key={sf.id || index}>
                    <>
                        <div className='card p-2'>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <b className='mx-3'>{index + 1}</b>
                                    <img src={`http://localhost:8080/images/images_sportfield/${sf.image}`}
                                        className='me-3' style={{ width: '300px' }} alt="cc" />
                                </div>
                                <div className='me-auto mt-3'>
                                    <b>{sf.name}</b><br />
                                    <b className='font-14'>{sf.address}</b><br />
                                    <span className='font-14'>Trạng thái: {sf.status}</span><br />
                                    <span className='font-14'>Thời gian mở cửa: {sf.opening} - {sf.closing}</span><br />
                                    <span className='font-14'>Số lượng sân: {sf.quantity}</span>
                                </div>
                                <div className='me-3 d-flex align-items-center'>
                                    <div className='btn-group'>
                                        <Link href={`/owner/sport-manager/view-list-sports/${sf.sportFieldId}`} className='btn btn-secondary btn-hv'><i className="bi bi-eye"></i></Link>
                                        <Link href={'/owner/sport-manager/edit-sport/2'} className='btn btn-warning btn-hv'><i className="bi bi-pencil-square"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                    </>
                </div>

            ))}
            <div className="card">
                <Link href={'/owner?check=withdraw'} className='btn btn-danger'><i className="bi bi-plus-circle me-2"></i>Thêm khu vực</Link>
            </div>
        </>
    );
};

export default SportFieldList;
