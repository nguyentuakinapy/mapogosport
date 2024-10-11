////// page 	product
'use client'
import Link from "next/link";
import { Row, Col, Form, FormCheck, Button, Table, Badge, Image, OverlayTrigger, Tooltip, Nav } from "react-bootstrap";
import '../adminStyle.scss';
import { useState, useEffect } from "react";
import ProductAddNew from "@/components/Admin/Modal/product.addNew";
import axios from 'axios';

const AdminProduct = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'add' | 'edit'>('add'); // 'add' hoặc 'edit'
    const [currentProduct, setCurrentProduct] = useState<Product[]>(null); // Sản phẩm hiện tại

    const [products, setProducts] = useState<Product[]>([]);
    const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [selectAllProduct, setSelectAllProduct] = useState(false);
    
    const BASE_URL = 'http://localhost:8080';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiProducts = 'http://localhost:8080/rest/products';
                const apiCategoriesProducts  = 'http://localhost:8080/rest/category-products';

                 // Gọi cả hai API cùng lúc
            const [productsRes, categoriesRes] = await Promise.all([
                axios.get(apiProducts),
                axios.get(apiCategoriesProducts),
            ]);

        console.log('Products:', productsRes.data); // Ghi lại sản phẩm
        console.log('Category Products:', categoriesRes.data); // Ghi lại danh mục sản phẩm
                
                 // Lưu dữ liệu vào state
            setProducts(productsRes.data);      // Dữ liệu từ API products
            setCategoryProducts(categoriesRes.data);  // Dữ liệu từ API category_products
            
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

      // Hàm thêm sản phẩm mới vào danh sách
      const handleAddProduct = (newProduct: Product) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
    };

    const handleEditClick = (product) => {
        console.log('product ht ',product);
        
        setCurrentProduct(product); // Cập nhật sản phẩm hiện tại
        setModalType('edit'); // Đặt loại modal thành 'edit'
        setShowModal(true); // Hiển thị modal
    };

    const handleCreateClick = () => {
        setCurrentProduct(null); // Đặt sản phẩm hiện tại là null để tạo mới
        setModalType('add'); // Đặt loại modal thành 'add'
        setShowModal(true); // Hiển thị modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Đóng modal
        setCurrentProduct(null); // Reset sản phẩm hiện tại
    };

         const handleSelectAllProduct = () => {
         if (selectAllProduct) {
             setSelectedProducts([]);
         } else {
             setSelectedProducts(products.map((product) => product.productId));
         }
         setSelectAllProduct(!selectAllProduct);
     };

     const handleSelectProduct = (id: number) => {
         if (selectedProducts.includes(id)) {
             setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
         } else {
             setSelectedProducts([...selectedProducts, id]);
         }
     };

     const handleDelete = (id: number) => {
         setProducts(products.filter(product => product.productId !== id));
     };

    const renderContent = () => {
        return (
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th>
                        <FormCheck
                                     type="checkbox"
                                     checked={selectAllProduct}
                                     onChange={handleSelectAllProduct}/>
                                     </th>
                            <th>STT</th>
                            <th>Hình ảnh</th>
                            <th>Thông tin sản phẩm</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.productId}>
                                 <td className="text-center align-middle">
                                     <FormCheck
                                         type="checkbox"
                                         checked={selectedProducts.includes(product.productId)}
                                         onChange={() => handleSelectProduct(product.productId)}
                                     />
                                    </td>
                                <td className="text-center align-middle">{index + 1}</td>
                                <td className="text-center align-middle">
                                    <Link href="#">
                                   
                                 <Image 
                                     src={`${BASE_URL}/images/product-images/${product.image}`} 
                                     style={{ width: '150px', height: 'auto' }} 
                                    className="mx-2" 
                                    alt={product.image} 
                                />

                                    </Link>
                                </td>
                                <td className="text-start align-middle">
                                    <div>
                                        <span>Tên sản phẩm:</span> <strong className="text-dark">{product.name}</strong>
                                    </div>
                                    <div>
                                        <span>Ngày tạo:</span> <strong>{new Date(product.createDate).toLocaleDateString()}</strong>
                                    </div>
                                    <div>
                                        <span>Danh mục:</span> <strong>{product.categoryProduct.name || 'Không xác định'}</strong>
                                    </div>
                                    <div>
                                        <span>Hãng:</span> <strong>{product.brand}</strong>
                                    </div>
                                    <div>
                                        <span>Xuất sứ:</span> <strong>{product.country}</strong>
                                    </div>
                                    <div>
                                        <span>Trạng thái:</span>
                                        <Badge bg={product.status === 'Còn hàng' ? 'success' : 'danger'}>
                                            {product.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span>Số lượng:</span>
                                        <Badge bg={product.stock > 1 ? 'primary' : 'danger'}>
                                            {product.stock}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="text-center align-middle">
                                <OverlayTrigger overlay={<Tooltip>Xem</Tooltip>}>
                                <Link href={`product/view-list-product-detail/${product.productId}`}>
                                <Button variant="primary" className="m-1">
                                        <i className="bi bi-eye-fill"></i>
                                    </Button>
                                </Link>
                                </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                        <Button variant="warning" className="m-1" onClick={() => handleEditClick(product)}>
                                            <i className="bi bi-pencil-fill"></i>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                         <Button variant="danger" className="m-1" onClick={() => handleDelete(product.productId)}>
                                             <i className="bi bi-trash3-fill"></i>
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

    return (
        <div style={{ fontSize: '14px' }}>
            <div className="box-ultil">
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Sản Phẩm</b>
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={handleCreateClick}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm Sản Phẩm
                </Button>
            </div>
            <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                <Nav.Item>
                    <Nav.Link eventKey="all" className="tab-link">Toàn bộ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="inStock" className="tab-link">Còn hàng</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="outStock" className="tab-link">Hết hàng</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
            <div className="text-end py-0">
                    <Button variant="success" className="mb-4" onClick={handleCreateClick}>
                        <i className="bi bi-plus-square-fill"><span className='mx-1'>Tạo mới</span></i>
                    </Button>
                    <Button
                        variant="danger"
                        className="mb-4 mx-2"
                        disabled={selectedProducts.length === 0}
                        onClick={() => {
                            setProducts(products.filter(product => !selectedProducts.includes(product.productId)));
                            setSelectedProducts([]);
                            setSelectAllProduct(false);
                        }}
                    >
                        <i className="bi bi-trash-fill"></i> Xóa đã chọn
                    </Button>
                </div>
                {renderContent()}
            </div>
            <ProductAddNew 
            showAddProduct={showModal} 
            setShowAddProduct={handleCloseModal}
             currentProduct={currentProduct} 
             modalType={modalType} 
             categoryProducts={categoryProducts} 
             onAddProduct={handleAddProduct} />
        </div>
    );
}

export default AdminProduct;
