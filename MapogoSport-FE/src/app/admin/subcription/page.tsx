'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';
import useSWR from 'swr';
import { formatPrice } from '@/components/Utils/Format';
import { toast } from 'react-toastify';
import axios from 'axios';

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
        limitSportFields: '',
        status: '',
        accountPackageBenefits: [{
            benefit: {
                benefitId: '',
                description: ''
            }
        }],
    });


    // Open modal and set up the package to be edited
    const handleEdit = (pkg) => {
        setSelectedPackage(pkg);
        setModalShow(true);
    }

    // const handleDelete = async (pkg) => {


    //     try {
    //         // Yêu cầu người dùng xác nhận trước khi xóa
    //         const confirmed = window.confirm("Bạn có chắc chắn muốn vô  hiệu hóa này?");
    //         if (!confirmed) return; // Thoát nếu người dùng hủy

    //         // Xóa gói tài khoản (nếu cần thiết)
    //         const packageDeleteResponse = await axios.delete(`http://localhost:8080/rest/delete/account-package/${pkg.accountPackageId}`);
    //         if (packageDeleteResponse.status !== 200) throw new Error('Xóa gói tài khoản thất bại');

    //         // Xóa từng lợi ích trong gói tài khoản
    //         const benefitDeletionPromises = pkg.accountPackageBenefits.map(async (benefit) => {
    //             const benefitId = benefit.accountPackageBenefitId;

    //             // Gửi yêu cầu xóa lợi ích từ server
    //             const response = await axios.delete(`http://localhost:8080/rest/delete-account-package-benefits/${benefitId}`);
    //             if (response.status !== 200) {
    //                 throw new Error(`Xóa lợi ích với ID: ${benefitId} thất bại`);
    //             }

    //             // Trả về ID lợi ích đã xóa để cập nhật lại giao diện
    //             return benefit.accountPackageBenefitId;
    //         });

    //         // Chờ tất cả các lệnh xóa lợi ích hoàn thành
    //         const deletedBenefitIds = await Promise.all(benefitDeletionPromises);

    //         // Cập nhật lại danh sách lợi ích sau khi xóa
    //         pkg.accountPackageBenefits = pkg.accountPackageBenefits.filter((benefit) =>
    //             !deletedBenefitIds.includes(benefit.accountPackageBenefitId)
    //         );

    //         // Tải lại dữ liệu sau khi xóa thành công
    //         await mutate();
    //         toast.success("Xóa gói thành công!");
    //     } catch (error) {
    //         console.error('Lỗi khi xóa lợi ích:', error);
    //         toast.error("Có lỗi xảy ra khi xóa lợi ích!");
    //     }
    // }


    const handleUnActive = async (pkg) => {
        const confirmed = window.confirm(
            pkg?.status === "un active"
                ? `Bạn có chắc chắc muốn khôi phục Gói ${pkg?.packageName}?`
                : `Bạn có chắc chắn muốn vô hiệu Gói ${pkg?.packageName}?`
        );
        if (!confirmed) return; // Thoát nếu người dùng từ chối

        try {
            // Xác định trạng thái mới dựa trên trạng thái hiện tại của gói
            const newStatus = pkg.status === "un active" ? "active" : "un active";

            // Cập nhật dữ liệu gói
            const data = {
                ...pkg,
                status: newStatus,
                accountPackageBenefits: pkg?.accountPackageBenefits?.map((benefit) => ({
                    accountPackageBenefitId: benefit.accountPackageBenefitId,
                    benefit: {
                        benefitId: benefit.benefit.benefitId,
                        description: benefit.benefit.description,
                    },
                })) || [],
            };

            // Gửi yêu cầu cập nhật lên API
            const response = await fetch(
                `http://localhost:8080/rest/updateAccountPackage/${pkg.accountPackageId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update package");
            }

            // Cập nhật UI và thông báo thành công
            await mutate(); // Làm mới dữ liệu
            setModalShow(false);
            toast.success(
                newStatus === "un active"
                    ? `Bạn đã vô hiệu gói ${pkg?.packageName}`
                    : `Bạn đã khôi phục gói ${pkg?.packageName}`
            );
        } catch (error) {
            console.error("Error updating package:", error);
            toast.error("Đã xảy ra lỗi khi vô hiệu hóa gói!");
        }
    };





    const handleCreate = () => {
        setModalCreateShow(true);
    }


    // Initialize editedPackage only once when selectedPackage changes
    useEffect(() => {
        if (modalShow) {
            setEditedPackage(selectedPackage ? { ...selectedPackage } : null);
        }
    }, [selectedPackage, modalShow]);

    // Handle change for the edited package
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedPackage((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Handle change for the new package
    const handleNewPackageChange = (e) => {
        const { name, value } = e.target;
        setNewPackage((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Handle benefit change for the edited package
    const handleBenefitChange = (e, idx) => {
        const { value } = e.target;
        const updatedBenefits = [...editedPackage.accountPackageBenefits];
        updatedBenefits[idx].benefit.description = value;
        setEditedPackage((prev) => ({
            ...prev,
            accountPackageBenefits: updatedBenefits,
        }));
    }



    // Save the updated package to the backend
    const handleSaveUpdate = async () => {
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

    const handleCreateSave = async () => {
        try {
            // Step 1: Validate mandatory fields
            if (!newPackage.packageName || !newPackage.price || !newPackage.durationDays || !newPackage.limitBookings || newPackage.limitSportFields === '') {
                toast.error("Vui lòng điền đầy đủ thông tin gói đăng ký!");
                return; // Stop execution if any required field is missing
            }

            // Step 2: Check for at least one benefit
            if (benefitSelections.length === 0 || benefitSelections.some(selection => !selection.benefitId || !selection.description)) {
                toast.error("Vui lòng chọn ít nhất một lợi ích!");
                return;
            }

            // Step 3: Remove duplicates from benefit selections
            const uniqueBenefitIds = new Set();
            const uniqueBenefits = benefitSelections.filter((selection) => {
                if (uniqueBenefitIds.has(selection.benefitId)) {
                    return false;  // Skip if the benefitId is already used
                }
                uniqueBenefitIds.add(selection.benefitId);  // Add to the set
                return true;
            });

            // Prepare the package data to send to the server
            const packageInfo = {
                packageName: newPackage.packageName,
                price: newPackage.price,
                durationDays: newPackage.durationDays,
                limitBookings: newPackage.limitBookings,
                limitSportFields: newPackage.limitSportFields || 0, // Ensure it's not null
                status: '',
                accountPackageBenefits: uniqueBenefits.map((selection) => ({
                    benefit: {
                        benefitId: selection.benefitId
                    }
                }))
            };

            // Step 4: Send data to the backend (using your API endpoint)
            const response = await fetch('http://localhost:8080/rest/create-account-package', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(packageInfo),
            });

            if (!response.ok) {
                throw new Error('Failed to create the subscription package');
            }

            // Step 5: After successful save, update the UI
            await mutate();  // Re-fetch the data from the server to update the subscription list
            setModalCreateShow(false);  // Close the modal
            toast.success("Gói đăng ký đã được tạo thành công!");  // Show success message

        } catch (error) {
            console.error('Error creating package:', error);
            toast.error("Có lỗi xảy ra khi tạo gói đăng ký!");  // Show error message
        }
    }

    const [benefitData, setBenefitData] = useState<string>("");

    const handleAddBenefit = async () => {
        try {
            const data = {
                description: benefitData, // Use benefitData instead of dataBenefit
            };
            const response = await fetch('http://localhost:8080/rest/add-benefit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create benefit');
            }

            await mutateBenefit();
            setBenefitData('');
            toast.success("Lợi ích đã được tạo thành công!");
        } catch (error) {
            console.error('Error creating benefit:', error);
            toast.error("Có lỗi xảy ra khi tạo lợi ích !");
        }
    };



    // Hàm xử lý khi chọn lợi ích từ dropdown
    const handleBenefitSelectChange = (e, index) => {
        const { value } = e.target;
        const selectedBenefit = dataBenefit.find((benefit) => benefit.description === value);
        const updatedSelections = [...benefitSelections];
        updatedSelections[index] = { benefitId: selectedBenefit.benefitId, description: value };
        setBenefitSelections(updatedSelections);

        // Cập nhật vào newPackage
        setNewPackage((prev) => ({
            ...prev,
            accountPackageBenefits: updatedSelections.map((item) => ({
                benefit: {
                    benefitId: '',
                    description: item.description
                },
            })),
        }));
    }


    // Memoize the modal for editing package
    const modalUpdate = useMemo(() => (
        <Modal
            show={modalShow}
            onHide={() => {
                setModalShow(false);
                setEditedPackage(null); // Reset the edited package when modal is closed
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Chi tiết gói đăng ký
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3">
                        <Form.Label>Tên gói</Form.Label>
                        <Form.Control
                            disabled={editedPackage?.packageName === 'Gói miễn phí'}
                            type="text"
                            name="packageName"
                            value={editedPackage?.packageName || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control
                            disabled={editedPackage?.packageName === 'Gói miễn phí'}
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
                            disabled
                            type="number"
                            name="limitBookings"
                            value={editedPackage?.limitBookings || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Số sân tối đa</Form.Label>
                        <Form.Control
                            disabled
                            type="number"
                            name="limitSportFields"
                            value={editedPackage?.limitSportFields || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <div className="my-3">
                        <h5>Lợi ích</h5>
                        {editedPackage?.accountPackageBenefits?.map((benefitItem, idx) => (
                            <div key={idx}>
                                <Form.Control
                                    disabled
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



    const [benefitSelections, setBenefitSelections] = useState([{ benefitId: '', description: '' }]);
    // Hàm để thêm một dropdown mới cho lựa chọn lợi ích
    const addBenefitSelection = () => {
        setModalCreateShow(false); // Đóng modal trước
        setBenefitSelections((prev) => [...prev, { benefitId: '', description: '' }]);

        setTimeout(() => {
            setModalCreateShow(true); // Mở lại modal sau khi cập nhật
        }, 0);
    };
    const handleRemoveBenefitSelection = (index) => {
        setBenefitSelections((prev) => prev.filter((_, i) => i !== index));

        // Cập nhật lại `newPackage` để loại bỏ lợi ích đã xóa
        setNewPackage((prev) => ({
            ...prev,
            accountPackageBenefits: benefitSelections
                .filter((_, i) => i !== index) // loại bỏ lợi ích đã xóa
                .map((item) => ({
                    benefit: {
                        benefitId: '',
                        description: item.description
                    },
                })),
        }));
    };







    // Memoize the modal for creating new package
    const modalCreate = useMemo(() => (
        <Modal
            show={modalCreateShow}
            onHide={() => {
                setModalCreateShow(false);
                setNewPackage({
                    packageName: '',
                    price: 0,
                    durationDays: '',
                    limitBookings: '',
                    limitSportFields: '',
                    status: '',
                    accountPackageBenefits: [{
                        benefit: {
                            benefitId: '',
                            description: ''
                        }
                    }],
                }); // Reset new package when modal is closed
                setBenefitData('')
                setBenefitSelections([{ benefitId: '', description: '' }]); // Reset benefit selections
            }}
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
                    <Form.Group className="mb-3">
                        <Form.Label>Số sân tối đa</Form.Label>
                        <Form.Control
                            type="number"
                            name="limitSportFields"
                            value={newPackage.limitSportFields}
                            onChange={handleNewPackageChange}
                        />
                    </Form.Group>
                    <div className="d-flex">
                        <Form.Group className="mb-3 w-75">
                            <Form.Label>Thêm lợi ích (nếu có)</Form.Label>
                            <Form.Control
                                type="text"
                                value={benefitData}
                                onChange={(e) => setBenefitData(e.target.value)}
                            />
                        </Form.Group>
                        <Button onClick={handleAddBenefit} className="w-25 m-auto mb-3 ms-2">
                            Thêm
                        </Button>
                    </div>

                    {/* // UI cho phần chọn lợi ích */}
                    <div className="my-3">
                        <h5>Lợi ích</h5>
                        {benefitSelections.map((selection, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <Form.Control
                                    as="select"
                                    value={selection.description || ''}
                                    onChange={(e) => handleBenefitSelectChange(e, index)}
                                    className="me-2" // thêm margin bên phải
                                >
                                    <option value="">----chọn lợi ích-----</option>
                                    {dataBenefit && dataBenefit.length > 0 ? (
                                        dataBenefit.map((benefit) => (
                                            <option key={benefit.benefitId} value={benefit.description}>
                                                {benefit.description}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No benefits available</option>
                                    )}
                                </Form.Control>
                                {index > 0 && ( // Điều kiện để chỉ hiển thị nút xóa từ phần tử thứ 2 trở đi
                                    <Button variant="danger" onClick={() => handleRemoveBenefitSelection(index)}>
                                        Xóa
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button variant="link" onClick={addBenefitSelection}>+ Thêm lợi ích</Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setModalCreateShow(false)}>Hủy</Button>
                <Button onClick={handleCreateSave}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    ), [modalCreateShow, newPackage, , benefitData, benefitSelections, dataBenefit]);

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
                                <div className="d-flex">
                                    <Button disabled={pkg?.status === 'un active'} className="btn-sub w-75" onClick={() => handleEdit(pkg)}>Sửa</Button>
                                    <Button className="btn-sub w-25" onClick={() => handleUnActive(pkg)}> {pkg?.status === 'un active' ? 'Đang vô hiệu' : 'Vô hiệu hóa'}</Button>
                                </div>

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
