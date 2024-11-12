'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';
import useSWR from 'swr';
import { formatPrice } from '@/components/Utils/Format';
import { toast } from 'react-toastify';

const SubcriptionPage = () => {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, mutate } = useSWR('http://localhost:8080/rest/accountpackage', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });


    const { data: dataBenefit, mutate: mutateBenefit } = useSWR('http://localhost:8080/rest/admin/find-all-benefit', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        console.log(dataBenefit);
    }, [dataBenefit]);
    const [modalShow, setModalShow] = useState(false); // Edit modal
    const [modalCreateShow, setModalCreateShow] = useState(false); // Create modal
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [editedPackage, setEditedPackage] = useState(null);
    const [newPackage, setNewPackage] = useState({
        packageName: '',
        price: 0,
        durationDays: '',
        limitBookings: '',
        accountPackageBenefits: [{ benefit: { description: '' } }],
    });


    // Open modal and set up the package to be edited
    function handleEdit(pkg) {
        setSelectedPackage(pkg);
        setModalShow(true);
    }

    // Open modal for creating a new package
    function handleCreate() {
        setModalCreateShow(true);
    }

    // Initialize editedPackage only once when selectedPackage changes
    useEffect(() => {
        if (modalShow) {
            setEditedPackage(selectedPackage ? { ...selectedPackage } : null);
        }
    }, [selectedPackage, modalShow]);

    // Handle change for the edited package
    function handleChange(e) {
        const { name, value } = e.target;
        setEditedPackage((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Handle change for the new package
    function handleNewPackageChange(e) {
        const { name, value } = e.target;
        setNewPackage((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Handle benefit change for the edited package
    function handleBenefitChange(e, idx) {
        const { value } = e.target;
        const updatedBenefits = [...editedPackage.accountPackageBenefits];
        updatedBenefits[idx].benefit.description = value;
        setEditedPackage((prev) => ({
            ...prev,
            accountPackageBenefits: updatedBenefits,
        }));
    }



    // Save the updated package to the backend
    async function handleSaveUpdate() {
        try {
            const response = await fetch(`http://localhost:8080/rest/updateAccountPackage/${editedPackage.accountPackageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedPackage),
            });

            if (!response.ok) throw new Error('Failed to update package');

            await mutate();
            setModalShow(false);
            toast.success("cập nhật thành công !");
        } catch (error) {
            console.error('Error updating package:', error);
        }
    }
    const [selectedBenefitId, setSelectedBenefitId] = useState('');


    async function handleCreateSave() {
        try {
            console.log("sss", selectedBenefitId);

        } catch (error) {
            console.error('Error creating package:', error);
        }
    }



    // Memoize the modal for editing package
    const modalUpdate = useMemo(() => (
        <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {editedPackage?.packageName || 'Chi tiết gói đăng ký'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên gói</Form.Label>
                        <Form.Control
                            type="text"
                            name="packageName"
                            value={editedPackage?.packageName || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={editedPackage?.price || 0}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Thời hạn (ngày)</Form.Label>
                        <Form.Control
                            type="number"
                            name="durationDays"
                            value={editedPackage?.durationDays || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Lượt đặt sân tối đa</Form.Label>
                        <Form.Control
                            type="number"
                            name="limitBookings"
                            value={editedPackage?.limitBookings || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <div className="my-3">
                        <h5>Lợi ích</h5>
                        {editedPackage?.accountPackageBenefits?.map((benefitItem, idx) => (
                            <div key={idx}>
                                <Form.Control
                                    type="text"
                                    value={benefitItem.benefit.description}
                                    className='mb-2'
                                    onChange={(e) => handleBenefitChange(e, idx)}
                                />
                            </div>
                        ))}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setModalShow(false)}>Hủy</Button>
                <Button onClick={handleSaveUpdate}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    ), [modalShow, editedPackage]);

    // Memoize the modal for creating new package
    const modalCreate = useMemo(() => (
        <Modal
            show={modalCreateShow}
            onHide={() => setModalCreateShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Tạo Gói Đăng Ký Mới
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên gói</Form.Label>
                        <Form.Control
                            type="text"
                            name="packageName"
                            value={newPackage.packageName}
                            onChange={handleNewPackageChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={newPackage.price}
                            onChange={handleNewPackageChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Thời hạn (ngày)</Form.Label>
                        <Form.Control
                            type="number"
                            name="durationDays"
                            value={newPackage.durationDays}
                            onChange={handleNewPackageChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Lượt đặt sân tối đa</Form.Label>
                        <Form.Control
                            type="number"
                            name="limitBookings"
                            value={newPackage.limitBookings}
                            onChange={handleNewPackageChange}
                        />
                    </Form.Group>
                    <div className="my-3">
                        <h5>Lợi ích</h5>
                        <Form.Control
                            as="select"
                            className="mb-2"
                            value={selectedBenefitId || ''} // Ensure the select dropdown reflects the selected value
                            onChange={(e) => {
                                const newBenefitId = e.target.value;
                                setSelectedBenefitId(newBenefitId);
                                console.log(newBenefitId);  // Check if value is being updated correctly
                            }}

                        >
                            <option value="">----chọn lợi ích-----</option>
                            {dataBenefit && dataBenefit.length > 0 ? (
                                dataBenefit.map((benefit) => (
                                    <option key={benefit.benefitId} value={benefit.benefitId}>
                                        {benefit.description}
                                    </option>
                                ))
                            ) : (
                                <option value="">No benefits available</option>
                            )}

                        </Form.Control>

                    </div>


                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setModalCreateShow(false)}>Hủy</Button>
                <Button onClick={handleCreateSave}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    ), [modalCreateShow, newPackage]);

    return (
        <>
            <div className="box-ultil">
                <b className="text-danger" style={{ fontSize: '20px' }}>Quản Lý Gói Đăng Ký</b>
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={handleCreate}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm Gói Đăng Ký
                </Button>
            </div>

            {data && data.length > 0 ? (
                <Row className="my-3" style={{ fontSize: '15px' }}>
                    {data.map((pkg) => (
                        <Col xs={4} key={pkg.accountPackageId}>
                            <div className="card packageUpdate">
                                <b className="ms-3 mt-3 fs-5">{pkg.packageName || "Gói không tên"}</b>
                                <div className="body-package my-3">
                                    {pkg.accountPackageBenefits.map((benefitItem, idx) => (
                                        <div key={idx}>
                                            <i className="bi bi-check-circle me-2"></i>
                                            {benefitItem.benefit.description}
                                        </div>
                                    ))}
                                </div>
                                <b className="text-danger ms-3">{formatPrice(pkg.price) || "Miễn phí"} VND</b>
                                <Button className="btn-sub" onClick={() => handleEdit(pkg)}>Sửa</Button>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center">Chưa có dữ liệu</div>
            )}

            {modalUpdate}
            {modalCreate}
        </>
    );
};

export default SubcriptionPage;
