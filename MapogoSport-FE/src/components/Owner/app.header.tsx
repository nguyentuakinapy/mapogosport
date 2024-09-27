import { useEffect, useState } from 'react';

export default function Header() {
    const [currentDateTime, setCurrentDateTime] = useState('');
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

            setCurrentDateTime(`${formattedDate} - ${formattedTime}`);
        };
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header>
            <div className="row m-0 justify-content-between align-items-center">
                <div className="col-4 d-flex justify-content-center align-items-center">
                    <form className="d-flex search" role="search">
                        <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit"><i className="bi bi-search"></i></button>
                    </form>
                </div>
                <div className="col-4 d-flex justify-content-center align-items-center">
                    <em id="clock">{currentDateTime}</em>
                </div>
                <div className="col-4 d-flex justify-content-center align-items-center">
                    <nav className="navbar navbar-expand-lg p-0">
                        <ul className="navbar-nav d-flex align-items-center">
                            <li className="nav-item me-2 ">
                                <a href="" className="nav-link"><i className="bi bi-bell" style={{ fontSize: 'large' }}></i></a>
                            </li>
                            <li className="nav-item dropdown" style={{ borderLeft: '1px solid' }}>
                                <a href="#" className="nav-link d-flex align-items-center" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="img" style={{ backgroundImage: 'url()' }}></div>
                                    <span>Nguyễn Tú</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Profile</a></li>
                                    <li><a className="dropdown-item" href="#"><i
                                        className="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}