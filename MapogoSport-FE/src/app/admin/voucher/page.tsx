"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
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
  interface Voucher {
    voucherId?: number;
    name: string;
    discountPercent: number;
    quantity: number;
    createDate: Date;
    endDate: Date;
    status: string;
    discountCode: string;
    activeDate: Date;
    createdBy: User;
  }

  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAddVoucher, setShowAddVoucher] = useState<boolean>(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const BASE_URL = "http://localhost:8080";
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const voucherFetch = useSWR(`${BASE_URL}/rest/voucher/findAll`, fetcher);

  useEffect(() => {
    if (voucherFetch?.data) {
      setVouchers(voucherFetch?.data);
    }
  }, [voucherFetch?.data]);

  const currentUser = useData();

  const handleEdit = (voucher: Voucher) => {
    console.log("dddddđ " + voucher?.name);

    setEditingVoucher(voucher);
    setShowAddVoucher(true);
  };

  const isConfirmed = () => {
    return window.confirm("Bạn có chắc chắn muốn xóa voucher này?");
  };

  // tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Lọc voucher theo tìm kiếm và ngày
  const filteredVouchers = vouchers.filter((voucher) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const isMatchingSearch =
      voucher.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      voucher.discountCode.toLowerCase().includes(lowerCaseSearchTerm) ||
      (voucher.createdBy?.username?.toLowerCase() || "").includes(
        lowerCaseSearchTerm
      );

    const isWithinDateRange =
      (startDate
        ? new Date(voucher.activeDate) >= new Date(startDate)
        : true) &&
      (endDate ? new Date(voucher.endDate) <= new Date(endDate) : true);

    // Lọc theo trạng thái tab
    const isTabMatch = (activeTab: string) => {
      switch (activeTab) {
        case "all": // Toàn bộ
          return true;
        // case "activited": // Đang hoạt động
        //   return (
        //     voucher.status === "active" &&
        //     new Date(voucher.activeDate) <= new Date()
        //   );
        // case "expired": // Đã hết hạn
        //   return new Date(voucher.endDate) < new Date();
        case "valid": // Còn hiệu lực
          return (
            voucher.status === "active" &&
            new Date(voucher.activeDate) <= new Date() &&
            new Date(voucher.endDate) > new Date()
          );
        case "inactive": // Hết hiệu lực
          if (selectedStatus === "expired") {
            // Đã hết hạn
            return new Date(voucher.endDate) < new Date();
          } else if (selectedStatus === "activited") {
            return (
              voucher.status === "inactive" && // Đang hoạt động
              new Date(voucher.endDate) >= new Date()
            );
          } else {
            return (
              voucher.status === "inactive" ||
              new Date(voucher.endDate) < new Date()
            );
          }
        default:
          return true;
      }
    };

    return isMatchingSearch && isWithinDateRange && isTabMatch(activeTab);
    // return isMatchingSearch && isWithinDateRange;
  });
  // tìm kiếm

  // phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Số lượng voucher mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVouchers = filteredVouchers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  //

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value;
    setSelectedStatus(role);
  };
  useEffect(() => {
    console.log("search  ", selectedStatus);
  }, [selectedStatus]);

  const renderContent = () => {
    return (
      <>
        {activeTab === "inactive" && (
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-funnel me-2 fs-4"></i>
            <select
              className="form-select"
              style={{ width: "auto" }}
              value={selectedStatus}
              onChange={handleSelectChange}
            >
              <option selected>Tất cả hết hiệu lực</option>
              <option value="activited">
                Còn hạn nhưng không còn hiệu lực
              </option>
              <option value="expired">Hết hạn và đã hết hiệu lực</option>
            </select>
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
            {currentVouchers.length > 0 ? (
              <tbody>
                {currentVouchers.map((voucher, index) => (
                  <tr key={voucher.voucherId}>
                    <td>{index + 1}</td>
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
                        {voucher.status === "active"
                          ? "Có hiệu lực"
                          : "Không có hiệu lực"}
                      </Badge>
                    </td>
                    <td>
                      {voucher.createdBy?.username
                        ? voucher.createdBy?.fullname
                        : "chưa có"}
                    </td>
                    <td className="text-end">
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
            ) : (
              <tr >
                <td colSpan={11} className="text-center h6 ">
                  <p >Không có dữ liệu cho trạng thái này</p>
                </td>
              </tr>
            )}
          </Table>
          {currentVouchers.length > 0 && (
            <div className="d-flex justify-content-center ">
              <nav>
                <ul className="pagination">
                  {/* Nút tới đầu trang 
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button className="page-link" onClick={handleFirstPage}>
                    {"<<"} Đầu
                  </button>
                </li>*/}

                  {/* Nút lùi */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button className="page-link" onClick={handlePreviousPage}>
                      {"<"} Lùi
                    </button>
                  </li>

                  {/* Nút chọn trang */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  {/* Nút tới */}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button className="page-link" onClick={handleNextPage}>
                      Tới {">"}
                    </button>
                  </li>

                  {/* Nút tới cuối trang 
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={handleLastPage}>
                    Cuối {">>"}
                  </button>
                </li>*/}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </>
    );
  };

  if (voucherFetch.isLoading) return <div>Đang loading dữ liệu voucher</div>;
  return (
    <div style={{ fontSize: "14px" }}>
      <div className="box-ultil">
        <b className="text-danger" style={{ fontSize: "20px" }}>
          Quản lý mã giảm giá/ Tổng: {vouchers?.length || 0} mã giảm giá
        </b>
        {/* <div className="row "> */}
        {/* Ngày bắt đầu 
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Ngày bắt đầu:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                className="form-control"
              />
            </div>
          </div>*/}

        {/* Ngày kết thúc 
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                Ngày kết thúc:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                className="form-control"
              />
            </div>
          </div>*/}
        {/* </div> */}

        <input
          type="text"
          placeholder="Tìm kiếm mã giảm giá..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            width: "200px",
          }}
        />
        <Button
          className="btn-sd-admin"
          style={{ fontSize: "15px" }}
          onClick={() => {
            setEditingVoucher(null);
            setShowAddVoucher(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Tạo mã giảm giá
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
          <Nav.Link eventKey="valid" className="tab-link">
            Còn hiệu lực
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="inactive" className="tab-link">
            Hết hiệu lực
          </Nav.Link>
        </Nav.Item>

        {/* <Nav.Item>
          <Nav.Link eventKey="activited" className="tab-link">
            Đang hoạt động
          </Nav.Link>
        </Nav.Item>*/}
        {/* <Nav.Item>
          <Nav.Link eventKey="expired" className="tab-link">
            Đã hết hạn
          </Nav.Link>
        </Nav.Item>  */}
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
