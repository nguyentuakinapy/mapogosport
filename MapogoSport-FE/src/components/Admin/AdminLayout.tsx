'use client'
import React, { useEffect, useState } from "react";
import Nav from "./app.nav";
import './admin.scss'
import Header from "./app.header";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactQueryProvider from "@/app/utils/UseQueryProviders/ReactQueryProvider";
import { vi } from "date-fns/locale/vi";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { UserProvider } from "@/app/context/UserContext";
import ChatMessenger from '@/components/app.chatMessenger';

registerLocale('vi', vi);
setDefaultLocale('vi');


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


    const [isAniActive, setIsAniActive] = useState<boolean>(true);

    const toggleAni = () => {
        setIsAniActive(!isAniActive);
        sessionStorage.setItem("isAniActive", JSON.stringify(!isAniActive));
    }

    useEffect(() => {
        const isAniActive = sessionStorage.getItem("isAniActive");
        if (isAniActive) {
            setIsAniActive(JSON.parse(isAniActive));
        }
    }, []);

    return (
        <UserProvider refreshKey={1}>
            <ReactQueryProvider>
                <Nav isAniActive={isAniActive} toggleAni={toggleAni} />
                <Header isAniActive={isAniActive} toggleAni={toggleAni} weather={weather} />
                <main className={`${isAniActive ? 'main-right-full' : 'main-right-normal'}  pb-1 `}>
                    <div className="main-body">
                        {children}
                    </div>
                </main>
                <ChatMessenger ></ChatMessenger>
            </ReactQueryProvider>
        </UserProvider>
    )
}