'use client'
import { formatPrice } from '@/components/Utils/Format';
import { useState } from 'react';
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';
import useSWR from 'swr';

const SubcriptionPage = () => {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, mutate } = useSWR('http://localhost:8080/rest/accountpackage', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [modalShow, setModalShow] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [editedPackage, setEditedPackage] = useState(null);

    // Handle edit button click
    function handleEdit(pkg) {
        setSelectedPackage(pkg);
        setEditedPackage({ ...pkg });
        setModalShow(true);
    }

    // Handle input changes
    function handleChange(e) {
        const { name, value } = e.target;
        setEditedPackage((prev) => ({ ...prev, [name]: value }));
    }



    function MyVerticallyCenteredModal({ show, onHide, pkg }) {
        // Handle save button click
        async function handleSave() {
            // Perform the API update here, assuming PUT method is used.
            // try {
            //     await fetch(`http://localhost:8080/rest/accountpackage/${pkg?.accountPackageId}`, {
            //         method: 'PUT',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify(editedPackage),
            //     });
            //     setModalShow(false);
            //     mutate('http://localhost:8080/rest/accountpackage'); // Refresh the SWR data
            // } catch (error) {
            //     console.error("Error updating package:", error);
            console.log("accountPackageId", pkg?.accountPackageId);

            // }
        }
        return (
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {pkg?.packageName || 'Chi tiết gói đăng ký'}
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide}>Hủy</Button>
                    <Button onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <div>
            <div className="box-ultil">
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Gói Đăng Ký</b>
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm Gói Đăng Ký
                </Button>
            </div>

            {data && data.length > 0 ? (
                <Row className="my-3" style={{ fontSize: '15px' }}>
                    {data.map((pkg, index) => (
                        <Col xs={4} key={pkg.packageId || index}>
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
                                <b className="text-danger ms-3">{formatPrice(pkg.price) ? `${formatPrice(pkg.price)} VND` : "Miễn phí"}</b>
                                <Button className='btn-sub' onClick={() => handleEdit(pkg)}>Sửa</Button>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center">Chưa có dữ liệu</div>
            )}

            {selectedPackage && (
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    pkg={selectedPackage}
                />
            )}
        </div>
    );
};

export default SubcriptionPage;
