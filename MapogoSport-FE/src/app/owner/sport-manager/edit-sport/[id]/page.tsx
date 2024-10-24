'use client'
import ModalAddAddress from '@/components/User/modal/user.addNewAddress';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Time from 'react-datepicker/dist/time';

const EditSport = () => {
    const [showAddAddress, setShowAddAddress] = useState<boolean>(false)
    const [sportField, setSportField] = useState<{ [key: string]: any }>({}); // Khởi tạo là một đối tượng
    const [categories, setCategories] = useState<any[]>([]);

    const { id } = useParams();
    useEffect(() => {
        if (id) {
            Promise.all([
                axios.get(`http://localhost:8080/rest/sportfield/${id}`),
                axios.get(`http://localhost:8080/rest/category_field`)
            ])
                .then(([sportFieldResponse, categoryResponse]) => {
                    setSportField(sportFieldResponse.data);
                    setCategories(categoryResponse.data);
                })
                .catch(error => console.error('Error:', error));
        }

    }, [id]);

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [category, setCategory] = useState<number | undefined>(undefined);
    const [opening, setOpening] = useState<String>('');
    const [closing, setClosing] = useState<String>('');
    useEffect(() => {
        if (sportField) {
            setName(sportField.name);
            setDescription(sportField.decription);
            setAddress(sportField.address);
            setCategory(sportField.categoriesField?.categoriesFieldId); // Access categoriesFieldId correctly
            setStatus(sportField.status)
            setOpening(sportField.opening)
            setClosing(sportField.closing)

        }
    }, [sportField]);

    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>CHỈNH SỬA THÔNG TIN SÂN "{name}"</h3>
            <div className="row">
                <div className="col-8">
                    <div className="row">
                        <div className="col form-floating mb-3">
                            <input type="text" className="form-control" id="floatingInput" placeholder="name@example.com"
                                value={name || ''}
                                onChange={(e) => setName(e.target.value)} // Cập nhật state khi người dùng nhập
                            />
                            <label className='ms-2' htmlFor="floatingInput">Tên sân</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-md-6 form-floating mb-3">
                            <input type="text" className="form-control" id="floatingInput" placeholder="name@example.com"
                                value={opening || ''}
                                onChange={(e) => setOpening(e.target.value)}
                            />
                            <label className='ms-2' htmlFor="floatingInput">Giờ mở cửa</label>
                        </div>
                        <div className=" col-md-6 form-floating mb-3">
                            <input type="text" className="form-control" id="floatingInput" placeholder="name@example.com"
                                value={closing || ''}
                                onChange={(e) => setClosing(e.target.value)}
                            />
                            <label className='ms-2' htmlFor="floatingInput">Giờ đóng cửa</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-floating">
                            <select className="form-select" id="floatingSelect" aria-label="Floating label select example"
                                value={category ?? ''}
                                onChange={(e) => setCategory(Number(e.target.value))}
                            >
                                <option value="">Chọn loại sân</option>
                                {categories.map(category => (
                                    <option key={category.categoriesFieldId} value={category.categoriesFieldId}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <label className='ms-2' htmlFor="floatingSelect">Loại sân</label>
                        </div>
                        <div className="col-md-6 form-floating">
                            <select className="form-select" id="floatingSelect" aria-label="Floating label select example"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}>
                                <option >Chọn trạng thái</option>
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Tạm đóng">Tạm đóng</option>
                                <option value="Sửa chữa">Sửa chữa</option>
                            </select>
                            <label className='ms-2' htmlFor="floatingSelect">Trạng thái</label>
                        </div>
                        <div className="col form-floating mt-3">
                            <input type="text" className="form-control" id="floatingInput"
                                value={address || ''}
                                onChange={(e) => setAddress(e.target.value)} />
                            <label htmlFor="floatingInput" className='ms-2'>Địa chỉ</label>
                        </div>
                    </div>
                    <div className="form-floating mt-3">
                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: '100px' }}
                            value={description || ''} onChange={(e) => setDescription(e.target.value)}
                        />
                        <label htmlFor="floatingTextarea2">Mô tả</label>
                    </div>
                    <Button style={{ width: "100%" }} variant='danger' className='mt-3' onClick={() => setShowAddAddress(true)}>
                        <i className="bi bi-plus-circle"></i> Cập nhật
                    </Button>
                </div>
                <div className="col-4">
                    <div className="text-center">
                        <div className="avatar-upload">
                            <div className="avatar-edit">
                                <img src="/images/logo.png" style={{ width: '100%' }} alt="" />
                                <input type="file" name="avatar" id="imageUpload"
                                    accept="image/jpeg, image/png" style={{ display: 'none' }} />
                                <label htmlFor="imageUpload" className="btn btn-link"> Sửa ảnh </label>
                            </div>
                            <div className="avatar-preview">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CÁI NÀY CỦA BÉ HÙNG NHA MỜ Y MY NẶNG MỴ ĐỪNG ĐỔI GÌ */}
            <ModalAddAddress showAddAddress={showAddAddress} setShowAddAddress={setShowAddAddress} />


            <Link href={'/owner/sport-manager'} className='btn btn-success btn-hv mt-3'>Quay lại</Link>
        </>
    )
};
export default EditSport;
