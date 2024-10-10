



    import { Button, Col, Form, Modal, Row, Image } from "react-bootstrap";
    import '../admin.scss';
    import { useState, useEffect } from "react";
    import axios from 'axios';
    import { toast } from 'react-toastify';
    
    interface UserProps {
        showAddProduct: boolean;
        setShowAddProduct: (v: boolean) => void;
        currentProduct: Product | null; 
        modalType: 'add' | 'edit'; 
        categoryProducts: CategoryProduct[]; 
        // onAddProduct: (product: Product) => void;
    }
    
    const ProductAddNew = ({ showAddProduct, setShowAddProduct, currentProduct, modalType, categoryProducts }: UserProps) => {
        const [value, setValue] = useState('');
        const option = [
            { label: 'Còn hàng', value: 'Còn hàng' },
            { label: 'Hết hàng', value: 'Hết hàng' }
        ];
    
        const [formValues, setFormValues] = useState<Product>({
            name: '',
            categoryProduct: {
                categoryProductId: categoryProducts[0]?.categoryProductId || 0,
                name: categoryProducts[0]?.name || '',
            },
            description: '',
            status: option[0].value,
            brand: '',
            country: '',
            image: '',
            stock: 0,
        });
    
        const [previewImage, setPreviewImage] = useState<string | null>(null); // Dùng để lưu đường dẫn ảnh xem trước
    
        useEffect(() => {
            if (modalType === 'edit' && currentProduct) {
                setFormValues({
                    ...currentProduct,
                    categoryProduct: {
                        ...currentProduct.categoryProduct
                    },
                    image: currentProduct.image || '',  // Hiển thị ảnh hiện có từ sản phẩm
                });
            } else {
                setFormValues({
                    name: '',
                    categoryProduct: {
                        categoryProductId: categoryProducts[0]?.categoryProductId || 0,
                        name: categoryProducts[0]?.name || '',
                    },
                    description: '',
                    status: option[0].value,
                    brand: '',
                    country: '',
                    image: '',
                    stock: 0,
                });
            }
        }, [modalType, currentProduct, categoryProducts]);
    
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormValues({ ...formValues, [name]: value });
        };
    
        const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const { value } = event.target;
            setValue(value);
            setFormValues(prevValues => ({ ...prevValues, status: value }));
        };
    
        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if(modalType === 'add' ){
                  if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                // // setFormValues({ ...formValues, image: file.name }); // Chỉ lưu tên tệp hình ảnh
                // setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh
                setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh

                // Cập nhật formValues với tên tệp hình ảnh thực tế
                setFormValues({ ...formValues, image: file.name });
            } else {
                setFormValues({ ...formValues, image: '' });
                setPreviewImage(null); // Xóa ảnh xem trước nếu không có ảnh được chọn
            }
            }else{
            if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            // // setFormValues({ ...formValues, image: file.name }); // Chỉ lưu tên tệp hình ảnh
                            // setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh
                            setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh

                            // Cập nhật formValues với tên tệp hình ảnh thực tế
                            // setFormValues({ ...formValues, image: file.name });
                        } else {
                            setFormValues({ ...formValues, image: '' });
                            setPreviewImage(null); // Xóa ảnh xem trước nếu không có ảnh được chọn
                        }
            }
          
            
           
        };
    
        const handleClose = () => {
            setShowAddProduct(false);
        };
    
        const handleSave = async () => {
            try {
                let imageUrl = currentProduct?.image; // Giữ nguyên hình ảnh gốc nếu không có hình mới

                // Chỉ cập nhật đường dẫn hình ảnh nếu người dùng chọn hình mới
                if (previewImage) {
                    imageUrl = `images/product_images/${formValues.name.replace(/\s+/g, '_')}.${formValues.image.split('.').pop()}`;
                }
                console.log('image urrl ssasasasa, ',imageUrl);
                if (modalType === 'add') {
                    const response = await axios.post(`http://localhost:8080/rest/products`, {
                        ...formValues,
                        image: imageUrl
                    });
                    console.log('image urrl, ',formValues.image);
                    
                    // onAddProduct(response.data);
                    toast.success("Thêm sản phẩm thành công");
                } else if (modalType === 'edit' && currentProduct) {
                    const response = await axios.put(`http://localhost:8080/rest/products/${currentProduct.productId}`, {
                        ...formValues,
                        image: imageUrl
                    });
                    // onAddProduct(response.data);
                    toast.success('Sản phẩm đã được cập nhật');
                }
            } catch (error) {
                toast.error("Lỗi khi lưu sản phẩm");
                console.error('Lỗi khi lưu sản phẩm:', error);
            }
            handleClose();
        };
    
        return (
            <>
                         <Modal show={showAddProduct} onHide={handleClose} centered backdrop="static" keyboard={true} size="xl">
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
                                                                placeholder="Số lượng"
                                                                name="stock"
                                                                value={formValues.stock}
                                                                onChange={handleInputChange}
                                                            />
                                                            <Form.Label htmlFor="stock">Số lượng <b className="text-danger">*</b></Form.Label>
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
                                                    <Form.Group className="mb-3">
                                                        <Form.Floating>
                                                            <Form.Control
                                                                as="select"
                                                                name="categoryProduct"
                                                                value={formValues.categoryProduct.categoryProductId}
                                                                onChange={handleInputChange}
                                                            >
                                                                {categoryProducts.map((category) => (
                                                                    <option key={category.categoryProductId} value={category.categoryProductId}>
                                                                        {category.name}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                            <Form.Label htmlFor="category">Loại sản phẩm <b className="text-danger">*</b></Form.Label>
                                                        </Form.Floating>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Floating>
                                                            <Form.Control
                                                                as="select"
                                                                name="status"
                                                                value={formValues.status}
                                                                onChange={handleSelect}
                                                            >
                                                                {/* <option value="Còn hàng">Còn hàng</option>
                                                                <option value="Hết hàng">Hết hàng</option> */}
                                                            {option.map(option => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
        
                                                            </Form.Control>
                                                            <Form.Label htmlFor="status">Trạng thái <b className="text-danger">*</b></Form.Label>
                                                        </Form.Floating>
                                                    </Form.Group>
                                                
                                                </Col>
                                                <Col>
                                                <Form.Group className="mb-3">
                                                        <Form.Floating>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="country"
                                                                name="country"
                                                                value={formValues.country}
                                                                onChange={handleInputChange}
                                                            />
                                                            <Form.Label htmlFor="country">Xuất sứ <b className="text-danger">*</b></Form.Label>
                                                        </Form.Floating>
                                                    </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="description">Mô tả <b className="text-danger">*</b></Form.Label>
                                                        <Form.Floating>
                                                            <Form.Control
                                                                as="textarea"
                                                                placeholder="Mô tả"
                                                                name="description"
                                                                rows={6}
                                                                value={formValues.description}
                                                                onChange={handleInputChange}
                                                                style={{ width: '100%', height: '150px', padding: '10px' }} 
                                                            />
                                                        </Form.Floating>
                                                    </Form.Group>
                                               {/* Hình ảnh chọn từ file */}
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="image" className="text-danger">Chọn hình ảnh</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="image"
                                            onChange={handleImageChange}
                                            accept="image/png, image/jpeg, image/jpg"
                                        />
                                        {previewImage && (
                                            <div className="preview-image" style={{ marginTop: '10px', display: 'flex' }}>
                                                <Image
                                                    src={previewImage}
                                                    alt="Preview"
                                                    fluid
                                                    style={{ objectFit: "cover", maxHeight: "70px", maxWidth: "100px", borderRadius: "5px" }}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={4}>
                                    {/* Hình ảnh từ server */}
                                    <div>
                                        {formValues.image && modalType === 'edit' && (
                                            <Image
                                                src={`/images/product_images/${formValues.image}`}
                                                alt={formValues.image}
                                                fluid
                                                style={{ objectFit: "cover", maxHeight: "300px" }}
                                            />
                                        )}
                                    </div>
                                    <div>
                                {previewImage && modalType === 'add' && (
                                    <div style={{ marginTop: '10px' }}>
                                        <p>Hình ảnh minh họa:</p>
                                        <Image
                                            src={previewImage}
                                            alt="Preview"
                                            fluid
                                            style={{ objectFit: "cover", maxHeight: "300px" }}
                                        />
                                    </div>
                                )}
                            </div>
                                </Col>
                                    </Row>
                                </Form>
                            </Modal.Body>
        
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                                <Button variant="danger" onClick={handleSave}>Lưu</Button>
                            </Modal.Footer>
                        </Modal>
        
                    
                    </>
        );
    };
    
    export default ProductAddNew;
    