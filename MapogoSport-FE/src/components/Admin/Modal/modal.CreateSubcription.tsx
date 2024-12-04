import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface createSubcription {
    showCreateSub: boolean;
    setShowCreateSub: (v: boolean) => void;
}

const ModalCreateSubcription = (props: createSubcription) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const { showCreateSub, setShowCreateSub } = props;
    const [benefitData, setBenefitData] = useState<string>("");
    const [newPackage, setNewPackage] = useState<AccountPackage>({
        accountPackageId: 0, // Default value
        packageName: '',
        price: 0,
        durationDays: 0,
        limitBookings: 0,
        limitSportFields: 0,
        accountPackageBenefits: [],
        status: '', // Default value, adjust based on the expected type
    });


    const [benefitSelections, setBenefitSelections] = useState<Benefit[]>([]);

    const { data: dataBenefit, mutate: mutateBenefit } = useSWR<Benefit[]>(`${BASE_URL}rest/admin/find-all-benefit`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const handleClose = () => {
        setShowCreateSub(false);
        setNewPackage({
            accountPackageId: 0,
            packageName: '',
            price: 0,
            durationDays: 0,
            limitBookings: 0,
            limitSportFields: 0,
            accountPackageBenefits: [],
            status: '',
        })
    };

    const handleAddBenefit = async () => {
        try {
            const response = await fetch(`${BASE_URL}rest/add-benefit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: benefitData }),
            });

            if (!response.ok) {
                throw new Error('Failed to create benefit');
            }
            setBenefitData('');
            toast.success("Lợi ích đã được tạo thành công!");
            mutateBenefit();
        } catch (error) {
            console.error('Error creating benefit:', error);
            toast.error("Có lỗi xảy ra khi tạo lợi ích !");
        }
    };

    const handleBenefitSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const selectedBenefit = dataBenefit?.find((b) => b.description === e.target.value);
        if (!selectedBenefit) {
            toast.error("Lựa chọn không hợp lệ!");
            return;
        }
        const updatedSelections = [...benefitSelections];
        updatedSelections[index] = selectedBenefit;
        setBenefitSelections(updatedSelections);

        setNewPackage((prev) => {
            if (!prev) return prev;

            const updatedBenefits = updatedSelections.map((b) => ({
                benefit: b,
                accountPackageBenefitId: 0,
            }));

            return {
                ...prev,
                accountPackageBenefits: updatedBenefits,
            };
        });
    };

    const addBenefitSelection = () => {
        setBenefitSelections((prev) => [...prev, { benefitId: 0, description: '' }]);
    };

    const handleRemoveBenefitSelection = (index: number) => {
        setBenefitSelections((prev) => prev.filter((_, i) => i !== index));
    };

    const handleNewPackageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Loại bỏ tất cả các ký tự không phải số
        const rawValue = value.replace(/\D/g, "");

        // Định dạng giá trị thành số
        const numericValue = rawValue === "" ? 0 : Number(rawValue);

        // Định dạng số theo kiểu tiền tệ Việt Nam
        const formattedValue = new Intl.NumberFormat("vi-VN").format(numericValue);

        // Cập nhật state với giá trị đã định dạng
        setNewPackage((prev) => ({
            ...prev,
            [name]: name === 'price' ? formattedValue : value,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        // Khi mất focus, cập nhật lại giá trị gốc (số) trong state
        const { name, value } = e.target;
        const rawValue = value.replace(/\D/g, "");
        const numericValue = rawValue === "" ? 0 : Number(rawValue);
        setNewPackage((prev) => ({
            ...prev,
            [name]: name === 'price' ? numericValue : value,
        }));
    };

    const handleCreateSave = async () => {

        // Log dữ liệu nhập vào
        console.log("Dữ liệu gói đăng ký:", newPackage);
        console.log("Dữ liệu lợi ích đã chọn:", benefitSelections);
        // Step 1: Validate mandatory fields
        if (!newPackage || !newPackage.packageName || !newPackage.price || !newPackage.durationDays || !newPackage.limitBookings || newPackage.limitSportFields === 0) {
            toast.error("Vui lòng điền đầy đủ thông tin gói đăng ký!");
            return; // Dừng lại nếu có trường bắt buộc chưa được điền
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

        const packageInfo = {
            packageName: newPackage?.packageName,
            price: newPackage?.price,
            durationDays: newPackage?.durationDays,
            limitBookings: newPackage?.limitBookings,
            limitSportFields: newPackage?.limitSportFields || 0,
            accountPackageBenefits: uniqueBenefits.map((selection) => ({
                benefit: {
                    benefitId: selection.benefitId
                }
            }))
        };
        // Step 4: Send data to the backend (using your API endpoint)
        const response = await fetch(`${BASE_URL}rest/create-account-package`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(packageInfo),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Lỗi từ API:", errorText);
            throw new Error("Failed to create the subscription package");
        }
        mutate(`${BASE_URL}rest/accountpackage`);
        handleClose();
        toast.success("Gói đăng ký đã được tạo thành công!");
    }


    return (
        <>
            <Modal show={showCreateSub} size="lg" centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold" style={{ margin: 'auto' }}>
                        Tạo Gói Đăng Ký Mới
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Tên gói"
                                        value={newPackage.packageName}
                                        name="packageName" // Added name to match the state
                                        onChange={handleNewPackageChange}
                                    />
                                    <Form.Label>Tên gói <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Giá"
                                        value={newPackage.price} // Hiển thị giá trị số
                                        name="price" // Đảm bảo 'name' trùng với trường trong state
                                        onChange={handleNewPackageChange} // Gọi hàm khi giá trị thay đổi
                                        onBlur={handleBlur}
                                    />
                                    <Form.Label>Giá <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Số sân tối đa"
                                        value={newPackage.limitSportFields}
                                        name="limitSportFields" // Added name to match the state
                                        onChange={handleNewPackageChange}
                                    />
                                    <Form.Label>Số sân tối đa <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>

                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Thời hạn (ngày)"
                                        value={newPackage?.durationDays}
                                        name="durationDays" // Added name to match the state property
                                        onChange={handleNewPackageChange}
                                    />
                                    <Form.Label>Thời hạn (ngày) <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Lượt đặt sân tối đa"
                                        value={newPackage?.limitBookings}
                                        name="limitBookings" // Added name to match the state property
                                        onChange={handleNewPackageChange}
                                    />
                                    <Form.Label>Lượt đặt sân tối đa <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>

                            <InputGroup className="mb-3">
                                <Form.Floating className="mb-3 flex-grow-1">
                                    <Form.Control size="sm" type="text"
                                        placeholder="Số sân tối đa" value={benefitData}
                                        onChange={(e) => setBenefitData(e.target.value)} />
                                    <Form.Label>Thêm lợi ích (nếu có) <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                                <Button variant="danger" style={{ maxHeight: '58px' }} onClick={handleAddBenefit}>
                                    Thêm
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>

                    {/* // UI cho phần chọn lợi ích */}
                    <div className="mb-2">Lợi ích</div>
                    {benefitSelections.map((selection, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <Form.Select value={selection.description || ''} onChange={(e) => handleBenefitSelectChange(e, index)}
                                className="me-2">
                                <option value="">----chọn lợi ích-----</option>
                                {dataBenefit && dataBenefit.length > 0 ? (
                                    dataBenefit.map((benefit: Benefit) => (
                                        <option key={benefit.benefitId} value={benefit.description}>
                                            {benefit.description}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Không có lợi ích có sẵn.</option>
                                )}
                            </Form.Select>
                            {index > 0 && ( // Điều kiện để chỉ hiển thị nút xóa từ phần tử thứ 2 trở đi
                                <Button variant="danger" onClick={() => handleRemoveBenefitSelection(index)}>
                                    Xóa
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button variant="link" onClick={addBenefitSelection}>+ Thêm lợi ích</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                    <Button style={{ background: '#142239', border: '1px solid #142239' }} onClick={handleCreateSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalCreateSubcription;