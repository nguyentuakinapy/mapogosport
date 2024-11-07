'use client'
import ModalAddAddress from '@/components/Owner/modal/booking.modal';
import ModalCreateSportField from '@/components/Owner/modal/owner.createSportField';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const SportFieldList = () => {
    const [showSportFieldModal, setShowSportFieldModal] = useState<boolean>(false)
    // const [sportFields, setSportFields] = useState([]);
    const userSession = sessionStorage.getItem('user');
    const user = userSession ? JSON.parse(userSession) : null;
    const [selectedSportField, setSelectedSportField] = useState(null); // State to hold the selected sport field data

    const fetcher = (url) => axios.get(url).then(res => res.data);

    const { data: sportFields, error } = useSWR(
        user ? `http://localhost:8080/rest/sportfields/lists/${user.username}` : null,
        fetcher
    );

    if (error) return <div>Error: {error.message}</div>;
    if (!sportFields) return <div>Loading...</div>;

    const handleEditSportField = (sportField) => {
        setSelectedSportField(sportField); // Set the selected sport field data
        setShowSportFieldModal(true); // Show the modal
    };
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
                                    <img src={`${sf.image}`}
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
                    </>
                </div>

            ))}

            <Button style={{ width: "100%" }} variant='danger' onClick={() => handleEditSportField(null)}>
                <i className="bi bi-plus-circle"></i> Thêm khu vực
            </Button>


            {/* <ModalCreateSportField showSportFieldModal={showSportFieldModal} setShowSportFieldModal={setShowSportFieldModal} /> */}
            <ModalCreateSportField
                showSportFieldModal={showSportFieldModal}
                setShowSportFieldModal={setShowSportFieldModal}
                selectedSportField={selectedSportField}
                setSelectedSportField={setSelectedSportField}
            />

        </>
    );
};

export default SportFieldList;
