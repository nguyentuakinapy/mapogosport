import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface subscriptionProps {
    showUpdateSub: boolean;
    setShowUpdateSub: (v: boolean) => void;
    selectedPackage?: AccountPackage;
}

const ModalUpdateSubcription = (props: subscriptionProps) => {
    const { showUpdateSub, setShowUpdateSub, selectedPackage } = props;
    const [editedPackage, setEditedPackage] = useState<AccountPackage>();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (selectedPackage) {
            setEditedPackage({ ...selectedPackage });
        }
    }, [selectedPackage]);

    const handleClose = () => {
        setShowUpdateSub(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedPackage((prev) => (prev && {
            ...prev,
            [name]: value,
        }));
    }

    const handleSaveUpdate = async () => {
        try {
            const response = await fetch(`${BASE_URL}rest/updateAccountPackage/${editedPackage?.accountPackageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedPackage),
            });
            if (!response.ok) throw new Error('Failed to update package');
            setShowUpdateSub(false);
            toast.success("cập nhật thành công !");
            mutate(`${BASE_URL}rest/accountpackage`);
            handleClose();
        } catch (error) {
            console.error('Error updating package:', error);
        }
    }

    return (
        <>
            <Modal show={showUpdateSub} size="lg" centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold" style={{ margin: 'auto' }}>
                        Chi tiết gói đăng ký
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên gói</Form.Label>
                                    <Form.Control disabled={editedPackage?.packageName === 'Gói miễn phí'}
                                        type="text" name="packageName" value={editedPackage?.packageName || ''}
                                        onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá</Form.Label>
                                    <Form.Control disabled={editedPackage?.packageName === 'Gói miễn phí'}
                                        type="number" name="price" value={editedPackage?.price || 0} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Thời hạn (ngày)</Form.Label>
                                    <Form.Control type="number" name="durationDays"
                                        value={editedPackage?.durationDays || ''} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lượt đặt sân tối đa</Form.Label>
                                    <Form.Control disabled type="number" name="limitBookings"
                                        value={editedPackage?.limitBookings || ''} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Số sân tối đa</Form.Label>
                            <Form.Control disabled type="number" name="limitSportFields"
                                value={editedPackage?.limitSportFields || ''} onChange={handleChange} />
                        </Form.Group>
                        <div className="my-3">
                            <div className="mb-2">Lợi ích</div>
                            {editedPackage?.accountPackageBenefits?.map((benefitItem, idx) => (
                                <div key={idx}>
                                    <Form.Control disabled type="text" className='mb-2' value={benefitItem.benefit.description} />
                                </div>
                            ))}
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                    <Button style={{ background: '#142239', border: '1px solid #142239' }} onClick={handleSaveUpdate}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalUpdateSubcription;