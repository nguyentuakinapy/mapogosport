// 'use client';
// import UserLayout from "@/components/User/UserLayout";
// import { useEffect, useRef, useState } from "react";
// import { Col, Row, Table } from "react-bootstrap";
// import '../../../types/user.scss';
// import useSWR from "swr";

// declare var H: any;

// const BookingsDetail = ({ params }: { params: { id: number } }) => {
//     const fetcher = (url: string) => fetch(url).then((res) => res.json());

//     const { data, error } = useSWR(`http://localhost:8080/rest/user/booking/detail/${params.id}`, fetcher, {
//         revalidateIfStale: false,
//         revalidateOnFocus: false,
//         revalidateOnReconnect: false,
//     });

//     const [booking, setBooking] = useState<Booking[]>([]);
//     const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
//     const mapRef = useRef<HTMLDivElement | null>(null);
//     const mapInstanceRef = useRef<any>(null); // Lưu trữ bản đồ
//     const apiKey = '1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ';

//     useEffect(() => {
//         if (data) {
//             console.log('Fetched Data:', data);
//             setBooking(data);
//             const address = data.sportFieldInfo.address;
//             if (address) {
//                 fetchCoordinates(address);
//             }
//         }
//     }, [data]);

//     const fetchCoordinates = async (address: string) => {
//         const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`);
//         const coordData = await response.json();
//         if (coordData.items && coordData.items.length > 0) {
//             const { lat, lng } = coordData.items[0].position;
//             setCoordinates({ lat, lon: lng });
//         }
//     };

//     //Tải Script của HERE MAP
//     useEffect(() => {
//         const loadScript = (src: string): Promise<void> => {
//             return new Promise((resolve, reject) => {
//                 const script = document.createElement('script');
//                 script.src = src;
//                 script.async = true;
//                 script.onload = () => resolve();
//                 script.onerror = () => reject(new Error(`Script load error: ${src}`));
//                 document.head.appendChild(script);
//             });
//         };

//         const loadHereMapsScripts = async () => {
//             try {
//                 await Promise.all([
//                     loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js'),
//                     loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js'),
//                     loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js'),
//                     loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'),
//                 ]);

//                 if (coordinates && mapRef.current && !mapInstanceRef.current) {
//                     const platform = new H.service.Platform({
//                         apikey: apiKey,
//                     });
//                     const defaultLayers = platform.createDefaultLayers();
//                     const map = new H.Map(
//                         mapRef.current,
//                         defaultLayers.vector.normal.map,
//                         {
//                             zoom: 15,
//                             center: { lat: coordinates.lat, lng: coordinates.lon },
//                         }
//                     );

//                     const marker = new H.map.Marker({ lat: coordinates.lat, lng: coordinates.lon });
//                     map.addObject(marker);

//                     new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
//                     H.ui.UI.createDefault(map, defaultLayers);

//                     // Click to navigate to Google Maps
//                     map.addEventListener('tap', () => {
//                         window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`, '_blank');
//                     });

//                     mapInstanceRef.current = map; // Gán bản đồ mới vào ref
//                 } else if (coordinates && mapInstanceRef.current) {
//                     // Nếu đã có bản đồ, chỉ cần cập nhật lại vị trí
//                     mapInstanceRef.current.setCenter({ lat: coordinates.lat, lng: coordinates.lon });
//                     mapInstanceRef.current.setZoom(15);
//                     mapInstanceRef.current.setCenter({ lat: coordinates.lat, lng: coordinates.lon }); // Cập nhật vị trí cho marker
//                     const marker = new H.map.Marker({ lat: coordinates.lat, lng: coordinates.lon });
//                     mapInstanceRef.current.addObject(marker); // Thêm marker vào bản đồ hiện tại
//                 }
//             } catch (error) {
//                 console.error('Error loading HERE Maps scripts:', error);
//             }
//         };

//         loadHereMapsScripts();

//         return () => {
//             if (mapInstanceRef.current) {
//                 mapInstanceRef.current.dispose(); // Clear map
//                 mapInstanceRef.current = null; // Reset map ref
//             }
//             if (mapRef.current) {
//                 mapRef.current.innerHTML = ''; // Clear map container
//             }
//         };
//     }, [coordinates]);

