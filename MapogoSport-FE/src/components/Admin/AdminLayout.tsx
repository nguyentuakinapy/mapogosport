'use client'
import React, { useEffect, useState } from "react";
import Nav from "./app.nav";
import '../globals.css'
import Header from "./app.header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const apiKey = '767451e95917fe713995435a49beb32a'; // Đặt API key ngoài để dễ quản lý

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );
                const data = await response.json();

                if (response.ok) {
                    setWeather(data);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        const getLocationAndUpdateWeather = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeather(latitude, longitude); // Cập nhật thời tiết
                        // console.log(latitude + '-' + longitude);
                        // console.log(navigator.geolocation)
                    },
                    (err) => {
                        console.error('Error getting geolocation:', err);
                    }
                );
            }
        };

        getLocationAndUpdateWeather();

        // Thiết lập interval để cập nhật thời tiết sau mỗi 5 phút (300000ms)
        const intervalId = setInterval(getLocationAndUpdateWeather, 300000); // 5 phút

        return () => clearInterval(intervalId);

    }, []);


    const [isAniActive, setIsAniActive] = useState(false);
    const [isActive, setIsActiveNumber] = useState<number>(1);

    const toggleAni = () => {
        setIsAniActive(!isAniActive);
    }

    const setIsActive = (index: number) => {
        setIsActiveNumber(index);
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeIndexAdmin', index.toString());
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedActiveIndex = localStorage.getItem('activeIndexAdmin');
            if (savedActiveIndex) {
                setIsActiveNumber(Number(savedActiveIndex));
            }
        }
    }, []);
    return (
        <>
            <Nav isAniActive={isAniActive} toggleAni={toggleAni} isActive={isActive} setIsActive={setIsActive} />
            <Header isAniActive={isAniActive} toggleAni={toggleAni} weather={weather} />
            <main className={`main-right ${isAniActive ? 'mainRight' : ''}`}>
                <div className="main-body">
                    {children}
                </div>
            </main>
            <ToastContainer></ToastContainer>
        </>
    )
}