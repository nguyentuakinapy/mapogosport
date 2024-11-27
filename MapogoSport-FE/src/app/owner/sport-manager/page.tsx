'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ModalCreateSportField from '@/components/Owner/modal/owner.createSportField';

const SportFieldList = () => {
    const [showSportFieldModal, setShowSportFieldModal] = useState<boolean>(false)
    const [username, setUsername] = useState<string | null>(null);
    const [selectedSportField, setSelectedSportField] = useState<SportField | null>(null);
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    const { data: sportField, error: sportFieldError } = useSWR<SportField[]>(username && `http://localhost:8080/rest/sportfields/lists/${username}`, fetcher);

    const { data: userSubscription, error: userSubscriptionError } = useSWR<UserSubscription>(username && `http://localhost:8080/rest/user/subscription/${username}`, fetcher);

    const handleEditSportField = (sportField: SportField | null) => {
        setSelectedSportField(sportField);
        setShowSportFieldModal(true);
    };

    const reachedLimit = sportField && userSubscription ? sportField.length >= userSubscription.accountPackage.limitSportFields : false;

    if (sportFieldError || userSubscriptionError) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

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
            {sportField && sportField.map((sf, index: number) => (
                <div key={sf.sportFieldId}>
                    <div className='card p-2'>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <b className='mx-3'>{index + 1}</b>
                                <img src={`${sf.image}`}
                                    className='me-3' style={{ width: '300px' }} alt="cc" />
                            </div>
                            <div className='me-auto mt-3'>
                                <b>Tên sân: {sf.name}</b><br />
                                <b className='font-14'>Địa chỉ: {sf.address}</b><br />
                                <span className='font-14'>Trạng thái: {sf.status}</span><br />
                                <span className='font-14'>Thời gian mở cửa: {sf.opening} - {sf.closing}</span><br />
                                <span className='font-14'>Số lượng sân: {sf.quantity}</span>
                            </div>
                            <div className='me-3 d-flex align-items-center'>
                                <div className='btn-group'>
                                    <OverlayTrigger overlay={<Tooltip>Xem danh sách sân</Tooltip>}>
                                        <Link href={`/owner/sport-manager/view-list-sports/${sf.sportFieldId}`} className='btn btn-secondary btn-hv'><i className="bi bi-eye"></i></Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                                        <Button style={{ width: "100%" }} variant='' className='btn btn-warning btn-hv' onClick={() => handleEditSportField(sf)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>

            ))}
            <Button disabled={reachedLimit} style={{ width: "100%" }} variant='danger' onClick={() => handleEditSportField(null)}>
                {reachedLimit ? 'Bạn đã đạt giới hạn sân, vui lòng nâng cấp gói tài khoản để được thêm sân!'
                    : (<><i className="bi bi-plus-circle"></i> Thêm khu vực</>)}
            </Button>
            <ModalCreateSportField showSportFieldModal={showSportFieldModal} setShowSportFieldModal={setShowSportFieldModal}
                selectedSportField={selectedSportField} username={username} />

        </>
    );
};

export default SportFieldList;
