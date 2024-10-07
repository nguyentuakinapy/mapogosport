import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
interface HeaderProps {
    isAniActive: boolean;
    toggleAni: () => void;
    weather: WeatherData | null;
    userData: User | null;
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
    "snow": "tuyết",
    "mist": "sương mù",
    "light rain": 'mưa nhẹ',
    "light intensity shower rain": 'mưa rào nhẹ',
    "moderate rain": 'mưa vừa',
    "overcast clouds": 'âm u'
};

export default function Header({ isAniActive, toggleAni, weather, userData }: HeaderProps) {
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

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



    return (
        <header className={`${isAniActive ? 'aniHead' : ''} 
        `}>
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
                    <em id="clock"><i className="bi bi-calendar2-range-fill me-1"></i>{currentDate} <i className="bi bi-alarm-fill ms-2"></i> {currentTime}</em>
                </div>
                <div className=" d-flex justify-content-center align-items-center">
                    <nav className="navbar navbar-expand-lg p-0">
                        <ul className="navbar-nav d-flex align-items-center">
                            <li className="nav-item me-2 ">
                                <a href="" className="nav-link"><i className="bi bi-chat-left" style={{ fontSize: 'large' }}></i></a>
                            </li>
                            <li className="nav-item me-2 ">
                                <a href="" className="nav-link"><i className="bi bi-bell" style={{ fontSize: 'large' }}></i></a>
                            </li>
                            {/* <li className="nav-item dropdown" style={{ borderLeft: '1px solid' }}>
                                <a href="#" className="nav-link d-flex align-items-center me-4" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="img" style={{ backgroundImage: 'url()' }}></div>
                                    <span>Nguyễn Tú</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Profile</a></li>
                                    <li><a className="dropdown-item" href="#"><i
                                        className="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                                </ul>
                            </li> */}
                            <span style={{ borderLeft: '1px solid' }} className='text-decoration-none demo me-3'><i className="bi bi-person-fill ms-3 me-1"></i>{userData?.fullname}</span>
                        </ul>
                    </nav>
                </div>
            </div>
        </header >
    )
}