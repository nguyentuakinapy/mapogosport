'use client'
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const SportFieldDetailList = () => {
    const [sportFieldDetail, setSportFieldDetail] = useState([]);
    const [sportFieldName, setSportFieldName] = useState([]);

    const { id } = useParams();
    useEffect(() => {
        if (id) {
            // Khi đã có sportFieldId, gọi API
            axios.get(`http://localhost:8080/rest/sportfielddetail/lists/${id}`)
                .then(response => {
                    setSportFieldDetail(response.data); // Cập nhật state với dữ liệu từ API
                })
                .catch(error => console.error('Error:', error));

            axios.get(`http://localhost:8080/rest/sportfielddetail/sportFieldName/${id}`)
                .then(response => {
                    setSportFieldName(response.data); // Cập nhật state với dữ liệu từ API
                })
                .catch(error => console.error('Error:', error));

        }
    }, []);
    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>DANH SÁCH SÂN "{typeof sportFieldName === 'string' ? sportFieldName.toUpperCase() : ''}"</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sân</th>
                        <th>Giá thuê/h</th>
                        <th>Kích thước</th>
                        <th>Trạng thái</th>
                        <th>Giờ vàng</th>
                        <th>Giá giờ vàng</th>
                        <th>Phần trăm cọc</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {sportFieldDetail && sportFieldDetail.map((sfd, index: number) => (
                        <tr key={sfd.id || index}>
                            <td>{index + 1}</td>
                            <td>{sfd.name}</td>
                            <td>{sfd.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>{sfd.size}</td>
                            <td><span className="badge text-bg-primary">{sfd.status}</span></td>
                            <td>{sfd.peakHour}</td>
                            <td>{sfd.peakHourPrices.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>{sfd.percentDeposit}%</td>
                            <td><button className='btn btn-secondary'><i className="bi bi-pencil-square"></i></button></td>
                        </tr>
                    ))}
                </tbody>
            </Table >

            <Link href={'/owner/sport-manager'} className='btn btn-success btn-hv'>Quay lại</Link>
        </>
    )
};

export default SportFieldDetailList;