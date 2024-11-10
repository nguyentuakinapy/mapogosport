'use client'
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import { formatPrice } from "@/components/Utils/Format"
import axios from 'axios';

const Categories = () => {
    const categories = [
        { id: 1, name: "Cỏ nhân tạo", quantity: 10 },
        { id: 2, name: "Bóng", quantity: 10 },
        { id: 3, name: "Lưới khung thành", quantity: 10 },
        { id: 4, name: "Máy tập bóng đá", quantity: 10 },
        { id: 5, name: "Phụ kiện", quantity: 10 },
    ];

    const brands = [
        { id: 1, name: "xưởng của nhà làm" },
        { id: 2, name: "xưởng của nhà làm" },
        { id: 3, name: "xưởng của nhà làm" },
        { id: 4, name: "xưởng của nhà làm" },
        { id: 5, name: "xưởng của nhà làm" },
    ];

    const [products, setProducts] = useState([]);  // Initialize as an empty array
    const [icon, setIcon] = useState<boolean[]>([]);
    const [categoriesProduct, setCategoriesProduct] = useState([]);

    // Pagination
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/category-products`);
                const data = await response.json();
                setCategoriesProduct(data);
                console.log(data);
            } catch (error) {
                console.log("Error fetching categories", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/rest/products');
                const data = await response.json();
                setProducts(data);
                setIcon(new Array(data.length).fill(false));  // Initialize icon state
                console.log(data);
            } catch (error) {
                console.log("Error fetching products:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <HomeLayout>
            <Container className='pt-5'>
                <Row>
                    {/* Sidebar */}
                    <Col lg={2} md={3} sm={12} className="mb-3">
                        <div className="d-flex mb-3">
                            <div className="fw-bold text-uppercase filter-panel">
                                <i className="bi bi-funnel"></i>
                                <span className="ms-2" style={{ fontSize: '1rem' }}>Bộ lọc tìm kiếm</span>
                            </div>
                        </div>

                        <div className="filter-group">
                            <legend className="fs-6">Theo Danh Mục</legend>
                            <div className="filter checkbox-filter">
                                {categoriesProduct.map((category) => (
                                    <label key={category.categoryProductId} className="checkbox mb-1">
                                        <input type="checkbox" />
                                        <span className="checkbox__label ms-2">
                                            {category.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <legend className="fs-6">Thương hiệu</legend>
                            <div className="filter checkbox-filter">
                                {brands.map((brand) => (
                                    <label key={brand.id} className="checkbox mb-1">
                                        <input type="checkbox" />
                                        <span className="checkbox__label ms-2">{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* Product list */}
                    <Col lg={10} md={9} sm={12}>
                        <Row>
                            <h3 className="title-section mb-4">
                                <span className="icon">
                                    <img nh-lazy="image" className="img-fluid" alt="Flash Sale"
                                        src="https://img.thegioithethao.vn/media/icon/sale.gif" />
                                </span>
                                Danh sách sản phẩm
                            </h3>

                            {currentItems.map((product, index) => {
                                // Calculate the average rating using reduce
                                const averageRating = product.productReviews && product.productReviews.length > 0
                                    ? product.productReviews.reduce((total, review) => total + review.rating, 0) / product.productReviews.length
                                    : 0;
                                console.log("AVG rating: ", averageRating);


                                return (
                                    <Col key={product.productId} lg={3} md={4} sm={6} xs={12} className="mb-4">
                                        <div nh-product={product.productId} className="product-item">
                                            <div className="inner-image mb-3">
                                                <div className="product-status">
                                                    <div className="onsale"></div>
                                                </div>
                                                <div className="img ratio-1-1">
                                                    <Link href="">
                                                        <img nh-lazy="image" className="img-fluid" alt={product.name}
                                                            src={`${typeof product.image === 'string' ? product.image : ''}`} />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="inner-content">
                                                <div className="price">
                                                    <span className="price-amount ms-1"> {formatPrice(product.price)}</span>
                                                </div>
                                                <div className="product-category ms-1">
                                                    <Link href="">{product.categoryProduct.name}</Link>
                                                </div>
                                                <div className="product-title ms-1" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                                                    <Link href="">{product.name}</Link>
                                                </div>
                                                <div className="d-flex mt-2" style={{ justifyContent: 'space-between', width: '100%' }}>
                                                    <Link href={`/product-detail/${product.productId}`} className='btn btn-danger ms-1' style={{ fontSize: '14px', flexGrow: 1 }}>Mua Ngay</Link>
                                                    <Link href='' className='btn btn-warning ms-2 me-1' style={{ fontSize: '14px', flexGrow: 1 }}>Thêm Giỏ Hàng</Link>
                                                </div>
                                                <div className="star-item star d-flex mt-1 ms-1">
                                                    <div className="icon text-warning mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i
                                                                key={i}
                                                                className={`bi bi-star${i < Math.round(averageRating) ? '-fill' : ''}`}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                    <div className="number ms-2">({product.productReviews.length} bình luận)</div> {/* Display the number of comments */}
                                                </div>
                                        </div>
                                    </Col>
                                );
                            })}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <a className="page-link" href="#" onClick={() => handlePageChange(1)}>&laquo;</a>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => index + 1)
                                            .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                                            .map(page => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <a className="page-link" href="#" onClick={() => handlePageChange(page)}>{page}</a>
                                                </li>
                                            ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <a className="page-link" href="#" onClick={() => handlePageChange(totalPages)}>&raquo;</a>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </HomeLayout>
    );
};

export default Categories;
