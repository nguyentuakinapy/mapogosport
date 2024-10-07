///////// product add new 


import { Button, Col, Form, Modal, Row, FloatingLabel, Image } from "react-bootstrap";
import '../admin.scss';
import { useState, useEffect } from "react";

// Định nghĩa kiểu cho props
interface UserProps {
    showAddProduct: boolean;
    setShowAddProduct: (v: boolean) => void;
    currentProduct: any; // Sản phẩm hiện tại hoặc null nếu thêm mới
    modalType: 'add' | 'edit'; // Loại modal
    categoryProducts: any[]; // loại sản phẩm
}

// Modal hiển thị chi tiết sản phẩm
const ProductDetailModal = ({ showDetail, setShowDetail, product }: any) => {
    return (
        <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-uppercase text-danger">Chi tiết sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Tên: {product.name}</h5>
                <p>Giá: {product.price}</p>
                <p>Hãng: {product.brand}</p>
                <p>Loại: {product.categoryProduct?.name}</p>
                <p>Trạng thái: {product.status}</p>
                <p>Xuất xứ: {product.country}</p>
                <p>Mô tả: {product.stock}</p>
                {product.image && (
                    <Image src={product.image} style={{ width: '150px', height: 'auto' }} />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetail(false)}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

// Component chính để thêm hoặc chỉnh sửa sản phẩm
const ProductAddNew = ({ showAddProduct, setShowAddProduct, currentProduct, modalType, categoryProducts }: UserProps) => {
    // State để lưu các giá trị nhập từ form
    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        brand: '',
        category: '',
        status: '',
        country: '',
        description: '',
        image: null
    });

    // State để hiển thị modal chi tiết
    const [showDetail, setShowDetail] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        if (modalType === 'edit' && currentProduct) {
            // Điền dữ liệu sản phẩm hiện tại vào form khi chỉnh sửa
            setFormValues({
                name: currentProduct.name || '',
                price: currentProduct.price || '',
                brand: currentProduct.brand || '',
                category: currentProduct.categoryProduct?.categoryProductId || '',
                status: currentProduct.status || '',
                country: currentProduct.country || '',
                description: currentProduct.description || '',
                image: currentProduct.image || null
            });
        } else {
            // Reset form nếu thêm sản phẩm mới
            setFormValues({
                name: '',
                price: '',
                brand: '',
                category: '',
                status: '',
                country: '',
                description: '',
                image: null
            });
        }
    }, [modalType, currentProduct]);

    // Xử lý khi người dùng thay đổi giá trị trong form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    // Xử lý khi người dùng chọn ảnh mới
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormValues({ ...formValues, image: file });
        }
    };

    const handleClose = () => {
        setShowAddProduct(false);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', formValues.name);
        formData.append('price', formValues.price);
        formData.append('brand', formValues.brand);
        formData.append('category', formValues.category);
        formData.append('status', formValues.status);
        formData.append('country', formValues.country);
        formData.append('description', formValues.description);
        if (formValues.image) {
            formData.append('image', formValues.image);
        }

        try {
            if (modalType === 'add') {
                // Gọi API thêm sản phẩm mới
                const response = await fetch(`http://localhost:8080/api/products`, {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                console.log('Sản phẩm mới đã được thêm:', result);
            } else if (modalType === 'edit' && currentProduct) {
                // Gọi API cập nhật sản phẩm
                const response = await fetch(`http://localhost:8080/api/products/${currentProduct.productId}`, {
                    method: 'PUT',
                    body: formData,
                });
                const result = await response.json();
                console.log('Sản phẩm đã được cập nhật:', result);
            }
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
        }

        handleClose(); // Đóng modal sau khi lưu xong
    };

    const handleShowDetail = () => {
        setSelectedProduct(currentProduct);
        setShowDetail(true);
    };

    return (
        <>
            <Modal show={showAddProduct} onHide={handleClose} centered backdrop="static" keyboard={false} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">{modalType === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={8}>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tên"
                                                    name="name"
                                                    value={formValues.name}
                                                    onChange={handleInputChange}
                                                />
                                                <Form.Label htmlFor="name">Tên sản phẩm <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Giá"
                                                    name="price"
                                                    value={formValues.price}
                                                    onChange={handleInputChange}
                                                />
                                                <Form.Label htmlFor="price">Giá <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Hãng"
                                                    name="brand"
                                                    value={formValues.brand}
                                                    onChange={handleInputChange}
                                                />
                                                <Form.Label htmlFor="brand">Hãng <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel controlId="category" label={<span>Loại <b className="text-danger">*</b></span>}>
                                                <Form.Select
                                                    name="category"
                                                    value={formValues.category}
                                                    onChange={handleInputChange}>
                                                    {/* Thêm danh mục sản phẩm nếu có */}
                                                    {categoryProducts.map((category) => (
                                                        <option key={category.categoryProductId} value={category.categoryProductId}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel controlId="status" label={<span>Trạng thái <b className="text-danger">*</b></span>}>
                                                <Form.Select
                                                    name="status"
                                                    value={formValues.status}
                                                    onChange={handleInputChange}
                                                >
                                                    <option>-- Nhấn để chọn --</option>
                                                    <option value="Còn hàng">Còn hàng</option>
                                                    <option value="Hết hàng">Hết hàng</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Xuất xứ"
                                                    name="country"
                                                    value={formValues.country}
                                                    onChange={handleInputChange}
                                                />
                                                <Form.Label htmlFor="country">Xuất xứ <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="description" className="text-secondary fs-6">Mô tả <b className="text-danger">*</b></Form.Label>
                                    <Form.Floating>
                                        <Form.Control
                                            as="textarea"
                                            style={{ height: '100px' }}
                                            name="description"
                                            value={formValues.description}
                                            rows={10}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Floating>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <div className="text-center">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit">
                                            <input
                                                type="file"
                                                name="image"
                                                id="imageUpload"
                                                accept="image/jpeg, image/png"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                            <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <Image
                                                // src={formValues.image ? URL.createObjectURL(formValues.image) : '/images/avatar-init.gif'}
                                                src={formValues.image?.name}
                                                style={{ width: '150px', height: 'auto' }}
                                                className="mx-2"
                                                alt={formValues.image?.name || "Avatar"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={handleShowDetail}>
                        Chi tiết
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button style={{ backgroundColor: "#142239" }} onClick={handleSave}>
                        {modalType === 'add' ? 'Xác nhận' : 'Lưu thay đổi'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal chi tiết sản phẩm */}
            {selectedProduct && (
                <ProductDetailModal
                    showDetail={showDetail}
                    setShowDetail={setShowDetail}
                    product={selectedProduct}
                />
            )}
        </>
    );
};

export default ProductAddNew;
