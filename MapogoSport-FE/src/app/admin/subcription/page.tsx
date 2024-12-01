'use client';
import React, { Suspense, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import useSWR from 'swr';
import { formatPrice } from '@/components/Utils/Format';
import { toast } from 'react-toastify';
import ModalUpdateSubcription from '@/components/Admin/Modal/modal.UpdateSubciption';
import ModalCreateSubcription from '@/components/Admin/Modal/modal.CreateSubcription';

const SubcriptionPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = 'http://localhost:8080/rest/';

    const [showUpdateSub, setShowUpdateSub] = useState(false);
    const [showCreateSub, setShowCreateSub] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<AccountPackage>();

    const { data, mutate } = useSWR(`${BASE_URL}accountpackage`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const handleEdit = (pkg: AccountPackage) => {
        setSelectedPackage(pkg);
        setShowUpdateSub(true);
    }

    const handleUnActive = async (pkg: AccountPackage) => {
        const confirmed = window.confirm(
            pkg?.status === "un active" ? `Bạn có chắc chắc muốn khôi phục Gói "${pkg?.packageName}"?`
                : `Bạn có chắc chắn muốn vô hiệu Gói "${pkg?.packageName}"?`
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
                `${BASE_URL}updateAccountPackage/${pkg.accountPackageId}`,
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

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <div className="box-ultil">
                <b className="text-danger" style={{ fontSize: '20px' }}>Quản Lý Gói Đăng Ký</b>
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={() => setShowCreateSub(true)}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm Gói Đăng Ký
                </Button>
            </div>

            {data && data.length > 0 ? (
                <Row style={{ fontSize: '15px' }}>
                    {data.map((pkg: AccountPackage) => (
                        <Col xs={4} key={pkg.accountPackageId} className='mt-4'>
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
                                <b className="text-danger ms-3">{formatPrice(pkg.price) || "Miễn phí"}</b>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button disabled={pkg?.status === 'un active'} className="btn-sub" onClick={() => handleEdit(pkg)}>Sửa</Button>
                                    <Button className="btn-sub" onClick={() => handleUnActive(pkg)}> {pkg?.status === 'un active' ? 'Đang vô hiệu' : 'Vô hiệu hóa'}</Button>
                                </div>

                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center">Chưa có dữ liệu</div>
            )}

            <ModalUpdateSubcription showUpdateSub={showUpdateSub} setShowUpdateSub={setShowUpdateSub} selectedPackage={selectedPackage} />
            <ModalCreateSubcription showCreateSub={showCreateSub} setShowCreateSub={setShowCreateSub} />
        </Suspense>
    );
};

export default SubcriptionPage;
