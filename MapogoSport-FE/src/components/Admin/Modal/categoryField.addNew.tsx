import { Button, Col, Form, Modal, Row, Image } from "react-bootstrap";
import "../admin.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface CategoryFieldProps {
    showAddCategory: boolean;
    setShowAddCategory: (v: boolean) => void;
    currentCategory: CategoryField | null;
}

const CategoryFieldAddNew = (props: CategoryFieldProps) => {
    const { showAddCategory, setShowAddCategory, currentCategory } = props;
    const [fieldName, setFieldName] = useState<string>("");
    const [fieldImage, setFieldImage] = useState<File | string>("/images/logo.png");
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (showAddCategory && currentCategory) {
            setFieldName(currentCategory.name);
            setFieldImage(currentCategory.image);
        }
    }, [showAddCategory, currentCategory]);

    const handleClose = () => {
        setShowAddCategory(false);
        setFieldName("");
        setFieldImage("/images/logo.png");
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) setFieldImage(file);
    };

    const handleSave = async () => {
        if (!fieldName) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        const formData = new FormData();
        formData.append("category", JSON.stringify({ name: fieldName }));
        if (fieldImage instanceof File) {
            formData.append("fileImage", fieldImage);
        } else {
            // If productImage is a string (URL), fetch the image and convert it to a File
            const response = await fetch(fieldImage);
            const blob = await response.blob();
            formData.append("fileImage", new File([blob], "/images/logo.png", { type: blob.type }));
        }
        try {
            await fetch(`${BASE_URL}rest/category_field/create/category_field`, {
                method: 'POST',
                body: formData,
            }).then((res) => {
                if (!res.ok) {
                    toast.error("Thêm loại sân thất bại!");
                    return;
                }
                toast.success("Thêm loại sân thành công!");
                mutate(`${BASE_URL}rest/category_field`);
                handleClose();
            });
        } catch (error) {
            console.error("Error create category field: ",error)
            toast.error("Không thể thêm loại sân")
        }

    };

    const handleUpdate = async () => {
        if (!fieldName) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        const formData = new FormData();
        formData.append("category", JSON.stringify({ name: fieldName }));
        if (fieldImage instanceof File || fieldImage !== currentCategory?.image) {
            formData.append("fileImage", fieldImage);
        }
        try {
            await fetch(`${BASE_URL}rest/category_field/update/category_field/${currentCategory?.categoriesFieldId}`, {
                method: 'PUT',
                body: formData,
            }).then((res) => {
                if (!res.ok) {
                    toast.error("Cập nhật loại sân thất bại!");
                    return;
                }
                toast.success("Cập nhật loại sân thành công!");
                mutate(`${BASE_URL}rest/category_field`);
                handleClose();
            });
        } catch (error) {
            console.error("Error update category field: ",error)
            toast.error("Không thể cập nhật loại sân")
        }
        
    };

    return (
        <Modal show={showAddCategory} centered backdrop="static" keyboard={true} size="lg">
            <Modal.Header>
                <Modal.Title className="text-uppercase text-danger fw-bold">
                    {!currentCategory ? "Thêm loại sân" : "Chỉnh sửa loại sân"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col xs={8}>
                            <Form.Group className="mb-3">
                                <Form.Floating>
                                    <Form.Control type="text" placeholder="Tên" name="name"
                                        value={fieldName} onChange={(e) => setFieldName(e.target.value)} required />
                                    <Form.Label htmlFor="name">Tên loại sân <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <h5>Ảnh đại diện</h5>
                            <Image src={fieldImage instanceof File ? URL.createObjectURL(fieldImage) : fieldImage} alt="Sport field avatar" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                            <Form.Group controlId="avatarInput" className="mt-2">
                                <Form.Label>{currentCategory ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="d-none" />
                                <Button variant="outline-primary" size="sm" onClick={() => document.getElementById("avatarInput")!.click()}>
                                    <i className="bi bi-person-circle mx-1"></i>
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                <Button variant="danger" onClick={currentCategory ? handleUpdate : handleSave}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryFieldAddNew;