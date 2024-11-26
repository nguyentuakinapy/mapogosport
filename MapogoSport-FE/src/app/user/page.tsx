'use client';
import { useEffect, useState } from 'react';
import UserLayout from '@/components/User/UserLayout';
import './types/user.scss';
import ProfileContent from '@/components/User/modal/user.profile';

export default function RootLayout() {
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setUsernameFetchApi(`http://localhost:8080/rest/user/${username}`);
        }
    }, []);

    return (
        <UserLayout>
            <div className='mb-3 text-danger' style={{ fontSize: '20px' }}>
                <b>Thông tin cá nhân</b>
            </div>
            {usernameFetchApi && <ProfileContent usernameFetchApi={usernameFetchApi} />}
        </UserLayout>
    );
}