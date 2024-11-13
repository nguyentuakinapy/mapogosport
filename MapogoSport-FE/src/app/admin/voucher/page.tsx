"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Nav,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import "../adminStyle.scss";
import VoucherAddNew from "@/components/Admin/Modal/voucher.addNew";
import { useData } from "@/app/context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAddVoucher, setShowAddVoucher] = useState<boolean>(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const BASE_URL = "http://localhost:8080";
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const voucherFetch = useSWR(`${BASE_URL}/rest/voucher/findAll`, fetcher);

  useEffect(() => {
    if (voucherFetch?.data) {
      setVouchers(voucherFetch?.data);
    }
  }, [voucherFetch?.data]);

  const currentUser = useData();

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setShowAddVoucher(true);
  };

  const isConfirmed = () => {
    return window.confirm("Bạn có chắc chắn muốn xóa voucher này?");
  };

  const handleDelete = async (voucherId: number) => {
    if (!isConfirmed()) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    if (voucherId) {
      try {
        const response = await axios.put(
          `${BASE_URL}/rest/delete/voucher/${voucherId}`
        );
        toast.success("xóa voucher thành công");
        console.log(response.data);
        voucherFetch.mutate;
      } catch (error) {
        toast.error("xóa voucher không thành công");
      console.error("Error deleting ProductDetailSize:", error);
      }
    }
  };

  const renderContent = () => {
    return (
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
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.voucherId}>
                <td>{voucher.voucherId}</td>
                <td className="text-start title">{voucher.discountCode}</td>
                <td className="text-start title">{voucher.name}</td>
                <td>{voucher.discountPercent}%</td>
                <td>{voucher.quantity}</td>
                <td>{new Date(voucher.createDate).toLocaleDateString()}</td>
                <td>{new Date(voucher.activeDate).toLocaleDateString()}</td>
                <td>{new Date(voucher.endDate).toLocaleDateString()}</td>
                <td>
                  <Badge
                    bg={voucher.status === "active" ? "success" : "danger"}
                  >
                    {voucher.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                  </Badge>
                </td>
                <td>{voucher.createdBy}</td>
                <td>
                  <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                    <Button
                      variant="link"
                      className="btn-edit me-3"
                      onClick={() => handleEdit(voucher)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                    <Button
                    disabled={voucher?.status === "inactive"}
                      variant="link"
                      className="btn-edit me-3"
                      onClick={() => handleDelete(voucher?.voucherId)}
                    >
                      <i className="bi bi-trash3"></i>
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  if (voucherFetch.isLoading) return <div>Đang loading dữ liệu voucher</div>;
  return (
    <div style={{ fontSize: "14px" }}>
      <div className="box-ultil">
        <b className="text-danger" style={{ fontSize: "20px" }}>
          Quản lý voucher/ Tổng: {vouchers?.length || 0} voucher
        </b>
        <Button
          className="btn-sd-admin"
          style={{ fontSize: "15px" }}
          onClick={() => {
            setEditingVoucher(null);
            setShowAddVoucher(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Tạo Voucher
        </Button>
      </div>
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(selectedKey) => setActiveTab(selectedKey as string)}
        className="custom-tabs my-3"
      >
        <Nav.Item>
          <Nav.Link eventKey="all" className="tab-link">
            Toàn bộ
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="activited" className="tab-link">
            Đang hoạt động
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="expired" className="tab-link">
            Đã hết hạn
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="mt-3">{renderContent()}</div>
      <VoucherAddNew
        currentUser={currentUser}
        showAddVoucher={showAddVoucher}
        setShowAddVoucher={setShowAddVoucher}
        voucher={editingVoucher}
        onFetch={voucherFetch.mutate}
      />
    </div>
  );
};

export default VoucherPage;
