'use client';
import UserLayout from "@/components/User/UserLayout";
import { useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import '../../../types/user.scss';
import useSWR from "swr";

declare var H: any;

const BookingsDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [bookingDetail, setBookingDetail] = useState<BookingDetailMap[]>([]);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const apiKey = '1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ';

    const { data, isLoading, error } = useSWR(`http://localhost:8080/rest/user/booking/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setBookingDetail(data);
            const address = data[0].address;
            if (address) {
                fetchCoordinates(address);
            }
        }
    }, [data]);

    const fetchCoordinates = async (address: string) => {
        const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`);
        const coordData = await response.json();
        if (coordData.items && coordData.items.length > 0) {
            const { lat, lng } = coordData.items[0].position;
            setCoordinates({ lat, lon: lng });
        }
    };

    // Load HERE Maps scripts
    useEffect(() => {
        if (!coordinates) return;
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
                    const platform = new H.service.Platform({ apikey: apiKey });
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

                    map.addEventListener('tap', () => {
                        window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`, '_blank');
                    });

                    mapInstanceRef.current = map;
                } else if (coordinates && mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter({ lat: coordinates.lat, lng: coordinates.lon });
                    const marker = new H.map.Marker({ lat: coordinates.lat, lng: coordinates.lon });
                    mapInstanceRef.current.addObject(marker);
                }
            } catch (error) {
                console.error('Error loading HERE Maps scripts:', error);
            }
        };

        loadHereMapsScripts();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.dispose();
                mapInstanceRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }
        };
    }, [coordinates]);

    if (isLoading) return <UserLayout><div>Đang tải...</div></UserLayout>;
    if (error) return <UserLayout><div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div></UserLayout>;

    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Chi tiết đặt sân</b>
            <div style={{ fontSize: '15px' }}>
                <Row className="my-3 booking-container">
                    <Col className="bill-booking">
                        <Table className="my-3">
                            <thead>
                                <tr>
                                    <th className="text-secondary">Ngày đá</th>
                                    <th className="text-secondary">Sân</th>
                                    <th className="text-secondary">Thời gian</th>
                                    <th className="text-secondary">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingDetail.map((booking) => (
                                    <tr key={booking?.bookingDetailId}>
                                        <td>{booking?.date}</td>
                                        <td>{booking?.sportFieldDetailName}</td>
                                        <td>{booking?.startTime} - {booking?.endTime}</td>
                                        <td>{booking?.price} ₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div>
                            <div className="text-secondary mb-2 fw-bold">Địa chỉ</div>
                            <b>{bookingDetail[0]?.address}</b>
                            <Table className="my-3">
                                <thead>
                                    <tr>
                                        <th className="text-secondary">Tên chủ sân</th>
                                        <th className="text-secondary">Số điện thoại</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="title">{bookingDetail[0]?.ownerFullname}</td>
                                        <td>{bookingDetail[0]?.ownerPhoneNumberUsers || "Chưa cập nhật số điện thoại"}</td>
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
        </UserLayout>
    );
};

export default BookingsDetail;
