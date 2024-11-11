'use client'
import { useEffect, useState } from 'react'
import { Button, OverlayTrigger, Tooltip, Form } from 'react-bootstrap'
import UserLayout from '@/components/User/UserLayout'
import ModalAddAddress from '@/components/User/modal/user.addNewAddress'
import '../types/user.scss'
import useSWR, { mutate } from 'swr'
import { toast } from 'react-toastify'
import ModalUpdateAddress from '@/components/User/modal/user.updateAddress'

export default function Address() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [username, setUsername] = useState<string | null>(null);
    const [addressUsers, setAddressUsers] = useState<any[]>([]);
    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
    const [showUpdateAddress, setShowUpdateAddress] = useState<boolean>(false);
    const [selectedAddressUser, setSelectedAddressUser] = useState<any>(null);

    const removePrefix = (name: string) => {
        return name.replace(/^(Tỉnh|Thành phố|Quận|Huyện|Phường|Xã)\s*/, '').trim();
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    const { data, error, isLoading } = useSWR(`http://localhost:8080/rest/user/${username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data && data.addressUsers) {
            const sortedAddresses = data.addressUsers.sort((a: any, b: any) => b.active - a.active);
            setAddressUsers(sortedAddresses);
        }
    }, [data]);

    const handleEdit = (addressUser: any) => {
        setSelectedAddressUser(addressUser);
        setShowUpdateAddress(true);
    };

    const handleDelete = (addressUserId: number) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            fetch(`http://localhost:8080/rest/user/address/${addressUserId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                }
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Xóa địa chỉ không thành công! Vui lòng thử lại sau!`);
                    return
                }
                mutate(`http://localhost:8080/rest/user/${username}`);
                toast.success('Xóa địa chỉ thành công!');
            })
        }
    }

    const handleUpdateActive = (addressUserId: number, activeState: boolean) => {
        fetch(`http://localhost:8080/rest/user/addressStatus/${addressUserId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                active: activeState
            }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return
            }
            mutate(`http://localhost:8080/rest/user/${username}`);
            toast.success('Cập nhật thành công!');
        })
    };

    return (
        <UserLayout>
            <div className='mb-3 text-danger' style={{ fontSize: '20px' }}><b>Quản lý địa chỉ</b></div>
            <Button style={{ width: "100%" }} variant='danger' onClick={() => setShowAddAddress(true)}>
                <i className="bi bi-plus-circle"></i> Thêm địa chỉ
            </Button>
            <div className='mt-4'>
                {isLoading ? (
                    <div>Đang tải...</div>
                ) : error ? (
                    <div className='text-danger'>Có lỗi xảy ra khi tải dữ liệu</div>
                ) : (
                    addressUsers.length > 0 ? (
                        addressUsers.map(addressUser => (
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
    )
}