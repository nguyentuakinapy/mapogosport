'use client'
import { useEffect, useState } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import UserLayout from '@/components/User/UserLayout'
import ModalAddAddress from '@/components/User/modal/user.addNewAddress'
import '../types/user.scss'
import useSWR, { mutate } from 'swr'
import { toast } from 'react-toastify'
import ModalUpdateAddress from '@/components/User/modal/user.updateAddress'

export default function Address() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    const removePrefix = (name: string) => {
        return name.replace(/^(Tỉnh|Thành phố|Quận|Huyện|Phường|Xã)\s*/, '').trim();
    };

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            const apiUrl = `http://localhost:8080/rest/user/${parsedUserData.username}`;
            setUsernameFetchApi(apiUrl);
        }
    }, []);

    const { data, error, isLoading } = useSWR(usernameFetchApi ? usernameFetchApi : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [addressUsers, setAddressUsers] = useState<any[]>([]); // Lưu toàn bộ địa chỉ của người dùng

    useEffect(() => {
        if (data && data.addressUsers) {
            setAddressUsers(data.addressUsers); // Lưu tất cả địa chỉ
        }
    }, [data]);

    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
    const [showUpdateAddress, setShowUpdateAddress] = useState<boolean>(false);
    const [selectedAddressUser, setSelectedAddressUser] = useState<any>(null);

    const handleEdit = (addressUser: any) => {
        setSelectedAddressUser(addressUser); // Lưu thông tin địa chỉ được chọn
        setShowUpdateAddress(true); // Hiển thị modal cập nhật
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
                    const errorText = await res.text();
                    toast.error(`Xóa địa chỉ không thành công! Chi tiết lỗi: ${errorText}`);
                    return
                }
                mutate(usernameFetchApi);
                toast.success('Xóa địa chỉ thành công!');
            }).catch((error) => {
                toast.error(`Đã xảy ra lỗi: ${error.message}`);
            });
        }
    }

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
                            <div key={addressUser.addressUserId} className='item-address d-flex justify-content-between align-items-center'>
                                <div className="item-left">
                                    <div><b>Số điện thoại: </b>{addressUser.phoneNumber}</div>
                                    <div>
                                        <b>Địa chỉ: </b>
                                        {`${removePrefix(addressUser.addressDetail)}, ${removePrefix(addressUser.address.ward)}, ${removePrefix(addressUser.address.district)}, ${removePrefix(addressUser.address.province)}`}
                                    </div>
                                </div>
                                <div className="item-right">
                                    <div className="d-flex">
                                        <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                            <div className='btn-address' onClick={() => handleEdit(addressUser)}><i className="bi bi-pencil-square"></i></div>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                            <div className='ms-4 btn-address' onClick={() => handleDelete(addressUser.addressUserId)}><i className='bi bi-trash3-fill'></i></div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Không có địa chỉ nào</div>
                    )
                )}
            </div>
            <ModalAddAddress showAddAddress={showAddAddress} setShowAddAddress={setShowAddAddress} />
            <ModalUpdateAddress showUpdateAddress={showUpdateAddress} setShowUpdateAddress={setShowUpdateAddress} addressUser={selectedAddressUser} />
        </UserLayout >
    )
}