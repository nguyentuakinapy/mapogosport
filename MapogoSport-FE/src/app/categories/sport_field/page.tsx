'use client'
import { Container, Row, Col, Pagination } from "react-bootstrap";
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import './Field.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { fetchLocationCurrent } from "../../../app/utils/LocationCurrent"
import useSWR from "swr";
import Loading from "@/components/loading";
import Image from 'next/image';

function Categories() {
    const BASE_URL = 'http://localhost:8080/rest/';
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryField, setSelectedCategoryField] = useState<number[]>([]);
    const [updatedSportFields, setUpdatedSportFields] = useState<SportField[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);

    const { data: categoriesField } = useSWR<CategoryField[]>(`${BASE_URL}category_field`, fetcher);
    const { data: sportFields } = useSWR<SportField[]>(`${BASE_URL}sport_field`, fetcher);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    useEffect(() => {
        if (sportFields && sportFields.length > 0 && currentLocation) {
            const fetchCoordinatesForFields = async () => {
                try {
                    const updatedCategoriesField = await Promise.all(
                        sportFields.map(async (sport_field) => {
                            const coords = await fetchLocationCurrent(sport_field.address);
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            }, (error) => {
                console.error("Error getting location: ", error);
            });
        }
    }, [sportFields]);

    useEffect(() => {
        const storedFilters = sessionStorage.getItem('searchFilters');
        if (storedFilters) {
            const { name, type } = JSON.parse(storedFilters);
            if (name) setSearchTerm(name);
            if (type) setSelectedCategoryField([type]);
            sessionStorage.removeItem('searchFilters');
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
    ).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))) : sportFields?.filter(field =>
        (selectedCategoryField.length === 0 || selectedCategoryField.includes(field.categoriesField.categoriesFieldId)) &&
        (field.name.toLowerCase().includes(searchTerm.toLowerCase()) || field.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const calculateRating = (reviews: FieldReview[]) => {
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0 ? (reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1) : "0.0";
        const fullStars = Math.floor(parseFloat(averageRating));
        const hasHalfStar = parseFloat(averageRating) - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        return { averageRating, reviewCount, fullStars, hasHalfStar, emptyStars };
    };

    const renderContent = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredSportFields?.slice(indexOfFirstItem, indexOfLastItem);
        return renderMenu(currentItems);
    };

    const renderMenu = (field: SportField[] = []) => {
        if (!field.length) {
            return (
                <div className='text-center' style={{ marginTop: "15%" }}>
                    <h1 className='text-center'><i className="bi bi-bag-x"></i></h1>
                    <p>Không tìm thấy sản phẩm.</p>
                </div>
            );
        }
        return field.map((field) => {
            const { fullStars, hasHalfStar, emptyStars } = calculateRating(field.fieldReviews);
            return (
                <Col key={field.sportFieldId} lg={3} md={4} sm={6} xs={12} className="mb-4">
                    <div className='field-card'>
                        <Link href={`/categories/sport_field/detail/${field.sportFieldId}`} >
                            <div className='field-card-inner'>
                                <Image className="image-front" alt={field.name} width={250} height={250} src={String(field.image)} />
                                <h4 className='field-category'>{field.categoriesField.name}</h4>
                                <h3 className='field-title'>{field.name}</h3>
                                <div className="field-address mb-1">
                                    <span className="mx-2">Khu vực:</span>{field.address}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mx-2">
                                    <div className="star-item d-flex mt-1">
                                        <div className="icon text-warning">
                                            {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="bi bi-star-fill"></i>)}
                                            {hasHalfStar && <i className="bi bi-star-half"></i>}
                                            {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="bi bi-star"></i>)}
                                        </div>
                                    </div>
                                    <div className="field-quatity">Số sân: {field.quantity}</div>
                                </div>
                            </div>
                            <div className='field-card-action px-1'>
                                <Link className='button-ajax' href={`/categories/sport_field/detail/${field.sportFieldId}`}>Xem</Link>
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
        const totalPages = filteredSportFields && Math.ceil(filteredSportFields.length / itemsPerPage);
        if (totalPages && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPagination = () => {
        const totalPages = filteredSportFields && Math.ceil(filteredSportFields.length / itemsPerPage);
        const pages = [];

        if (!filteredSportFields || filteredSportFields.length === 0 || totalPages && totalPages === 1) return null;

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
        <Suspense fallback={<div>Đang tải...</div>}>
            <HomeLayout>
                {!sportFields ?
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
                                        {categoriesField && categoriesField.map((category) => (
                                            <label key={category.categoriesFieldId} className="checkbox mb-1">
                                                <input type="checkbox" checked={selectedCategoryField.includes(category.categoriesFieldId)}
                                                    onChange={() => handelCategories(category.categoriesFieldId)} />
                                                <span className="checkbox__label ms-2">{category.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter checkbox-filter mt-3">
                                    <label className="checkbox mb-1 search-label">
                                        <input className="search-input" style={{ borderRadius: '6px' }} type="text"
                                            placeholder="🔍Tìm theo tên, địa chỉ..." value={searchTerm} onChange={handleSearchChange} />
                                    </label>
                                </div>
                                <div className="mt-3">
                                    <div style={{ fontSize: '15px' }}><i className="bi bi-pin-map-fill me-2"></i>Bật vị trí lên để sắp xếp sân gần nhất!</div>
                                </div>
                            </Col>
                            <Col lg={10} md={9} sm={12}>
                                <Row>
                                    <div className="section-header mb-4">
                                        <Image className="icon-sf" src={"/img/football-ground.png"} alt={"Icon SportField"} width={32} height={32} />
                                        <h1>
                                            <span>
                                                <span>
                                                    <span>
                                                        <Image width={314} height={2} src={"/img/line.png"} alt={"line"} className="line-left" />
                                                    </span>
                                                    <span className="diamond-left"></span>
                                                </span>
                                                <span className="title">
                                                    <span>Danh sách sân</span>
                                                </span>
                                                <span>
                                                    <span className="diamond-right"></span>
                                                    <span>
                                                        <Image width={314} height={2} src={"/img/line.png"} alt={"line"} className="line-right" />
                                                    </span>
                                                </span>
                                            </span>
                                        </h1>
                                    </div>
                                    {renderContent()}
                                    {renderPagination()}
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                }
            </HomeLayout>
        </Suspense>
    );
}

export default Categories;