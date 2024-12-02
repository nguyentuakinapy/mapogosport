'use client'
import ModalCreateSportFieldDetail from '@/components/Owner/modal/owner.createSportFieldDetail';
import { decodeString } from '@/components/Utils/Format';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import useSWR from 'swr';

const SportFieldDetailList = () => {
    const [showSportFieldDetailModal, setShowSportFieldDetailModal] = useState<boolean>(false)
    const [selectedSportFieldDetail, setSelectedSportFieldDetail] = useState<SportFieldDetail | null>(null);
    const { id } = useParams();
    const [username, setUsername] = useState<string | null>(null);
    const fetcher = (url: string) => axios.get(url).then((res) => res.data);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(decodeString(storedUsername));
        }
    }, []);

    const { data: owner, error: ownerError, isLoading: ownerLoading } = useSWR<Owner>(username && `${BASE_URL}rest/owner/${username}`, fetcher);

    // Hook cho sportFieldDetail
    const { data: sportFieldDetail, error: detailError, isLoading: detailLoading } = useSWR<SportFieldDetail[]>(id && `${BASE_URL}rest/sportfielddetail/lists/${id}`, fetcher);

    // Hook cho sportFieldName
    const { data: sportFieldName, error: nameError, isLoading: nameLoading } = useSWR(id && `${BASE_URL}rest/sportfielddetail/sportFieldName/${id}`, fetcher);

    const handleEditSportFieldDetail = (sportFieldDetail: SportFieldDetail | null) => {
        setSelectedSportFieldDetail(sportFieldDetail);
        setShowSportFieldDetailModal(true);
    };

    if (ownerLoading || detailLoading || nameLoading) return <div>Đang tải...</div>
    if (ownerError || detailError || nameError) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>DANH SÁCH SÂN &ldquo;{sportFieldName.toUpperCase()}&rdquo;</h3>
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
                        <tr key={sfd.sportFielDetailId}>
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
            <div className='d-flex justify-content-between align-items-center'>
                <Button style={{ width: "93%" }} variant='danger' onClick={() => handleEditSportFieldDetail(null)}>
                    <i className="bi bi-plus-circle"></i> Thêm sân mới
                </Button>
                <Link href={'/owner/sport-manager'} className='btn btn-secondary btn-hv'>Quay lại</Link>
            </div>

            <ModalCreateSportFieldDetail showSportFieldDetailModal={showSportFieldDetailModal} setShowSportFieldDetailModal={setShowSportFieldDetailModal}
                selectedSportFieldDetail={selectedSportFieldDetail} id={id} owner={owner}
            />
        </>
    )
};

export default SportFieldDetailList;
