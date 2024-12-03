'use client'
import { Suspense, useEffect, useState } from 'react'
import { Button, OverlayTrigger, Tooltip, Form } from 'react-bootstrap'
import UserLayout from '@/components/User/UserLayout'
import ModalAddAddress from '@/components/User/modal/user.addNewAddress'
import '../types/user.scss'
import { mutate } from 'swr'
import { toast } from 'react-toastify'
import ModalUpdateAddress from '@/components/User/modal/user.updateAddress'
import { useData } from '@/app/context/UserContext'

export default function Address() {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [addressUsers, setAddressUsers] = useState<AddressUsers[]>([]);
    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
    const [showUpdateAddress, setShowUpdateAddress] = useState<boolean>(false);
    const [selectedAddressUser, setSelectedAddressUser] = useState<AddressUsers>();
    const user = useData();

    useEffect(() => {
        if (user && user.addressUsers) {
            const sortedAddresses = user.addressUsers.sort(
                (a: AddressUsers, b: AddressUsers) => (b.active === a.active ? 0 : b.active ? 1 : -1)
            );
            setAddressUsers(sortedAddresses);
        }
    }, [user]);

    const handleEdit = (addressUser: AddressUsers) => {
        setSelectedAddressUser(addressUser);
        setShowUpdateAddress(true);
    };

    const handleDelete = async (addressUserId: number) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            const res = await fetch(`${BASE_URL}rest/user/address/${addressUserId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                }
            })
            if (!res.ok) {
                toast.error(`Xóa địa chỉ không thành công! Vui lòng thử lại sau!`);
                return
            }
            mutate(`${BASE_URL}rest/user/${user?.username}`);
            toast.success('Xóa địa chỉ thành công!');
        }
    }

    const handleUpdateActive = async (addressUserId: number, activeState: boolean) => {
        const res = await fetch(`${BASE_URL}rest/user/addressStatus/${addressUserId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                active: activeState
            }),
        });
        if (!res.ok) {
            toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
            return
        }
        mutate(`${BASE_URL}rest/user/${user?.username}`);
        toast.success('Cập nhật thành công!');
    };

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UserLayout>
                <div className='title-header' style={{ fontSize: '20px' }}>Quản lý địa chỉ</div>
                <Button style={{ width: "100%" }} variant='danger' onClick={() => setShowAddAddress(true)}>
                    <i className="bi bi-plus-circle"></i> Thêm địa chỉ
                </Button>
                <div className='mt-4'>
                    {!user ? (
                        <div>Đang tải...</div>
                    ) : (
                        addressUsers.length > 0 ? (
                            addressUsers.map((addressUser: AddressUsers) => (
                                <div key={addressUser.addressUserId} className='item-address'>
                                    <div className="item-left">
                                        <b>Địa chỉ: </b>
                                        {addressUser.addressDetail}, {addressUser.address.ward}, {addressUser.address.district}, {addressUser.address.province}
                                    </div>
                                    <div className="item-right">
                                        <div className="d-flex align-items-center">
                                            <OverlayTrigger overlay={<Tooltip>Chọn làm số mặc định?</Tooltip>}>
                                                <Form.Check type="switch" checked={addressUser.active}
                                                    onChange={() => handleUpdateActive(addressUser.addressUserId, !addressUser.active)}
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                                <div className='btn-address mx-3' onClick={() => handleEdit(addressUser)}><i className="bi bi-pencil-square"></i></div>
                                            </OverlayTrigger>
                                            <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                                <div className='btn-address' onClick={() => handleDelete(addressUser.addressUserId)}><i className='bi bi-trash3-fill'></i></div>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='item-address'>Không có địa chỉ nào</div>
                        )
                    )}
                </div>
                <ModalAddAddress showAddAddress={showAddAddress} setShowAddAddress={setShowAddAddress} />
                <ModalUpdateAddress showUpdateAddress={showUpdateAddress} setShowUpdateAddress={setShowUpdateAddress} addressUser={selectedAddressUser} />
            </UserLayout >
        </Suspense>
    )
}