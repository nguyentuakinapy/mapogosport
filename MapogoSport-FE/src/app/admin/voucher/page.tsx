"use client";
import useSWR from "swr";
import { Suspense, useEffect, useState } from "react";
import { Badge, Button, Form, Nav, OverlayTrigger, Pagination, Table, Tooltip } from "react-bootstrap";
import "../adminStyle.scss";
import VoucherAddNew from "@/components/Admin/Modal/voucher.addNew";
import { useData } from "@/app/context/UserContext";
import { toast } from "react-toastify";
import Loading from "@/components/loading";

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAddVoucher, setShowAddVoucher] = useState<boolean>(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const BASE_URL = "http://localhost:8080";
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const currentUser = useData();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const { data, isLoading, error, mutate } = useSWR(`${BASE_URL}/rest/voucher/findAll`, fetcher);

  useEffect(() => {
    if (data) {
      setVouchers(data);
    }
  }, [data]);

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setShowAddVoucher(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredVouchers = vouchers.filter(voucher => {
    return (
      voucher.name.toLowerCase().includes(searchTerm) ||
      voucher.discountCode.toLowerCase().includes(searchTerm) ||
      (voucher.createdBy?.fullname?.toLowerCase()).includes(searchTerm)
    )
  }).filter(voucher => {
    switch (activeTab) {
      case 'valid': return voucher.status === "active";
      case 'inactive': return voucher.status === "inactive";
      default: return true;
    }
  }).filter(voucher => {
    if (selectedStatus === "activited") return voucher.status === "active" && new Date(voucher.endDate) > new Date();
    if (selectedStatus === "expired") return voucher.status === "inactive" && new Date(voucher.endDate) <= new Date();
    return true;
  });;

  const renderContent = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVouchers.slice(indexOfFirstItem, indexOfLastItem);
    return renderTable(currentItems);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(vouchers.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = async (voucherId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      fetch(`${BASE_URL}/rest/delete/voucher/${voucherId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        }
      }).then((res) => {
        if (!res.ok) {
          toast.error("xóa voucher không thành công");
          return;
        }
        toast.success("xóa voucher thành công");
        mutate();
      });
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value;
    setSelectedStatus(role);
  };

  const renderTable = (filteredVouchers: Voucher[]) => {
    return (
      <>
        {activeTab === "inactive" && (
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-funnel me-2 fs-4"></i>
            <Form.Select className="form-select" style={{ width: "auto" }} value={selectedStatus} onChange={handleSelectChange}>
              <option selected>Tất cả hết hiệu lực</option>
              <option value="activited">
                Còn hạn nhưng không còn hiệu lực
              </option>
              <option value="expired">Hết hạn và đã hết hiệu lực</option>
            </Form.Select>
          </div>
        )}

        <div className="box-table-border mb-4">
          <Table striped className="mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th style={{ width: "50px" }}>Mã</th>
                <th style={{ width: "100px" }}>Tên</th>
                <th>Giảm</th>
                <th>Số lượng</th>
                <th>Ngày tạo</th>
                <th>Ngày hoạt động</th>
                <th>Hết hạn</th>
                <th>Trạng thái</th>
                <th>Người tạo</th>
                <th>
                  <span className="ms-5">Thao tác</span>
                </th>
              </tr>
            </thead>
            {filteredVouchers.length > 0 ? (
              <tbody>
                {filteredVouchers.map((voucher, index) => (
                  <tr key={voucher.voucherId}>
                    <td>{index + 1}</td>
                    <td className="text-start title">{voucher.discountCode}</td>
                    <td className="text-start title">{voucher.name}</td>
                    <td>{voucher.discountPercent}%</td>
                    <td>{voucher.quantity}</td>
                    <td>{new Date(voucher.createDate).toLocaleDateString('vi-GB')}</td>
                    <td>{new Date(voucher.activeDate).toLocaleDateString('vi-GB')}</td>
                    <td>{new Date(voucher.endDate).toLocaleDateString('vi-GB')}</td>
                    <td>
                      <Badge bg={voucher.status === "active" ? "success" : "danger"}>
                        {voucher.status === "active" ? "Có hiệu lực" : "Không có hiệu lực"}
                      </Badge>
                    </td>
                    <td>{voucher.createdBy?.fullname}</td>
                    <td className="text-end">
                      <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                        <Button variant="link" className="btn-edit me-3" onClick={() => handleEdit(voucher)}>
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                        <Button disabled={voucher?.status === "inactive"} variant="link"
                          className="btn-edit me-3" onClick={() => handleDelete(voucher?.voucherId)}>
                          <i className="bi bi-trash3"></i>
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr >
                <td colSpan={11} className="text-center h6 ">
                  <p >Không có dữ liệu cho trạng thái này</p>
                </td>
              </tr>
            )}
          </Table>
        </div>
      </>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
    const pages = [];

    if (totalPages <= 1) return null;

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
        {pages}
        <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  if (isLoading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh', flexDirection: 'column' }}>
    <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#555' }}>Đang tải dữ liệu...</p>
    <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '20px' }}>
      <Loading />
    </div>
    <style jsx>{`
    p {
      animation: fadeIn 1.5s ease-in-out infinite;
    }
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `}</style>
  </div>

  if (error) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <div style={{ fontSize: "14px" }}>
        <div className="box-ultil">
          <b className="text-danger" style={{ fontSize: "20px" }}>
            Quản lý mã giảm giá/ Tổng: {vouchers?.length || 0} mã giảm giá
          </b>
          <div>
            <Form.Control type="text" placeholder="Tìm theo tên và địa chỉ..." onChange={handleSearchChange} />
          </div>
          <Button className="btn-sd-admin" style={{ fontSize: "15px" }}
            onClick={() => {
              setEditingVoucher(null);
              setShowAddVoucher(true);
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>Tạo mã giảm giá
          </Button>
        </div>
        <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
          <Nav.Item>
            <Nav.Link eventKey="all" className="tab-link">Toàn bộ</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="valid" className="tab-link">Còn hiệu lực</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="inactive" className="tab-link">Hết hiệu lực</Nav.Link>
          </Nav.Item>
        </Nav>
        {renderContent()}
        {renderPagination()}
        <VoucherAddNew currentUser={currentUser} showAddVoucher={showAddVoucher} setShowAddVoucher={setShowAddVoucher}
          voucher={editingVoucher} onFetch={mutate} />
      </div>
    </Suspense>
  );
};

export default VoucherPage;
