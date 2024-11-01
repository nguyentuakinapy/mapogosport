'use client';
import Link from 'next/link';
import { Row, Col, Form, FormCheck, Button, Table, Image, Nav } from "react-bootstrap";
import '../adminStyle.scss';
import { useState, useEffect } from "react";
import CategoryAddNew from "@/components/Admin/Modal/categoryProduct.addNew";

import { toast } from "react-toastify";
import CategoryFieldAddNew from '@/components/Admin/Modal/categoryField.addNew';

const AdminProduct = () => {

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'add' | 'edit'>('add');
    const [currentCategoryProduct, setCurrentCategoryProduct] = useState<CategoryProduct | null>(null); // Updated type to allow null
    const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([]);
    const [categoryField, setCategoryField] = useState<CategoryField[]>([]);
    const [currentCategoryField, setCurrentCategoryField] = useState<CategoryField | null>(null); // Updated type to allow null
    const [activeTab, setActiveTab] = useState<string>('categoriesProduct');

    // Pagination
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;




    //categoriesProduct

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/category-products`);
                const data = await response.json();
                setCategoryProducts(data);
                console.log('category', data);
            } catch (error) {
                console.log("Error fetching category data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCreateClick = () => {
        setCurrentCategoryProduct(null);
        setModalType('add');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentCategoryProduct(null);
    };

    const handleDelete = async (id: number) => {
        // Cập nhật giao diện trước khi có phản hồi từ server
        const originalProducts = categoryProducts;
        setCategoryProducts(prevProducts => prevProducts.filter(product => product.categoryProductId !== id));

        try {
            const response = await fetch(`http://localhost:8080/rest/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Nếu việc xóa thất bại, khôi phục lại danh sách ban đầu
                setCategoryProducts(originalProducts);
                toast.error('Xóa sản phẩm thất bại');
            } else {
                toast.success('Sản phẩm đã được xóa thành công');
            }
        } catch (error) {
            // Khôi phục lại danh sách ban đầu nếu có lỗi
            setCategoryProducts(originalProducts);
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
            console.error('Error deleting product:', error);
        }
    };

    const handleAddNewCategory = (newCategory: CategoryProduct) => {
        if (newCategory.categoryProductId === currentCategoryProduct?.categoryProductId) {
            // Edit mode: update the existing category
            setCategoryProducts(prevCategories =>
                prevCategories.map(category =>
                    category.categoryProductId === newCategory.categoryProductId ? newCategory : category
                )
            );
        } else {
            // Add mode: add the new category
            setCategoryProducts(prevCategories => [...prevCategories, newCategory]);
            setTimeout(() => scrollToNewCategory(newCategory.categoryProductId), 0);
        }
    };



    const scrollToNewCategory = (id: number) => {
        const newRow = document.getElementById(`category-${id}`);
        console.log("Scrolling to:", newRow); // Đảm bảo rằng nó không phải là null
        if (newRow) {
            newRow.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            console.warn(`Element with id category-${id} not found.`);
        }
    };

    //cuộn khi thay đổi
    useEffect(() => {
        if (currentCategoryProduct) {
            scrollToNewCategory(currentCategoryProduct.categoryProductId);
        }
    }, [categoryProducts, currentCategoryProduct]);

    //pagination CategoryProduct
    const currentItemsCategoryProduct = categoryProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPagesCategoryProduct = Math.ceil(categoryProducts.length / itemsPerPage);
    const handlePageChangeCategoryProduct = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };


    //categoriesField

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/category_field`);
                const data = await response.json();
                setCategoryField(data);
                console.log('category field', data);
            } catch (error) {
                console.log("Error fetching category field data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCreateClickField = () => {
        setCurrentCategoryField(null);
        setModalType('add');
        setShowModal(true);
    };

    const handleCloseModalField = () => {
        setShowModal(false);
        setCurrentCategoryField(null);
    };

    const handleDeleteField = async (id: number) => {
        // Cập nhật giao diện trước khi có phản hồi từ server
        const originalField = categoryField;
        setCategoryField(prevField => prevField.filter(field => field.categoriesFieldId !== id));

        try {
            const response = await fetch(`http://localhost:8080/rest/delete/category_field/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Nếu việc xóa thất bại, khôi phục lại danh sách ban đầu
                setCategoryField(originalField);
                toast.error('Xóa loại sân thất bại');
            } else {
                toast.success('Loại sân đã được xóa thành công');
            }
        } catch (error) {
            // Khôi phục lại danh sách ban đầu nếu có lỗi
            setCategoryField(originalField);
            toast.error('Có lỗi xảy ra khi xóa loại sân');
            console.error('Error deleting categoryfield:', error);
        }
    };

    const handleAddNewCategoryField = (newCategory: CategoryField) => {
        if (newCategory.categoriesFieldId === currentCategoryField?.categoriesFieldId) {
            // Edit mode: update the existing category
            setCategoryField(prevCategories =>
                prevCategories.map(category =>
                    category.categoriesFieldId === newCategory.categoriesFieldId ? newCategory : category
                )
            );
        } else {
            // Add mode: add the new category
            setCategoryField(prevCategories => [...prevCategories, newCategory]);
            setTimeout(() => scrollToNewCategory(newCategory.categoriesFieldId), 0);
        }
    };

    const scrollToNewCategoryField = (id: number) => {
        const newRow = document.getElementById(`category-${id}`);
        console.log("Scrolling to:", newRow); // Đảm bảo rằng nó không phải là null
        if (newRow) {
            newRow.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            console.warn(`Element with id category-${id} not found.`);
        }
    };

    //cuộn khi thay đổi
    useEffect(() => {
        if (currentCategoryField) {
            scrollToNewCategoryField(currentCategoryField.categoriesFieldId);
        }
    }, [categoryField, currentCategoryField]);

    //pagination Category Field
    const currentItemsCategoryField = categoryField.slice(indexOfFirstItem, indexOfLastItem);
    const totalPagesCategoryField = Math.ceil(categoryField.length / itemsPerPage);
    const handlePageChangeCategoryField = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'categoriesProduct':
                return (
                    <div className="box-table-border mb-4">
                        <Table striped className="mb-0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Hình ảnh</th>
                                    <th>ID</th>
                                    <th>Thông tin sản phẩm</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItemsCategoryProduct.map((category, index) => (
                                    <tr id={`category-${category.categoryProductId}`} key={category.categoryProductId}>
                                        <td className="text-center align-middle">{index + 1}</td>
                                        <td className="text-center align-middle">
                                            <Link href="#">
                                                <Image
                                                    src={`http://localhost:8080/images/product-images/${category.image}`}
                                                    style={{ width: '150px', height: 'auto' }}
                                                    className="mx-2"
                                                />
                                            </Link>
                                        </td>
                                        <td className="text-start align-middle">
                                            <div className='text-center'>
                                                <strong className="text-dark">{category.categoryProductId}</strong>
                                            </div>
                                        </td>
                                        <td className="text-start align-middle">
                                            <div className='text-center'>
                                                <strong className="text-dark">{category.name}</strong>
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            <Button variant="warning" className="m-1" onClick={() => {
                                                setCurrentCategoryProduct(category);
                                                setModalType('edit');
                                                setShowModal(true);
                                            }}>
                                                <i className="bi bi-pencil-fill"></i>
                                            </Button>
                                            <Button variant="danger" className="m-1" onClick={() => handleDelete(category.categoryProductId)}>
                                                <i className="bi bi-trash3-fill"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <>
                                {totalPagesCategoryProduct > 1 && (
                                    <div className="d-flex justify-content-center mt-3">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                {/* First page button */}
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <a
                                                        className="page-link"
                                                        href="#"
                                                        aria-label="First"
                                                        onClick={() => handlePageChangeCategoryProduct(1)}
                                                        title="Go to first page"
                                                    >
                                                        <span aria-hidden="true">&laquo;</span>
                                                    </a>
                                                </li>

                                                {/* Display page numbers */}
                                                {Array.from({ length: totalPagesCategoryProduct }, (_, index) => {
                                                    let startPage = 1;
                                                    let endPage = 5;

                                                    if (totalPagesCategoryProduct > 5) {
                                                        if (currentPage > 3) {
                                                            startPage = currentPage - 2;
                                                            endPage = currentPage + 2;
                                                            if (endPage > totalPagesCategoryProduct) {
                                                                endPage = totalPagesCategoryProduct;
                                                                startPage = totalPagesCategoryProduct - 4;
                                                            }
                                                        }
                                                    } else {
                                                        endPage = totalPagesCategoryProduct;
                                                    }

                                                    if (index + 1 >= startPage && index + 1 <= endPage) {
                                                        return (
                                                            <li
                                                                key={index + 1}
                                                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                                title={`Go to page ${index + 1}`}
                                                            >
                                                                <a
                                                                    className="page-link"
                                                                    href="#"
                                                                    onClick={() => handlePageChangeCategoryProduct(index + 1)}
                                                                >
                                                                    {index + 1}
                                                                </a>
                                                            </li>
                                                        );
                                                    }

                                                    return null;
                                                })}
                                                {/* Last page button */}
                                                <li className={`page-item ${currentPage === totalPagesCategoryProduct ? 'disabled' : ''}`}>
                                                    <a
                                                        className="page-link"
                                                        href="#"
                                                        aria-label="Last"
                                                        onClick={() => handlePageChangeCategoryProduct(totalPagesCategoryProduct)}
                                                        title="Go to last page"
                                                    >
                                                        <span aria-hidden="true">&raquo;</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        </Table>
                        <CategoryAddNew
                            showAddCategory={showModal}
                            setShowAddCategory={handleCloseModal}
                            currentCategory={currentCategoryProduct}
                            modalType={modalType}
                            onSave={handleAddNewCategory}
                        />
                    </div>
                );

            case 'categoriesField':
                return (
                    <div className="box-table-border mb-4 text-center">
                        <Table striped className="mb-0">
                            <thead>
                                <tr>
                                    {/* <th>
                                        <FormCheck
                                            type="checkbox"
                                            checked={selectAllProduct}
                                            onChange={() => {
                                                const newSelectedProducts = selectAllProduct ? [] : categoryProducts.map(cat => cat.categoryProductId);
                                                setSelectedProducts(newSelectedProducts);
                                                setSelectAllProduct(!selectAllProduct);
                                            }}
                                        />
                                    </th> */}
                                    <th>STT</th>
                                    <th>Hình ảnh</th>
                                    <th>ID</th>
                                    <th>Thông tin sân</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryField.map((category, index) => (
                                    <tr id={`category-${category.categoriesFieldId}`} key={category.categoriesFieldId}>
                                        {/* <td className="text-center align-middle">
                                            <FormCheck
                                                type="checkbox"
                                                checked={selectedProducts.includes(category.categoryProductId)}
                                                onChange={() => {
                                                    if (selectedProducts.includes(category.categoryProductId)) {
                                                        setSelectedProducts(selectedProducts.filter(id => id !== category.categoryProductId));
                                                    } else {
                                                        setSelectedProducts([...selectedProducts, category.categoryProductId]);
                                                    }
                                                }}
                                            />
                                        </td> */}
                                        <td className="text-center align-middle">{index + 1}</td>
                                        <td className="text-center align-middle">
                                            <Link href="#">
                                                <Image
                                                    src={`http://localhost:8080/images/product-images/${category.image}`}
                                                    style={{ width: '150px', height: 'auto' }}
                                                    className="mx-2"
                                                // alt={category.image}
                                                />
                                            </Link>
                                        </td>
                                        <td className="text-start align-middle">
                                            <div className='text-center'>
                                                <strong className="text-dark">{category.categoriesFieldId}</strong>
                                            </div>
                                        </td>
                                        <td className="text-start align-middle">
                                            <div className='text-center'>
                                                <strong className="text-dark">{category.name}</strong>
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            <Button variant="warning" className="m-1" onClick={() => {
                                                setCurrentCategoryField(category);
                                                setModalType('edit');
                                                setShowModal(true);
                                            }}>
                                                <i className="bi bi-pencil-fill"></i>
                                            </Button>
                                            <Button variant="danger" className="m-1" onClick={() => handleDeleteField(category.categoriesFieldId)}>
                                                <i className="bi bi-trash3-fill"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>

                        {totalPagesCategoryField > 1 && (
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="First"
                                            onClick={() => handlePageChangeCategoryField(1)}
                                            title="Go to first page"
                                        >
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>

                                    {Array.from({ length: totalPagesCategoryField }, (_, index) => {
                                        let startPage = 1;
                                        let endPage = 5;

                                        if (totalPagesCategoryField > 5) {
                                            if (currentPage > 3) {
                                                startPage = currentPage - 2;
                                                endPage = currentPage + 2;
                                                if (endPage > totalPagesCategoryField) {
                                                    endPage = totalPagesCategoryField;
                                                    startPage = totalPagesCategoryField - 4;
                                                }
                                            }
                                        } else {
                                            endPage = totalPagesCategoryField;
                                        }

                                        if (index + 1 >= startPage && index + 1 <= endPage) {
                                            return (
                                                <li
                                                    key={index + 1}
                                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                    title={`Go to page ${index + 1}`}
                                                >
                                                    <a
                                                        className="page-link"
                                                        href="#"
                                                        onClick={() => handlePageChangeCategoryField(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </a>
                                                </li>
                                            );
                                        }

                                        return null;
                                    })}
                                    <li className={`page-item ${currentPage === totalPagesCategoryField ? 'disabled' : ''}`}>
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="Last"
                                            onClick={() => handlePageChangeCategoryField(totalPagesCategoryField)}
                                            title="Go to last page"
                                        >
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        )}


                        <CategoryFieldAddNew
                            showAddCategory={showModal}
                            setShowAddCategory={handleCloseModalField}
                            currentCategory={currentCategoryField}
                            modalType={modalType}
                            onSave={handleAddNewCategoryField}
                        />
                    </div>
                );
        }

    };

    return (
        <div style={{ fontSize: '14px' }}>
            <div className="box-ultil">
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Loại</b>
            </div>
            <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                <Nav.Item>
                    <Nav.Link eventKey="categoriesProduct" className="tab-link">Loại sản phẩm</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="categoriesField" className="tab-link">Loại sân</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                <div className="text-end py-0">
                    <Button variant="success" className="mb-4 me-3" onClick={handleCreateClick}>
                        <i className="bi bi-plus-square-fill"><span className='mx-1'>Tạo mới</span></i>
                    </Button>
                    <Button className="btn-sd-admin mb-4" style={{ background: '#142239', border: 'none' }}>
                        <i className="bi bi-file-earmark-excel"></i><span className='mx-1'>Export</span>
                    </Button>
                    {/* <Button
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
                    </Button> */}
                </div>
                {renderContent()}
            </div>

        </div>
    );
}

export default AdminProduct;
