'use client'
import AuthorityModal from "@/components/Admin/Modal/authority.modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import useSWR from "swr";

function AuthorityComponent() {
    const [showEditRole, setShowEditRole] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetcher = (url: string) => axios.get(url).then(res => res.data);

    const { data, error } = useSWR<User[]>(`${BASE_URL}rest/list-users`, fetcher);

    useEffect(() => {
        if (data) {
            setUsers(data.filter(item => item.username !== 'sportoffline'));
            setDisplayedUsers(data.filter(item => item.username !== 'sportoffline').slice(0, itemsPerPage));
        }
    }, [data]);

    if (error) return <div>Error fetching users: {error.message}</div>;
    if (!data) return <div className="d-flex align-items-center justify-content-center">
        <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>;

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const role = event.target.value;
        setSelectedRole(role);

        if (role === "Vai trò" || role === "") {
            setDisplayedUsers(users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } else {
            const filteredUsers = users.filter((user) =>
                user.authorities.some((auth) => auth.role.name === role)
            );
            setDisplayedUsers(filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const filteredUsers = users.filter((user) =>
            user.username.toLowerCase().includes(e.target.value.toLowerCase()) ||
            user.fullname.toLowerCase().includes(e.target.value.toLowerCase())
        );

        setCurrentPage(1);
        setDisplayedUsers(filteredUsers.slice(0, itemsPerPage));
    };

    const handleRowClick = (user: User) => {
        setSelectedUser(user);
        setShowEditRole(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setDisplayedUsers(users.slice((page - 1) * itemsPerPage, page * itemsPerPage));
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(users.length / itemsPerPage);
        const pages = [];

        if (totalPages <= 1) return null;

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={currentPage === i} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        return (
            <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };
    return (
        <>
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-funnel me-2 fs-4"></i>
                <select className="form-select" style={{ width: "auto" }}
                    value={selectedRole}
                    onChange={handleRoleChange}>
                    <option value="">Vai trò</option>
                    <option value="ROLE_USER">Khách hàng</option>
                    <option value="ROLE_OWNER">Chủ sân</option>
                    <option value="ROLE_STAFF">Nhân viên</option>
                    <option value="ROLE_ADMIN">Quản trị viên</option>
                </select>
                <div className="ms-auto">
                    <form className="d-flex" role="search">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Tìm kiếm"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
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
                        <th rowSpan={2}>Hoạt động</th>
                    </tr>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Chủ sân</th>
                        <th>Nhân viên</th>
                        <th>Quản trị viên</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedUsers.length > 0 ? (
                        displayedUsers.map((user, index) => (
                            <tr key={index} onClick={() => handleRowClick(user)}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.fullname}</td>
                                <td>
                                    <input
                                        readOnly
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={user.authorities.some(auth => auth.role.name === "ROLE_USER")}
                                    />
                                </td>
                                <td>
                                    <input
                                        readOnly
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={user.authorities.some(auth => auth.role.name === "ROLE_OWNER")}
                                    />
                                </td>
                                <td>
                                    <input
                                        readOnly
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={user.authorities.some(auth => auth.role.name === "ROLE_STAFF")}
                                    />
                                </td>
                                <td>
                                    <input
                                        readOnly
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={user.authorities.some(auth => auth.role.name === "ROLE_ADMIN")}
                                    />
                                </td>
                                <td>
                                    <input
                                        readOnly
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={!!user.enabled}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="text-center">
                                Không có người dùng nào phù hợp
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {renderPagination()}

            <AuthorityModal
                showEditRole={showEditRole}
                setShowEditRole={setShowEditRole}
                user={selectedUser} // Truyền user được chọn vào modal
            >
            </AuthorityModal>
        </>
    );
}

export default AuthorityComponent;
