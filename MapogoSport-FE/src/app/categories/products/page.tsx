'use client'
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import { formatPrice } from "@/components/Utils/Format"


const Categories = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [icon, setIcon] = useState<boolean[]>([]); // Để quản lý trạng thái của các biểu tượng
    const [categoriesProduct, setCategoriesProduct] = useState<CategoryProduct[]>([])
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    // Pagination
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/category-products`)
                const data = await response.json();
                setCategoriesProduct(data)
                console.log(data)
            } catch (error) {
                console.log("Error fetch categories", error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/rest/products');
                const data = await response.json();
                console.log(data);
                setProducts(data);
                setIcon(new Array(data.length).fill(false)); // Khởi tạo trạng thái icon
            } catch (error) {
                console.log("Lỗi khi gọi API: ", error);
            }
        };
        fetchData();
    }, []);

    // const onClickIcon = (index: number) => {
    //     setIcon(prev => {
    //         const newIcon = [...prev];
    //         newIcon[index] = !newIcon[index];
    //         return newIcon;
    //     });
    // };
    const uniqueBrands = [...new Set(products.map(product => product.brand))];

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        );
    };

    const handleBrandChange = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const filteredProducts = products.filter(product =>
        (selectedCategories.length === 0 || selectedCategories.includes(product.categoryProduct.categoryProductId)) &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
    );

    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    return (
        <HomeLayout>
            <Container className='pt-5'>
                <Row>
                    {/* Sidebar responsive: hidden on small screens, show on larger */}
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
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.categoryProductId)}
                                            onChange={() => handleCategoryChange(category.categoryProductId)}
                                        />
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
                                {uniqueBrands.map((brand) => (
                                    <label key={brand} className="checkbox mb-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => handleBrandChange(brand)} />
                                        <span className="checkbox__label ms-2">{brand}</span>
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

                            {/* Product Item */}
                            {currentItems.length === 0 ? (
                                <div className='text-center' style={{ marginTop: "15%" }}>
                                    <h1 className='text-center'><i className="bi bi-bag-x"></i></h1>
                                    <p>Không tìm thấy sản phẩm.</p>
                                </div>

                            ) : null
                            }
                            {currentItems.map((product, index) => {
                                const reviews = product.productReviews || [];
                                const reviewCount = reviews.length; // Total number of reviews
                                const averageRating = reviewCount > 0
                                    ? (reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1)
                                    : "0.0"; // Calculate average rating to one decimal place or set to "0.0" if no reviews

                                const fullStars = Math.floor(parseFloat(averageRating)); // Full stars based on integer part of averageRating
                                const hasHalfStar = parseFloat(averageRating) - fullStars >= 0.5; // Determine if a half star is needed
                                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars are empty stars

                                return (
                                    <Col key={product.productId} lg={3} md={4} sm={6} xs={12} className="mb-4">
                                        <div nh-product={product.productId} className="product-item">
                                            <div className="inner-image mb-3">
                                                <div className="product-status">
                                                    <div className="onsale"></div>
                                                </div>
                                                <div className="img ratio-1-1">
                                                    <Link href={`/product-detail/${product.productId}`}>
                                                        <img
                                                            className="w-100 h-100 img-fluid"
                                                            style={{
                                                                maxHeight: "250px",
                                                                maxWidth: "250px",
                                                                minHeight: "250px",
                                                                objectFit: "cover"
                                                            }}
                                                            alt={product.name}
                                                            src={`${typeof product.image === 'string' ? product.image : ''}`}
                                                        />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="inner-content">
                                                <div className="product-title ms-1" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                                                    <Link href={`/product-detail/${product.productId}`}>{product.name}</Link>
                                                </div>
                                                <div className="product-category ms-1">
                                                    <Link href={`/product-detail/${product.productId}`}>{product.categoryProduct.name}</Link>
                                                </div>
                                                <div className="price">
                                                    <span className="price-amount ms-1">{formatPrice(product.price)}</span>
                                                </div>

                                                {/* Average rating stars */}
                                                <div className="star-item star d-flex mt-1 ms-1">
                                                    <div className="icon text-warning mb-2">
                                                        {[...Array(fullStars)].map((_, i) => (
                                                            <i key={`full-${i}`} className="bi bi-star-fill"></i>
                                                        ))}
                                                        {hasHalfStar && <i className="bi bi-star-half"></i>}
                                                        {[...Array(emptyStars)].map((_, i) => (
                                                            <i key={`empty-${i}`} className="bi bi-star"></i>
                                                        ))}
                                                    </div>
                                                    {/* Display average rating and review count */}
                                                    <div className="number ms-1">({averageRating} stars, {reviewCount} reviews)</div>
                                                </div>

                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}



                            <>
                                {totalPages > 1 && (
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center">
                                            {/* Nút về trang đầu tiên */}
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <a
                                                    className="page-link"
                                                    href="#"
                                                    aria-label="First"
                                                    onClick={() => handlePageChange(1)}
                                                    title="Go to first page"
                                                >
                                                    <span aria-hidden="true">&laquo;</span>
                                                </a>
                                            </li>

                                            {/* Hiển thị 5 trang tùy theo currentPage */}
                                            {Array.from({ length: totalPages }, (_, index) => {
                                                let startPage = 1;
                                                let endPage = 5;

                                                // Nếu tổng số trang lớn hơn 5
                                                if (totalPages > 5) {
                                                    // Điều chỉnh để luôn hiển thị 5 trang
                                                    if (currentPage > 3) {
                                                        startPage = currentPage - 2;
                                                        endPage = currentPage + 2;
                                                        if (endPage > totalPages) {
                                                            endPage = totalPages;
                                                            startPage = totalPages - 4; // Đảm bảo vẫn hiển thị đủ 5 trang
                                                        }
                                                    }
                                                } else {
                                                    // Nếu tổng số trang ít hơn hoặc bằng 5, hiển thị tất cả
                                                    endPage = totalPages;
                                                }

                                                // Hiển thị các trang từ startPage đến endPage
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
                                                                onClick={() => handlePageChange(index + 1)}
                                                            >
                                                                {index + 1}
                                                            </a>
                                                        </li>
                                                    );
                                                }

                                                return null;
                                            })}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <a
                                                    className="page-link"
                                                    href="#"
                                                    aria-label="Last"
                                                    onClick={() => handlePageChange(totalPages)}
                                                    title="Go to last page"
                                                >
                                                    <span aria-hidden="true">&raquo;</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </>
                        </Row>
                    </Col>

                </Row>
            </Container>
        </HomeLayout>
    );
};

export default Categories;
