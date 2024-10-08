'use client'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import UserLayout from '@/components/User/UserLayout'
import ModalAddAddress from '@/components/User/modal/user.addNewAddress'
import '../types/user.scss'

export default function Profile() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json);


    const [address, setAddress] = useState('')

    const [showAddAddress, setShowAddAddress] = useState<boolean>(false)

    return (
        <UserLayout>
            <div className='mb-3 text-danger' style={{ fontSize: '20px' }}><b>Quản lý địa chỉ</b></div>
            <Button style={{ width: "100%" }} variant='danger' onClick={() => setShowAddAddress(true)}>
                <i className="bi bi-plus-circle"></i> Thêm địa chỉ
            </Button>
            <div className='mt-4'>
                <div className='item-address d-flex justify-content-between align-items-center'>
                    <div className="item-left">
                        <b>Nguyễn Phi Hùng - 0963861480</b>
                        <div>39/6, Nam Lân, Xã Bà Điểm, Huyện Hóc Môn, Hồ Chí Minh</div>
                    </div>
                    <div className="item-right">
                        <div className="d-flex">
                            <div className='text-warning btn-address' onClick={() => setShowAddAddress(true)}>Sửa</div>
                            <div className='text-danger ms-5 btn-address'>Xóa</div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalAddAddress showAddAddress={showAddAddress} setShowAddAddress={setShowAddAddress} />
        </UserLayout >
    )
}
