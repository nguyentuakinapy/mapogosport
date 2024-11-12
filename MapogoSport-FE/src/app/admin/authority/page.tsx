'use client'
import AuthorityModal from "@/components/Admin/Modal/authority.modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import useSWR from "swr";

function AuthorityComponent() {
    const [showEditRole, setShowEditRole] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [displayedUsers, setDisplayedUsers] = useState<User[]>([]); // Danh sách được hiển thị
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    
    const fetcher = (url: string) => axios.get(url).then(res => res.data);

    const { data, error } = useSWR('http://localhost:8080/rest/list-users', fetcher);

    useEffect(() => {
        if (data) {
            setUsers(data); // Giữ nguyên dữ liệu ban đầu
            setDisplayedUsers(data); // Hiển thị tất cả người dùng ban đầu
        }
    }, [data]);

    if (error) return <div>Error fetching users: {error.message}</div>;
    if (!data) return <div>Loading...</div>;

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const role = event.target.value;
        setSelectedRole(role);

        if (role === "Vai trò" || role === "") {
            // Hiển thị lại tất cả người dùng nếu không có vai trò được chọn
            setDisplayedUsers(users);
        } else {
            // Lọc người dùng theo vai trò đã chọn
            const filteredUsers = users.filter((user) =>
                user.authorities.some((auth) => auth.role.name === role)
            );
            setDisplayedUsers(filteredUsers);
        }
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const filteredUsers = users.filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedUsers(filteredUsers);
    };

    const handleRowClick = (user: User) => {
        setSelectedUser(user); // Cập nhật user được chọn
        setShowEditRole(true); // Hiển thị modal
    };
    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>PHÂN QUYỀN NGƯỜI DÙNG</h3>
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-funnel me-2 fs-4"></i>
                <select className="form-select" style={{ width: "auto" }}
                    value={selectedRole}
                    onChange={handleRoleChange}>
                    <option selected>Vai trò</option>
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
                    </tr>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Chủ sân</th>
                        <th>Nhân viên</th>
                        <th>Quản trị viên</th>
                    </tr>
                </thead>
                <tbody data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
                    {displayedUsers.length > 0 ? (
                        displayedUsers.map((user, index) => (
                            <tr key={index} onClick={() => handleRowClick(user)}>
                                <td>{index + 1}</td>
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
                            </tr>
                        ))
                    ) : (
                        <li>Không có người dùng với này</li>
                    )}
                </tbody>
            </Table>

            <AuthorityModal
                showEditRole={showEditRole}
                setShowEditRole={setShowEditRole}
                user={selectedUser} // Truyền user được chọn vào modal
            >
            </AuthorityModal>
        </>
    )
}
export default AuthorityComponent;
