'use client'
import Link from 'next/link';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function SportManager() {
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
            <div className='card p-2'>
                <div className='d-flex justify-content-between'>
                    <div>
                        <b className='mx-3'>1</b>
                        <img src="/images/logo.png" style={{ width: '300px' }} alt="cc" />
                    </div>
                    <div className='me-auto mt-3'>
                        <b >Tên sân</b><br />
                        <b className='font-14'>652 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam</b><br />
                        <span className='font-14'>Trạng thái</span><br />
                        <span className='font-14'>Thời gian mở cửa</span><br />
                        <span className='font-14'>Số lượng sân</span>
                    </div>
                    <div className='me-3 d-flex align-items-center'>
                        <div className='btn-group'>
                            <Link href={'/owner/sport-manager/view-list-sports/1'} className='btn btn-secondary btn-hv'><i className="bi bi-eye"></i></Link>
                            <Link href={'/owner/sport-manager/edit-sport/2'} className='btn btn-warning btn-hv'><i className="bi bi-pencil-square"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="card">
                <Link href={'/owner?check=withdraw'} className='btn btn-danger'><i className="bi bi-plus-circle me-2"></i>Thêm khu vực</Link>
            </div>
        </>
    )
}