//     return (
//         <UserLayout>
//             <b className='text-danger' style={{ fontSize: '20px' }}>Chi tiết đặt sân</b>
//             <div style={{ fontSize: '15px' }}>
//                 <Row className="my-3 booking-container">
//                     <Col>
//                         {/* <div className="bill-booking">
//                             <div className="text-secondary">Thời gian:</div>
//                             <div className="py-1">
//                                 <b className="text-danger">
//                                     {bookingDetail?.startTime?.substring(0, 5)} - {bookingDetail?.endTime?.substring(0, 5)}
//                                 </b>
//                             </div>
//                             <div className="mb-2">
//                                 <b>
//                                     {booking?.date ? new Date(booking.date).toLocaleDateString('vi-VN', {
//                                         weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric',
//                                     }) : "N/A"}
//                                 </b>
//                             </div>
//                         </div> */}
//                         <Table className="my-3">
//                             <thead>
//                                 <tr>
//                                     <th className="text-secondary">Sân</th>
//                                     <th className="text-secondary">Thời gian</th>
//                                     <th className="text-secondary">Giá</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {booking.length > 0 && booking[0].bookingDetails.map((detail) => (
//                                     <tr key={detail.bookingDetailId}>
//                                         <td>{detail.sportFieldDetail.name}</td>
//                                         <td>{detail.startTime.substring(0, 5)} - {detail.endTime.substring(0, 5)}</td>
//                                         <td>{detail.price}</td>
//                                     </tr>
//                                 ))}
//                                 {/* <tr>
//                                     <td className="title">{bookingDetail?.sportFieldDetail?.sportField?.name}</td>
//                                     <td>{bookingDetail?.sportFieldDetail?.name}</td>
//                                     <td>{bookingDetail?.price?.toLocaleString()} ₫</td>
//                                 </tr> */}
//                             </tbody>
//                         </Table>
//                         {booking.length > 0 && (
//                             <div>
//                                 <div className="text-secondary">Địa chỉ</div>
//                                 <b>{booking[0].sportFieldInfo?.address || 'Địa chỉ không có sẵn'}</b>
//                                 <Table className="my-3">
//                                     <thead>
//                                         <tr>
//                                             <th className="text-secondary">Tên chủ sân</th>
//                                             <th className="text-secondary">Số điện thoại</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td className="title">{booking[0].owner?.user?.fullname || 'Chủ sân không có sẵn'}</td>
//                                             <td>{booking[0].owner?.user?.addressUsers[0]?.phoneNumber || 'Số điện thoại không có sẵn'}</td>
//                                         </tr>
//                                     </tbody>
//                                 </Table>
//                             </div>
//                         )}
//                     </Col>
//                     <Col>
//                         <div className="map-container">
//                             <div className="note-map">Nhấn vào bản đồ để xem đường đi đến sân</div>
//                             <div ref={mapRef} className="map-border"></div>
//                         </div>
//                     </Col>
//                 </Row>
//             </div>
//         </UserLayout>
//     );
// };

// export default BookingsDetail;

'use client';
import UserLayout from "@/components/User/UserLayout";
import { useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import '../../../types/user.scss';
import useSWR from "swr";

declare var H: any;

const BookingsDetail = ({ params }: { params: { id: number } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, isLoading, error } = useSWR(`http://localhost:8080/rest/user/booking/detail/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [booking, setBooking] = useState<Booking | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const apiKey = '1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ';

    useEffect(() => {
        if (data) {
            console.log('Fetched Data:', data);
            setBooking(data);
            const address = data.sportFieldInfo?.address;
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
                                    <th className="text-secondary">Sân</th>
                                    <th className="text-secondary">Thời gian</th>
                                    <th className="text-secondary">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {booking && booking.bookingDetails.map((detail) => (
                                    <tr key={detail.bookingDetailId}>
                                        <td>{detail.sportFieldDetail.name}</td>
                                        <td>{detail.startTime} - {detail.endTime}</td>
                                        <td>{detail.price.toLocaleString()} ₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {booking && (
                            <div>
                                <div className="text-secondary mb-2 fw-bold">Địa chỉ</div>
                                <b>{booking.sportFieldInfo?.address}</b>
                                <Table className="my-3">
                                    <thead>
                                        <tr>
                                            <th className="text-secondary">Tên chủ sân</th>
                                            <th className="text-secondary">Số điện thoại</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="title">{booking.owner?.user?.fullname}</td>
                                            <td>{booking.owner?.user?.addressUsers[0]?.phoneNumber}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        )}
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
