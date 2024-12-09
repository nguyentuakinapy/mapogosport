import { Button, Col, Form, Modal, Row, Image } from "react-bootstrap";
import "../admin.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface CategoryProductProps {
    showAddCategory: boolean;
    setShowAddCategory: (v: boolean) => void;
    currentCategory: CategoryProduct | null;
}

const CategoryAddNew = (props: CategoryProductProps) => {
    const { showAddCategory, setShowAddCategory, currentCategory } = props;
    const [productName, setProductName] = useState<string>("");
    const [productImage, setProductImage] = useState<File | string>("/images/logo.png");
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (showAddCategory && currentCategory) {
            setProductName(currentCategory.name);
            setProductImage(currentCategory.image);
        }
    }, [currentCategory, showAddCategory]);

    const handleClose = () => {
        setShowAddCategory(false);
        setProductName("");
        setProductImage("/images/logo.png");
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) setProductImage(file);
    };

    const handleSave = async () => {
        if (!productName  ) {
            toast.error("Vui lòng điền đầy đủ thông tin loại sản phẩm!");
            return;
        }
        const formData = new FormData();
        formData.append("category", JSON.stringify({ name: productName }));
        if (productImage instanceof File) {
            formData.append("fileImage", productImage);
        } else {
            // If productImage is a string (URL), fetch the image and convert it to a File
            const response = await fetch(productImage);
            const blob = await response.blob();
            formData.append("fileImage", new File([blob], "/images/logo.png", { type: blob.type }));
        }
        try {
            await fetch(`${BASE_URL}rest/category_product/create`, {
                method: 'POST',
                body: formData,
            }).then((res) => {
                if (!res.ok) {
                    toast.error("Thêm loại sản phẩm thất bại!");
                    return;
                }
                toast.success("Thêm loại sản phẩm thành công!");
                mutate(`${BASE_URL}rest/category_product/category-products`);
                handleClose();
            });
        } catch (error) {
            console.error("Error create category product: ",error)
            toast.error("Không thể thêm mới loại sản phẩm")
        }
        
    };

    const handleUpdate = async () => {
        if (!productName || !productImage) {
            toast.error("Vui lòng điền đầy đủ thông tin loại sản phẩm!");
            return;
        }
        const formData = new FormData();
        formData.append("category", JSON.stringify({ name: productName }));
        if (productImage instanceof File || productImage !== currentCategory?.image) {
            formData.append("fileImage", productImage);
        }
        try {
            await fetch(`${BASE_URL}rest/category_product/update/category/product/${currentCategory?.categoryProductId}`, {
                method: 'PUT',
                body: formData,
            }).then((res) => {
                if (!res.ok) {
                    toast.error("Cập nhật loại sản phẩm thất bại!");
                    return;
                }
                toast.success("Cập nhật loại sản phẩm thành công!");
                mutate(`${BASE_URL}rest/category_product/category-products`);
                handleClose();
            });
        } catch (error) {
            console.error("Error update category product: ",error)
            toast.error("Không thể cập nhật loại sản phẩm")
        }
        
    }

    return (
        <Modal show={showAddCategory} centered backdrop="static" keyboard={true} size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="text-uppercase text-danger fw-bold">
                    {!currentCategory ? "Thêm loại sản phẩm" : "Chỉnh sửa loại sản phẩm"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col xs={8}>
                            <Form.Group className="mb-3">
                                <Form.Floating>
                                    <Form.Control type="text" placeholder="Tên" name="name" value={productName}
                                        onChange={(e) => setProductName(e.target.value)} required />
                                    <Form.Label htmlFor="name">Tên loại sản phẩm <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <h5>Ảnh đại diện</h5>
                            <Image src={productImage instanceof File ? URL.createObjectURL(productImage) : productImage} alt="Sport field avatar" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
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

export default CategoryAddNew;