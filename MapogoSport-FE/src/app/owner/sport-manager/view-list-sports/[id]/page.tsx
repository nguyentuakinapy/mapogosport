'use client'
import ModalCreateSportFieldDetail from '@/components/Owner/modal/owner.createSportFieldDetail';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import useSWR, { mutate } from 'swr';

const SportFieldDetailList = () => {
    // const [sportFieldDetail, setSportFieldDetail] = useState([]);
    const [showSportFieldDetailModal, setShowSportFieldDetailModal] = useState<boolean>(false)
    const [selectedSportFieldDetail, setSelectedSportFieldDetail] = useState(null);


    const { id } = useParams();
    const fetcher = (url: string) => axios.get(url).then(res => res.data);

    useEffect(() => {
        getOwner();
    }, [])

    const [owner, setOwner] = useState<Owner>();

    const getOwner = async () => {
        const userSession = sessionStorage.getItem('user');
        const user = userSession ? JSON.parse(userSession) : null;
        if (user) {
            const responseOwner = await fetch(`http://localhost:8080/rest/owner/${user.username}`);
            if (!responseOwner.ok) {
                throw new Error('Error fetching data');
            }
            const dataOwner = await responseOwner.json() as Owner;
            setOwner(dataOwner);
        }
    }
    // Hook cho sportFieldDetail
    const { data: sportFieldDetail, error: errorDetail } = useSWR(
        id ? `http://localhost:8080/rest/sportfielddetail/lists/${id}` : null,
        fetcher
    );

    // Hook cho sportFieldName
    const { data: sportFieldName, error: errorName } = useSWR(
        id ? `http://localhost:8080/rest/sportfielddetail/sportFieldName/${id}` : null,
        fetcher
    );

    // Xử lý lỗi và trạng thái tải cho sportFieldDetail
    if (errorDetail) return <div>Error fetching sport field details: {errorDetail.message}</div>;
    if (!sportFieldDetail) return <div>Loading sport field details...</div>;

    // Xử lý lỗi và trạng thái tải cho sportFieldName
    if (errorName) return <div>Error fetching sport field name: {errorName.message}</div>;
    if (!sportFieldName) return <div>Loading sport field name...</div>;

    const handleEditSportFieldDetail = (sportFieldDetail) => {
        setSelectedSportFieldDetail(sportFieldDetail);
        setShowSportFieldDetailModal(true);
    };

    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>DANH SÁCH SÂN "{typeof sportFieldName === 'string' ? sportFieldName.toUpperCase() : ''}"</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sân</th>
                        <th>Giá thuê/h</th>
                        <th>Giá giờ vàng</th>
                        <th>Kích thước</th>
                        <th>Trạng thái</th>
                        <th>Giờ vàng</th>
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
                            <td>{sfd.peakHourPrices.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>{sfd.size}</td>
                            <td>
                                <span
                                    className={`badge ${sfd.status === "Hoạt động"
                                        ? "text-bg-success"
                                        : sfd.status === "Tạm đóng"
                                            ? "text-bg-secondary"
                                            : "text-bg-warning"
                                        }`}
                                >
                                    {sfd.status}
                                </span>
                            </td>
                            <td>{sfd.peakHour}</td>
                            <td>{sfd.percentDeposit}%</td>
                            <td>
                                <OverlayTrigger overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                                    <button className='btn btn-secondary'
                                        onClick={() => handleEditSportFieldDetail(sfd)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </OverlayTrigger>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table >
            <Button style={{ width: "100%" }} variant='danger' onClick={() => handleEditSportFieldDetail(null)}>
                <i className="bi bi-plus-circle"></i> Thêm sân mới
            </Button>
            <Link href={'/owner/sport-manager'} className='btn btn-success btn-hv mt-3'>Quay lại</Link>

            <ModalCreateSportFieldDetail
                showSportFieldDetailModal={showSportFieldDetailModal}
                setShowSportFieldDetailModal={setShowSportFieldDetailModal}
                selectedSportFieldDetail={selectedSportFieldDetail}
                setSelectedSportFieldDetail={setSelectedSportFieldDetail}
                id={id} owner={owner} // Truyền id vào Modal
            />
        </>

    )
};

export default SportFieldDetailList;
