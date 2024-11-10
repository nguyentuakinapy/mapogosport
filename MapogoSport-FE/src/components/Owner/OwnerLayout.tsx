'use client'
import React, { useEffect, useState } from "react";
import Nav from "./app.nav";
import '../globals.css'
import Header from "./app.header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from "@/app/context/UserContext";
import { vi } from "date-fns/locale/vi";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { usePathname } from "next/navigation";

registerLocale('vi', vi);
setDefaultLocale('vi');

export default function OwnerLayout({
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
                // navigator.geolocation.getCurrentPosition(
                //     (position) => {
                //         const { latitude, longitude } = position.coords;
                //         fetchWeather(latitude, longitude); // Cập nhật thời tiết
                //         // console.log(latitude + ' - ' + longitude);
                //         // console.log(navigator.geolocation)
                //     },
                //     (err) => {
                //         console.error('Error getting geolocation:', err);
                //     }
                // );
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude, accuracy } = position.coords;
                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
                        fetchWeather(latitude, longitude);
                    },
                    (err) => {
                        console.error('Error getting geolocation:', err);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        getLocationAndUpdateWeather();

        // Thiết lập interval để cập nhật thời tiết sau mỗi 5 phút (300000ms)
        const intervalId = setInterval(getLocationAndUpdateWeather, 300000); // 5 phút

        return () => clearInterval(intervalId);

    }, []);

    const [isAniActive, setIsAniActive] = useState(false);

    const toggleAni = () => {
        setIsAniActive(!isAniActive);
    }

    const [refreshKey, setRefreshKey] = useState<number>(0);


    return (
        <UserProvider refreshKey={refreshKey}>
            <Nav isAniActive={isAniActive} toggleAni={toggleAni} />
            <Header isAniActive={isAniActive} toggleAni={toggleAni} weather={weather} />

            <main className={`main-right ${isAniActive ? 'mainRight' : ''} pb-1 `}>
                <div className="main-body">
                    {children}
                </div>
            </main>
        </UserProvider>
    )
}