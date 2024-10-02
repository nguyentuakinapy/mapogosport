'use client'
import AuthorityModal from "@/components/Admin/Modal/authority.modal";
import { useState } from "react";
import { Table } from "react-bootstrap";

function Test() {
    const [showEditRole, setShowEditRole] = useState<boolean>(false)

    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>PHÂN QUYỀN NGƯỜI DÙNG</h3>
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-funnel me-2 fs-4"></i>
                <select className="form-select" style={{ width: "auto" }}>
                    <option selected>Vai trò</option>
                    <option value="Khách hàng">Khách hàng</option>
                    <option value="Chủ sân">Chủ sân</option>
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                </select>
                <div className="ms-auto">
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Tìm kiếm" />
                        <button className="btn btn-outline-secondary" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th rowSpan={2}>STT</th>
                        <th rowSpan={2}>Tài khoản</th>
                        <th rowSpan={2}>Họ và tên</th>
                        <th colSpan={4}>Vai trò</th>
                    </tr>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Chủ sân</th>
                        <th>Nhân viên</th>
                        <th>Quản trị viên</th>
                    </tr>
                </thead>
                <tbody data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
                    <tr>
                        <td>1</td>
                        <td>Sân bóng 1</td>
                        <td>Nguyễn Văn A</td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                    </tr>
                    <tr onClick={() => setShowEditRole(true)}>
                        <td>2</td>
                        <td>Sân bóng 1</td>
                        <td>Nguyễn Văn A</td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                        <td><input disabled className="form-check-input" type="checkbox" /></td>
                    </tr>
                </tbody>
            </Table>

            <AuthorityModal showEditRole={showEditRole} setShowEditRole={
                setShowEditRole
            }>

            </AuthorityModal>
        </>
    )
}

export default Test;
