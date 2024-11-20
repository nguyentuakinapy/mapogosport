'use client'
import { Container, Carousel, Row, Col, Image } from "react-bootstrap";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import '@/app/user/types/user.scss';

function Categories() {


    // Pagination
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };



    const [rating, setRating] = useState<number>(1.5);
    const [sportFields, setSportFields] = useState<SportField[]>([]);
    const [icon, setIcon] = useState<boolean[]>([]); // Để quản lý trạng thái của các biểu tượng
    const [categoriesField, setCategoriesField] = useState<CategoryField[]>([])
    const [selectedCategoryField, setSelectedCategoryField] = useState<number[]>([])
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResp = await fetch(`http://localhost:8080/rest/category_field`)
                const categories = await categoryResp.json();
                setCategoriesField(categories);

                const fieldResp = await fetch('http://localhost:8080/rest/sport_field');
                const fields = await fieldResp.json();
                setSportFields(fields);
            } catch (error) {
                console.log("Error fetch categories", error)
            }
        }
        fetchData()
    }, []);

    useEffect(() => {
        const storedFilters = sessionStorage.getItem('searchFilters');
        if (storedFilters) {
            const { name, type, area } = JSON.parse(storedFilters);
            if (name) setSearchTerm(name);
            if (type) setSelectedCategoryField(type);
        }
    }, []);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5; // Kiểm tra nếu có nửa sao
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="bi bi-star-fill"></i>);
        }
        if (halfStar) {
            stars.push(<i key={fullStars} className="bi bi-star-half"></i>);
        }
        // Thêm sao trống
        for (let i = stars.length; i < 5; i++) {
            stars.push(<i key={i} className="bi bi-star"></i>);
        }
        return stars;
    };

    const onClickIcon = (index: number) => {
        setIcon(prev => {
            const newIcon = [...prev];
            newIcon[index] = !newIcon[index];
            return newIcon;
        });
    };

    const handelCategories = (categoryFieldId: number) => {
        setSelectedCategoryField(prev =>
            prev.includes(categoryFieldId) ? prev.filter(id => id !== categoryFieldId) : [...prev, categoryFieldId]
        )
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Filter logic
    const filteredSportFields = sportFields.filter(field =>
        (selectedCategoryField.length === 0 || selectedCategoryField.includes(field.categoriesField.categoriesFieldId)) &&
        (field.name.toLowerCase().includes(searchTerm.toLowerCase()) || field.address.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    // Update pagination based on filtered results
    const currentItems = filteredSportFields.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSportFields.length / itemsPerPage);

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
                                {categoriesField.map((category) => (
                                    <label key={category.categoriesFieldId} className="checkbox mb-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategoryField.includes(category.categoriesFieldId)}
                                            onChange={() => handelCategories(category.categoriesFieldId)} />
                                        <span className="checkbox__label ms-2">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter checkbox-filter mt-3">
                            <label className="checkbox mb-1">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên, địa chỉ..."
                                    value={searchTerm}
                                    onChange={handleSearchChange} />
                            </label>
                        </div>

                    </Col>

                    {/* Product list */}
                    <Col lg={10} md={9} sm={12}>
                        <Row>
                            <h3 className="title-section mb-4">
                                <span className="icon">
                                    <img nh-lazy="image" className="img-fluid" alt="Flash Sale"
                                        src="https://media.tenor.com/zc4ZHOVUylEAAAAi/philcorbett-football.gif" />
                                </span>
                                Danh sách sân
                            </h3>

                            {/* Product Item */}
                            <div>
                                {/* <h3 className="fw-bold mt-5">SÂN THỂ THAO MỚI</h3> */}
                                <div style={{ fontSize: '15px' }}>
                                    <Row className="my-3">
                                        {currentItems.length === 0 ? (
                                            <div className='text-center' style={{ marginTop: "15%" }}>
                                                <h1 className='text-center'><i className="bi bi-bag-x"></i></h1>
                                                <p>Không tìm thấy sản phẩm.</p>
                                            </div>

                                        ) : null
                                        }
                                        {currentItems.map((field: SportField) => (
                                            <Col xs={3} key={field.sportFieldId}>
                                                <div className="user-border">
                                                    <div className="mb-3">
                                                        <Link href={"#"}>
                                                            <Image
                                                                src={`${field.image}`}
                                                                alt={field.name}
                                                                style={{
                                                                    maxHeight: "200px",
                                                                    maxWidth: "250px",
                                                                    minHeight: "200px",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="content">
                                                        <div className="mb-1 title">
                                                            <Link href={"#"}><b>{field.name}</b></Link>
                                                        </div>
                                                        <div className="address mb-1">
                                                            <span className="me-2">Khu vực:</span>{field.address}
                                                            <span className="mx-2">-</span>Hồ Chí Minh
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>Số sân: {field.quantity}</div>
                                                            <div className="star-item text-warning">
                                                                {renderStars(rating)}
                                                            </div>
                                                        </div>
                                                        <Link href={`/categories/sport_field/detail/${field.sportFieldId}`} className="btn btn-user mt-2">Đặt sân</Link>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </div>
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
}

export default Categories;
