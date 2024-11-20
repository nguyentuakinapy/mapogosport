import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import '../admin.scss';
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import axios from "axios";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface UserProps {
    showEditRole: boolean;
    setShowEditRole: (show: boolean) => void;
    user: User | null; // User đã chọn hoặc null
}

const Authority = (props: UserProps) => {
    const { showEditRole, setShowEditRole, user } = props;

    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const roles = [
        { value: "ROLE_USER", label: "Khách hàng" },
        { value: "ROLE_OWNER", label: "Chủ sân" },
        { value: "ROLE_STAFF", label: "Nhân viên" },
        { value: "ROLE_ADMIN", label: "Quản trị viên" }
    ];

    useEffect(() => {
        if (user) {
            const userRoles = user.authorities.map(auth => auth.role.name);
            setSelectedRoles(userRoles);
        }
    }, [user, showEditRole]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const roleValue = event.target.value;
        if (selectedRoles.includes(roleValue)) {
            // Bỏ role nếu đã chọn
            setSelectedRoles(selectedRoles.filter(r => r !== roleValue));
        } else {
            // Thêm role nếu chưa được chọn
            setSelectedRoles([...selectedRoles, roleValue]);
        }
    };
    // console.log("selectedRoles", selectedRoles);

    const handleClose = () => {
        setShowEditRole(false);
    }

    const handleSave = async () => {
        if (!user) return;
        console.log("trước:", selectedRoles);

        try {
            const response = await axios.post(`http://localhost:8080/rest/update-user-authority/${user?.username}`, selectedRoles);
            mutate(`http://localhost:8080/rest/list-users`)
            toast.success(`Cập nhật vai trò của "${user.username}" thành công!`);
        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò:", error);
            toast.error("Có lỗi xảy ra khi cập nhật vai trò.");
        }
        handleClose();
    }

    return (
        <>
            <Modal show={showEditRole} onHide={handleClose} centered backdrop="static" keyboard={false} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Phân quyền</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={8}>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="text" value={user?.username} readOnly />
                                                <Form.Label>Tài khoản</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating className="mb-3">
                                                <DatePicker
                                                    selected={user?.birthday}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="form-control"
                                                    placeholderText="dd/mm/yyyy"
                                                    readOnly />
                                                <Form.Label className='dateLabel'>Ngày sinh</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating className="mb-3">
                                                <DatePicker
                                                    selected={user?.createdAt}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="form-control"
                                                    placeholderText="dd/mm/yyyy"
                                                    readOnly
                                                />
                                                <Form.Label className='dateLabel'>Ngày tham gia</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="text" value={user?.fullname} readOnly />
                                                <Form.Label >Họ và tên</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="text" readOnly value={user?.gender === 0 ? "Nam" : user?.gender === 1 ? "Nữ" : ""} />
                                                <Form.Label >Giới tính</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="text" readOnly value={user?.email} />
                                                <Form.Label >Email</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Form.Group className="mt-2 fs-5 fw-bold">
                                        <Form.Label className="me-4">Vai trò:</Form.Label>
                                        {roles.map((role, index) => (
                                            <Form.Check
                                                inline
                                                key={index}
                                                type="checkbox"
                                                label={role.label}
                                                value={role.value}
                                                checked={selectedRoles.includes(role.value)}
                                                onChange={handleCheckboxChange}
                                            />
                                        ))}
                                    </Form.Group>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <div className="text-center">
                                    <div className="avatar-upload">
                                        {/* <div className="avatar-edit">
                                            <input type="file" name="avatar" id="imageUpload" accept="image/jpeg, image/png" style={{ display: 'none' }} />
                                            <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                                        </div> */}

                                        <div className="avatar-preview">
                                            <div style={{ backgroundImage: `url("${user?.avatar}")` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button style={{ backgroundColor: "#142239" }} onClick={handleSave}>Xác nhận</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Authority;
