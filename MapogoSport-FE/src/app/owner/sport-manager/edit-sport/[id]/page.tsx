'use client'
import ModalAddAddress from '@/components/User/modal/user.addNewAddress';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function EditSport() {
    const [showAddAddress, setShowAddAddress] = useState<boolean>(false)

    const { id } = useParams();

    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>CHỈNH SỬA THÔNG TIN SÂN "TÊN SÂN"</h3>
            <div className="row">
                <div className="col-8">
                    <div className="row">
                        <div className="col">
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Tên sân</label>
                            </div>
                            <div className="form-floating">
                                <select className="form-select" id="floatingSelect" aria-label="Floating label select example">
                                    <option selected>Chọn loại sân</option>
                                    <option value="1">Sân bóng đá</option>
                                    <option value="2">Sân cầu lông</option>
                                    <option value="3">Sân bóng chuyền</option>
                                </select>
                                <label htmlFor="floatingSelect">Loại sân</label>
                            </div>
                        </div>
                        <div className="col"><div className="form-floating mb-3">
                            <input type="time" className="form-control" id="floatingInput" placeholder="name@example.com" />
                            <label htmlFor="floatingInput">Thời gian mở cửa</label>
                        </div>
                            <div className="form-floating">
                                <select className="form-select" id="floatingSelect" aria-label="Floating label select example">
                                    <option selected>Chọn trạng thái</option>
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Tạm đóng</option>
                                </select>
                                <label htmlFor="floatingSelect">Trạng thái</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-floating mt-3">
                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: '100px' }} ></textarea>
                        <label htmlFor="floatingTextarea2">Mô tả</label>
                    </div>
                    <Button style={{ width: "100%" }} variant='danger' className='mt-3' onClick={() => setShowAddAddress(true)}>
                        <i className="bi bi-plus-circle"></i> Thêm địa chỉ
                    </Button>
                </div>
                <div className="col-4">
                    <div className="text-center">
                        <div className="avatar-upload">
                            <div className="avatar-edit">
                                <img src="/images/logo.png" style={{ width: '100%' }} alt="" />
                                <input type="file" name="avatar" id="imageUpload"
                                    accept="image/jpeg, image/png" style={{ display: 'none' }} />
                                <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                            </div>
                            <div className="avatar-preview">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalAddAddress showAddAddress={showAddAddress} setShowAddAddress={setShowAddAddress} />

            Sport Edit ID: {id}
            <Link href={'/owner/sport-manager'}>Quay lại</Link></>
    )
}