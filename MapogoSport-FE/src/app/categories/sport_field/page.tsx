'use client'
import { Container, Row, Col, Image } from "react-bootstrap";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import '@/app/user/types/user.scss';
import { fetchCoordinates } from "../../../app/utils/geocode";
import '@fortawesome/fontawesome-free/css/all.min.css';


function Categories() {

    // Pagination
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const [sportFields, setSportFields] = useState<SportField[]>([]);
    const [categoriesField, setCategoriesField] = useState<CategoryField[]>([]);
    const [selectedCategoryField, setSelectedCategoryField] = useState<number[]>([]);
    const [updatedSportFields, setUpdatedSportFields] = useState<SportField[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);

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

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    useEffect(() => {
        if (sportFields.length > 0 && currentLocation) {
            const fetchCoordinatesForFields = async () => {
                try {
                    const updatedCategoriesField = await Promise.all(
                        sportFields.map(async (sport_field) => {
                            const coords = await fetchCoordinates(sport_field.address);
                            const distance = coords ? calculateDistance(currentLocation.lat, currentLocation.lng, coords.lat, coords.lon) : 0;
                            return { ...sport_field, coordinates: coords, distance: distance };
                        })
                    );
                    setUpdatedSportFields(updatedCategoriesField);
                } catch (error) {
                    console.error("Error fetching coordinates: ", error);
                }
            };

            fetchCoordinatesForFields();
        }
    }, [sportFields, currentLocation]);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        const storedFilters = sessionStorage.getItem('searchFilters');
        if (storedFilters) {
            const { name, type, area } = JSON.parse(storedFilters);
            if (name) setSearchTerm(name);
            if (type) setSelectedCategoryField(type);
        }
    }, []);

    const handelCategories = (categoryFieldId: number) => {
        setSelectedCategoryField(prev =>
            prev.includes(categoryFieldId) ? prev.filter(id => id !== categoryFieldId) : [...prev, categoryFieldId]
        )
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredSportFields = updatedSportFields.length > 0 ? (updatedSportFields.filter(field =>
        (selectedCategoryField.length === 0 || selectedCategoryField.includes(field.categoriesField.categoriesFieldId)) &&
        (field.name.toLowerCase().includes(searchTerm.toLowerCase()) || field.address.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))) : sportFields.filter(field =>
        (selectedCategoryField.length === 0 || selectedCategoryField.includes(field.categoriesField.categoriesFieldId)) &&
        (field.name.toLowerCase().includes(searchTerm.toLowerCase()) || field.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const currentItems = filteredSportFields.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSportFields.length / itemsPerPage);

    return (
        <HomeLayout>
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
                            <label className="checkbox mb-1 search-label">
                                <input
                                    className="search-input"
                                    style={{ borderRadius: '6px' }}
                                    type="text"
                                    placeholder="🔍Tìm theo tên, địa chỉ..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </label>

                        </div>

                        <div className="mt-3">
                            <div style={{fontSize:'15px'}}><i className="bi bi-pin-map-fill me-2"></i>Bật vị trí lên để sắp xếp sân gần nhất!</div>
                        </div>

                    </Col>

                    <Col lg={10} md={9} sm={12}>
                        <Row>
                            <h3 className="title-section mb-4">
                                <span className="icon">
                                    <Image nh-lazy="image" className="img-fluid" alt="Flash Sale"
                                        src="https://media.tenor.com/zc4ZHOVUylEAAAAi/philcorbett-football.gif" />
                                </span>
                                Danh sách sân
                            </h3>

                            <div>
                                <div style={{ fontSize: '15px' }}>
                                    <Row className="my-3">
                                        {currentItems.length === 0 ? (
                                            <div className='text-center' style={{ marginTop: "15%" }}>
                                                <h1 className='text-center'><i className="bi bi-bag-x"></i></h1>
                                                <p>Không tìm thấy sản phẩm.</p>
                                            </div>
                                        ) : null}
                                        {currentItems.map((field: SportField) => {
                                            // Access the reviews for this sport field
                                            const reviews = field.fieldReviews || []; // Assuming field has a 'reviews' property
                                            const reviewCount = reviews.length; // Total number of reviews
                                            const averageRating = reviewCount > 0
                                                ? (reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1)
                                                : "0.0"; // Calculate average rating to one decimal place or set to "0.0" if no reviews

                                            const fullStars = Math.floor(parseFloat(averageRating)); // Full stars based on integer part of averageRating
                                            const hasHalfStar = parseFloat(averageRating) - fullStars >= 0.5; // Determine if a half star is needed
                                            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars are empty stars

                                            // Render stars based on calculated values
                                            const renderStars = () => (
                                                <>
                                                    {[...Array(fullStars)].map((_, index) => (
                                                        <i key={`full-${index}`} className="fas fa-star"></i>
                                                    ))}
                                                    {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
                                                    {[...Array(emptyStars)].map((_, index) => (
                                                        <i key={`empty-${index}`} className="far fa-star"></i>
                                                    ))}
                                                </>
                                            );

                                            return (
                                                <Col xs={3} key={field.sportFieldId}>
                                                    <div className="user-border">
                                                        <div className="mb-3">
                                                            <Link href={`/categories/sport_field/detail/${field.sportFieldId}`}>
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
                                                                <Link href="#">
                                                                    <b>{field.name}</b>
                                                                </Link>
                                                            </div>
                                                            <div className="address mb-1">
                                                                <span className="me-2">Khu vực:</span>{field.address}
                                                                <span className="mx-2">-</span>Hồ Chí Minh
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>Số sân: {field.quantity}</div>
                                                                <div className="star-item text-warning">
                                                                    {renderStars()}
                                                                </div>
                                                            </div>
                                                            <Link href={`/categories/sport_field/detail/${field.sportFieldId}`} className="btn btn-user mt-2">Đặt sân</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </div>
                            </div>
                            <>
                                {totalPages > 1 && (
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center">
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
                                            {Array.from({ length: totalPages }, (_, index) => {
                                                let startPage = 1;
                                                let endPage = 5;
                                                if (totalPages > 5) {
                                                    if (currentPage > 3) {
                                                        startPage = currentPage - 2;
                                                        endPage = currentPage + 2;
                                                        if (endPage > totalPages) {
                                                            endPage = totalPages;
                                                            startPage = totalPages - 4;
                                                        }
                                                    }
                                                } else {
                                                    endPage = totalPages;
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
                                {/* <div>
                                    {currentLocation && (
                                        <div>
                                            Current Location: Latitude {currentLocation.lat}, Longitude {currentLocation.lng}
                                        </div>
                                    )}
                                </div> */}
                            </>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </HomeLayout>
    );
}

export default Categories;