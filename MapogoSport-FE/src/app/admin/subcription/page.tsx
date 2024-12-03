'use client';
import React, { Suspense, useState } from 'react';
import { Button, Col, FormSelect, Pagination, Row, Table } from 'react-bootstrap';
import useSWR from 'swr';
import { formatDateVN, formatPrice } from '@/components/Utils/Format';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import ModalUpdateSubcription from '@/components/Admin/Modal/modal.UpdateSubciption';
import ModalCreateSubcription from '@/components/Admin/Modal/modal.CreateSubcription';
import { UserSubscription } from '@/types/userSubscription';

const SubcriptionPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [showUpdateSub, setShowUpdateSub] = useState(false);
    const [showCreateSub, setShowCreateSub] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<AccountPackage>();
    const [selectedValue, setSelectedValue] = useState<string>("");

    const { data, mutate } = useSWR(`${BASE_URL}rest/accountpackage`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const { data: dataUserSubs } = useSWR(`${BASE_URL}rest/userSubscription`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const { data: filterDataUserSubs } = useSWR(`${BASE_URL}rest/userSubscription/${selectedValue}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const handleEdit = (pkg: AccountPackage) => {
        setSelectedPackage(pkg);
        setShowUpdateSub(true);

    };


    const handleUnActive = async (pkg: AccountPackage) => {
        const confirmed = window.confirm(
            pkg?.status === "un active"
                ? `Bạn có chắc chắc muốn khôi phục Gói "${pkg?.packageName}"?`
                : `Bạn có chắc chắn muốn vô hiệu Gói "${pkg?.packageName}"?`
        );
        if (!confirmed) return;

        try {
            const newStatus = pkg.status === "un active" ? "active" : "un active";

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

            const response = await fetch(
                `${BASE_URL}rest/updateAccountPackage/${pkg.accountPackageId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update package");
            }

            await mutate();
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

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setSelectedValue(e.target.value);
        setCurrentPage(1);  // Reset to the first page when selecting a new package
    };

    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    // For dataUserSubs
    const totalPagesDataUserSubs = dataUserSubs ? Math.ceil((dataUserSubs?.length || 0) / itemsPerPage) : 1;
    const currentUserSubsDataUserSubs = dataUserSubs?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

    // For filterDataUserSubs
    const totalPagesFilterDataUserSubs = filterDataUserSubs ? Math.ceil((filterDataUserSubs?.length || 0) / itemsPerPage) : 1;
    const currentUserSubsFilterDataUserSubs = filterDataUserSubs?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = selectedValue ? totalPagesFilterDataUserSubs : totalPagesDataUserSubs;
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPagination = () => {
        const totalPages = selectedValue ? totalPagesFilterDataUserSubs : totalPagesDataUserSubs;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className='d-flex justify-content-center'>
                <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

    const [exportOption, setExportOption] = useState(''); // State để điều khiển giá trị của FormSelect
    const exportToExcel = async () => {
        try {
            const getOrderData = () => {
                return selectedValue ? filterDataUserSubs : dataUserSubs;
            };

            const workbook = new ExcelJS.Workbook();
            const worksheet1 = workbook.addWorksheet('Danh sách gói đăng ký');

            // Định dạng các cột
            worksheet1.columns = [
                { header: 'STT', key: 'index', width: 5 },
                { header: 'Tên Khách Hàng', key: 'fullname', width: 25 },
                { header: 'Tên gói', key: 'packageName', width: 15 },
                { header: 'Ngày đăng ký', key: 'startDay', width: 15 },
                { header: 'Ngày hết hạn', key: 'endDay', width: 15 },
            ];

            const orderData = getOrderData();

            if (!orderData || orderData.length === 0) {
                toast.warning('Không có dữ liệu để xuất!');
                return;
            }

            orderData.forEach((userSubs: UserSubscription, index: number) => {
                worksheet1.addRow({
                    index: index + 1,
                    fullname: userSubs?.user?.fullname || 'Chưa có tên',
                    packageName: userSubs?.accountPackage?.packageName || 'Chưa có tên gói',
                    startDay: formatDateVN(userSubs?.startDay),
                    endDay: userSubs?.accountPackage?.packageName === "Gói miễn phí" ? "Không giới hạn" : formatDateVN(userSubs?.endDay),
                });
            });

            // Generate filename
            const today = new Date();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const filename = `Danh Sách gói đăng ký (${day}/${month}).xlsx`;

            // Save the file
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), filename);
            setExportOption(''); // Reset nút về mặc định

            // Success message
            toast.success('Đã xuất file Excel thành công!');
        } catch (error) {
            console.error('Error exporting Excel file:', error);
            toast.error('Có lỗi xảy ra khi xuất file!');
        }
    };



    return (
        <>
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
                                        {pkg.accountPackageBenefits?.map((benefitItem, idx) => (
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

            <div className="d-flex">
                <FormSelect name="" id="" className='mt-5 me-2' style={{ width: '200px', marginLeft: 'auto' }} onChange={handleOnChange}>
                    <option value="">----Chọn gói----</option>
                    {data?.map((pkg: AccountPackage) => (
                        <option key={pkg.packageName} value={pkg.accountPackageId}>
                            {pkg.packageName}
                        </option>
                    ))}
                </FormSelect>
                <FormSelect
                    name=""
                    id=""
                    className="mt-5"
                    style={{ width: '200px' }}
                    value={exportOption} // Liên kết giá trị với state
                    onChange={(e) => {
                        const selectedValue = e.target.value;
                        setExportOption(selectedValue); // Cập nhật state
                        if (selectedValue === 'Excel') {
                            exportToExcel();
                        }
                    }}
                >
                    <option value="">----Export----</option>
                    <option value="Excel">Excel</option>
                </FormSelect>
            </div>


            <Table striped bordered hover className='mt-4'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên Khách Hàng</th>
                        <th>Tên gói</th>
                        <th>Ngày đăng ký</th>
                        <th>Ngày hết hạn</th>
                    </tr>
                </thead>
                <tbody>
                    {(selectedValue ? currentUserSubsFilterDataUserSubs : currentUserSubsDataUserSubs).map((userSubs: UserSubscription, index: number) => (
                        <tr key={userSubs.userSubscriptionId}>
                            <td>{index + 1}</td>
                            <td>{userSubs.user.fullname}</td>
                            <td>{userSubs.accountPackage.packageName}</td>
                            <td>{formatDateVN(userSubs.startDay)}</td>
                            <td>{userSubs.accountPackage.packageName == "Gói miễn phí" ? "không giới hạn" : userSubs.endDay}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {renderPagination()}
        </>
    );
};

export default SubcriptionPage;
