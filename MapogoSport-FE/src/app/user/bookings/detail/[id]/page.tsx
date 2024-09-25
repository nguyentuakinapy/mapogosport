'use client';
import UserLayout from "@/components/User/UserLayout";
import { useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import '../../../types/user.scss';

declare var H: any;

const BookingsDetail = () => {
    const diaChi = '101 Đường Tôn Dật Tiên, Tân Phú, Quận 7, Hồ Chí Minh';
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null); // Lưu trữ bản đồ

    useEffect(() => {
        const fetchCoordinates = async () => {
            const coords = await getCoordinates(diaChi);
            setCoordinates(coords);
        };

        fetchCoordinates();
    }, [diaChi]);

    const getCoordinates = async (diaChi: string) => {
        const apiKey = '1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ';
        const response = await fetch(
            `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(diaChi)}&apiKey=${apiKey}`
        );

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const { lat, lng } = data.items[0].position;
            return { lat, lon: lng };
        }
        return null;
    };

    useEffect(() => {
        const loadScript = (src: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Script load error: ${src}`));
                document.head.appendChild(script);
            });
        };

        const loadHereMapsScripts = async () => {
            try {
                await Promise.all([
                    loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js'),
                    loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js'),
                    loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js'),
                    loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'),
                ]);

                if (coordinates && mapRef.current && !mapInstanceRef.current) {
                    const platform = new H.service.Platform({
                        apikey: '1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ',
                    });
                    const defaultLayers = platform.createDefaultLayers();
                    const map = new H.Map(
                        mapRef.current,
                        defaultLayers.vector.normal.map,
                        {
                            zoom: 15,
                            center: { lat: coordinates.lat, lng: coordinates.lon },
                        }
                    );

                    const marker = new H.map.Marker({ lat: coordinates.lat, lng: coordinates.lon });
                    map.addObject(marker);

                    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
                    H.ui.UI.createDefault(map, defaultLayers);

                    //Click để chuyển hướng tới google map
                    map.addEventListener('tap', () => {
                        window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`, '_blank');
                    });

                    // Lưu bản đồ vào ref
                    mapInstanceRef.current = map;
                }
            } catch (error) {
                console.error('Error loading Here Maps scripts:', error);
            }
        };

        loadHereMapsScripts();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.dispose(); //clear bản đồ
                mapInstanceRef.current = null; // Đặt lại ref bản đồ
            }
            mapRef.current && (mapRef.current.innerHTML = ''); //clear container bản đồ
        };
    }, [coordinates]);

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Chi tiết đặt sân</b>
            <div style={{ fontSize: '15px' }}>
                <Row className="my-3 booking-container">
                    <Col>
                        <div className="bill-booking">
                            <div className="text-secondary">Thời gian:</div>
                            <div className="py-1"><b className="text-danger">16:00 - 17:00</b></div>
                            <div className="mb-2"><b>Thứ 3, 24/9/2024</b></div>
                        </div>
                        <Table className="my-3">
                            <thead>
                                <tr>
                                    <th style={{ width: '250px' }} className="text-secondary">Tên sân</th>
                                    <th className="text-secondary">Sân</th>
                                    <th className="text-secondary">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="title">Stadium</td>
                                    <td>03</td>
                                    <td>300.000 ₫</td>
                                </tr>
                            </tbody>
                        </Table>
                        <div>
                            <div className="text-secondary">Địa chỉ</div>
                            <b>{diaChi}</b>
                            <Table className="my-3">
                                <thead>
                                    <tr>
                                        <th className="text-secondary">Tên chủ sân</th>
                                        <th className="text-secondary">Số điện thoại</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="title">Nguyễn Phi Hùng</td>
                                        <td>096861480</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col>
                        <div className="map-container">
                            <div className="note-map">Nhấn vào bản đồ để xem đường đi đến sân</div>
                            <div ref={mapRef} className="map-border"></div>
                        </div>
                    </Col>
                </Row>
            </div>
        </UserLayout >
    );
};

export default BookingsDetail;
