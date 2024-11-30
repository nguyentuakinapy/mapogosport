import { useData } from '@/app/context/UserContext';
import { Stomp } from '@stomp/stompjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { decodeString } from '../Utils/Format';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    isAniActive: boolean;
    toggleAni: () => void;
    weather: WeatherData | null;
}

const translations: { [key: string]: string } = {
    "clear sky": "trong lành",
    "few clouds": "ít mây",
    "scattered clouds": "mây rải rác",
    "broken clouds": "nhiều mây",
    "shower rain": "mưa rào",
    "rain": "mưa",
    "very heavy rain": "mưa rất to",
    "thunderstorm": "sấm sét",
    "thunderstorm with rain": "mưa có sấm sét",
    "thunderstorm with light rain": "mưa rào có sấm sét",
    "thunderstorm with heavy rain": "mưa to có sấm sét",
    "snow": "tuyết",
    "mist": "sương mù",
    "light rain": 'mưa nhẹ',
    "light intensity shower rain": 'mưa rào nhẹ',
    "moderate rain": 'mưa vừa',
    "overcast clouds": 'âm u'
};

export default function Header({ isAniActive, toggleAni, weather }: HeaderProps) {
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [hideNotification, setHideNotification] = useState<boolean>(false);
    const [notification, setNotification] = useState<NotificationUser[]>();
    const userData = useData();
    const [checkNotification, setCheckNotification] = useState<number>(1);
    const path = usePathname();

    useEffect(() => {
        if (userData) {
            getNotification(userData.username)
        }
    }, [userData, checkNotification]);

    const getNotification = async (username: string) => {
        const response = await fetch(`http://localhost:8080/rest/user/notification/${username}`);
        if (!response.ok) return

        const notification = await response.json() as NotificationUser[];
        // if (notification?.length >= 1) {
        setNotification(notification);
        // }
        // if (checkNotification && checkNotification != 1 || checkBooking && checkBooking != 1) {
        //     toast.success("Bạn vừa có thông báo mới!");
        // }
    }

    const translate = (word: string): string => {
        return translations[word.toLowerCase()] || word;
    };

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const optionsDate: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            const optionsTime: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const formattedDate = now.toLocaleDateString('vi-VN', optionsDate).replace(/\//g, '/') + ' ';
            const formattedTime = now.toLocaleTimeString('vi-VN', optionsTime);

            setCurrentDate(`${formattedDate}`);
            setCurrentTime(`${formattedTime}`);

        };
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws'); // Địa chỉ endpoint WebSocket
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/bookingDetail', (message) => {
                // toast.success(message.body)
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    toast.success("Bạn vừa có sân đặt mơí!")
                    setCheckNotification(prev => prev + 1);
                }
            });

            stompClient.subscribe('/topic/bookingDetail/notification', (message) => {
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    toast.success("Có sân cần chuẩn bị!")
                    setCheckNotification(prev => prev + 1);
                }
            });

            stompClient.subscribe('/topic/notification/username', (message) => {
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    toast.success("Bạn vừa có thông báo mới!");
                    setCheckNotification(prev => prev + 1);
                    getNotification(message.body);
                }
            });

            stompClient.subscribe('/topic/notification/isRead', (message) => {
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    setCheckNotification(prev => prev + 1);
                    getNotification(message.body);
                }
            });

            stompClient.subscribe('/topic/notification/isReadAll/username', (message) => {
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    setCheckNotification(prev => prev + 1);
                    getNotification(message.body);
                }
            });

            stompClient.subscribe('/topic/notification/delete/username', (message) => {
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    setCheckNotification(prev => prev + 1);
                    getNotification(message.body);
                }
            });

            stompClient.subscribe('/topic/order/new', (message) => {
                if (message.body === decodeString(String(localStorage.getItem('username')))) {
                    toast.success("Bạn vừa có đơn đặt hàng mơí!")
                    getNotification(message.body);
                }
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    const handleViewNotification = (username: string) => {
        fetch(`http://localhost:8080/rest/user/notification/${username}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return
            }
            // toast.success('Cập nhật thành công!');
        })
    }

    const handleIsReadNotification = (notificationId: number) => {
        fetch(`http://localhost:8080/rest/user/notification/is/read/${notificationId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return
            }
            // toast.success('Cập nhật thành công!');
        })
        // setHideNotification(!hideNotification);
    }

    const handleDeleteNotification = (username: string) => {
        fetch(`http://localhost:8080/rest/user/notification/${username}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return
            }
            // toast.success('Cập nhật thành công!');
        })
    }

    return (
        <header className={`${isAniActive ? 'header-full' : 'header-normal'}`}>
            <div className="d-flex m-0 justify-content-between align-items-center m-auto">
                <div className="d-flex justify-content-center align-items-center">
                    <i className={`bi ${isAniActive ? 'bi-list' : 'bi-filter-left'} mx-3`} onClick={() => {
                        toggleAni();
                    }} style={{ fontSize: '50px' }}></i>
                    <i className="bi bi-thermometer-half"></i>{weather?.main.temp}°C -
                    <i className="bi bi-moisture mx-1"></i>
                    {weather?.main.humidity}% -
                    {weather?.weather[0].description.toLowerCase() == 'clear sky' ? <i className="ms-2 me-1 bi bi-sun-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'few clouds' ? <i className="ms-2 me-1 bi bi-brightness-high-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'scattered clouds' ? <i className="ms-2 me-1 bi bi-cloud-sun-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'broken clouds' ? <i className="ms-2 me-1 bi bi-clouds-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'shower rain' ? <i className="ms-2 me-1 bi bi-cloud-rain-heavy-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'rain' ? <i className="ms-2 me-1 bi bi-cloud-hail-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'very heavy rain' ? <i className="ms-2 me-1 bi bi-cloud-hail-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'thunderstorm' ? <i className="ms-2 me-1 bi bi-cloud-lightning-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'thunderstorm with rain' ? <i className="ms-2 me-1 bi bi-cloud-lightning-rain-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'thunderstorm with light rain' ? <i className="ms-2 me-1 bi bi-cloud-lightning-rain-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'snow' ? <i className="ms-2 me-1 bi bi-cloud-snow-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'mist' ? <i className="ms-2 me-1 bi bi-cloud-fog2-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'light rain' ? <i className="ms-2 me-1 bi bi-cloud-drizzle-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'light intensity shower rain' ? <i className="ms-2 me-1 bi bi-cloud-drizzle-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'moderate rain' ? <i className="ms-2 me-1 bi bi-cloud-drizzle-fill"></i> : ''}
                    {weather?.weather[0].description.toLowerCase() == 'overcast clouds' ? <i className="ms-2 me-1 bi bi-cloud-fill"></i> : ''}
                    Thời tiết {translate(weather == null ? '' : weather?.weather[0].description)}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <span id="clock"><i className="bi bi-calendar2-range-fill me-1"></i>{currentDate} <i className="bi bi-alarm-fill ms-2"></i> {currentTime}</span>
                </div>
                <div className=" d-flex justify-content-center align-items-center">
                    <nav className="navbar navbar-expand-lg p-0">
                        <ul className="navbar-nav d-flex align-items-center">
                            <li className="nav-item me-2 ">
                                <a href="" className="nav-link"><i className="bi bi-chat-left" style={{ fontSize: 'large' }}></i></a>
                            </li>
                            <li className="nav-item me-3" >
                                <a onClick={() => setHideNotification(!hideNotification)} className="nav-link">
                                    <i className="bi bi-bell" style={{ fontSize: 'large' }}></i>
                                </a>
                                <span onClick={() => setHideNotification(!hideNotification)} style={{ top: '12%', left: '85%', fontSize: '10px' }}
                                    className="position-absolute translate-middle badge rounded-pill bg-danger">
                                    {notification ? notification.filter(item => item.isRead === false).length : 0}
                                </span>
                                <div className={`notification ${hideNotification ? 'd-block' : 'd-none'}`} >
                                    <div className="d-flex align-items-center">
                                        <h4 className='fw-bold text-danger'>Thông báo</h4>
                                        <i onClick={() => {
                                            userData && handleDeleteNotification(userData.username)
                                        }} style={{ cursor: 'pointer', fontSize: '28px' }} className="ms-auto bi bi-trash3-fill"></i>
                                    </div>
                                    <button onClick={() => {
                                        userData && handleViewNotification(userData.username)
                                    }} style={{ backgroundColor: '#142239' }} className='btn w-100 ms-auto mb-2'>Đánh dấu tất cả là đã đọc</button>

                                    {notification && notification?.length > 0 ?
                                        notification.sort((a, b) => b.notificationId - a.notificationId).map(item => {
                                            return (
                                                <>
                                                    <div className="box-comment-container mb-2"
                                                        style={{
                                                            backgroundColor: item.isRead ? '#f5f5f5' : '#142239'
                                                        }}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <Link
                                                                onClick={() => handleIsReadNotification(item.notificationId)}
                                                                href={`${path.includes("owner") && item.bookingId ? `/owner/booking-bill/detail/${item.bookingId}`
                                                                    : item.orderId ? `/admin/order/${item.orderId}` : ''}`}
                                                                className="box-comment" style={{
                                                                    fontSize: '15px',
                                                                    color: item.isRead ? 'black' : undefined
                                                                }}>
                                                                <b>{item.type === "notifyMess" ?
                                                                    item.title.split('từ')[0] : item.title
                                                                }</b>
                                                                <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                                                                    <div className=''>{item.message}</div>
                                                                    <div className='ms-auto'>{new Date(item.createdAt).toLocaleDateString()}</div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                        :
                                        <div className='my-5 text-center'>
                                            <b >BẠN CHƯA CÓ THÔNG BÁO NÀO</b>
                                        </div>
                                    }
                                </div>
                            </li>
                            <span style={{ borderLeft: '1px solid' }} className='text-decoration-none demo me-3'>
                                <div className="img ms-2 shadow" style={{ backgroundImage: `url(${userData?.avatar ? userData.avatar : ''})` }}></div>{userData?.fullname}
                            </span>
                        </ul>
                    </nav>
                </div>
            </div>
        </header >
    )
}