'use client'
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import "./Product.scss";
import Link from 'next/link';
import { useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import { formatPrice } from "@/components/Utils/Format"
import Image from 'next/image';
import useSWR from 'swr';
import Loading from '@/components/loading';

const Categories = () => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const { data: categoriesProduct } = useSWR<CategoryProduct[]>("http://localhost:8080/rest/category_product/category-products", fetcher);
    const { data: products } = useSWR<Product[]>("http://localhost:8080/rest/products", fetcher);

    const uniqueBrands = [...new Set(products?.map(product => product.brand))];

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

    const filteredProducts = products?.filter(product =>
        (selectedCategories.length === 0 || selectedCategories.includes(product.categoryProduct.categoryProductId)) &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
    );

    const renderContent = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
        return renderMenu(currentItems);
    };

    const calculateRating = (reviews: ProductReview[]) => {
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0 ? (reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1) : "0.0";
        const fullStars = Math.floor(parseFloat(averageRating));
        const hasHalfStar = parseFloat(averageRating) - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return { averageRating, reviewCount, fullStars, hasHalfStar, emptyStars };
    };

    const renderMenu = (products: Product[] = []) => {
        if (!products.length) {
            return (
                <div className="text-center" style={{ marginTop: "15%" }}>
                    <h1 className="text-center"><i className="bi bi-bag-x"></i></h1>
                    <p>Không tìm thấy sản phẩm.</p>
                </div>
            );
        }
        return products.map((product) => {
            const { fullStars, hasHalfStar, emptyStars } = calculateRating(product.productReviews);
            return (
                <Col key={product.productId} lg={3} md={4} sm={6} xs={12} className="mb-4">
                    <div className='product-card'>
                        <Link href={`/categories/products/detail/${product.productId}`} >
                            <div className='product-card-inner'>
                                <Image className="image-front" alt={product.name} width={250} height={250} src={String(product.image)} />
                                <h4 className='product-category'>{product.categoryProduct.name}</h4>
                                <h3 className='product-title'>{product.name}</h3>
                                <div className='product-price'>{formatPrice(product.price)}</div>
                                <div className="star-item d-flex mt-1">
                                    <div className="icon text-warning">
                                        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="bi bi-star-fill"></i>)}
                                        {hasHalfStar && <i className="bi bi-star-half"></i>}
                                        {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="bi bi-star"></i>)}
                                    </div>
                                </div>
                            </div>
                            <div className='product-card-action px-1'>
                                <Link className='button-ajax' href={`/categories/products/detail/${product.productId}`}>Xem</Link>
                            </div>
                        </Link>
                    </div>
                </Col>
            );
        });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = filteredProducts && Math.ceil(filteredProducts.length / itemsPerPage);
        if (totalPages && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPagination = () => {
        const totalPages = filteredProducts && Math.ceil(filteredProducts.length / itemsPerPage);
        const pages = [];

        if (!filteredProducts || filteredProducts.length === 0 || totalPages && totalPages === 1) return null;

        if (totalPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
                );
            }
        }

        return (
            <Pagination className='d-flex justify-content-center'>
                <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

    return (
        <HomeLayout>
            {!products ?
                <div className='d-flex justify-content-center align-items-center' style={{ height: '90vh' }}>
                    <Loading></Loading>
                </div>
                :
                <Container className='pt-5'>
                    <Row>
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
                                    {categoriesProduct && categoriesProduct.map((category) => (
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
                            <h3 className="title-section mb-4">
                                <span className="icon">
                                    <Image className="img-fluid" alt="Flash Sale" width={40} height={40} src="/img/sale.gif" />
                                </span>
                                Danh sách sản phẩm
                            </h3>
                            <Row>
                                {renderContent()}
                                {renderPagination()}
                            </Row>
                        </Col>

                    </Row>
                </Container>
            }
        </HomeLayout>
    );
};

export default Categories;
