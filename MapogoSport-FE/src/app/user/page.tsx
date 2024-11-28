'use client';
import { useEffect, useState } from 'react';
import UserLayout from '@/components/User/UserLayout';
import './types/user.scss';
import ProfileContent from '@/components/User/modal/user.profile';
import { useData } from '../context/UserContext';

export default function RootLayout() {
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');
    const user = useData();
    useEffect(() => {
        if (user) {
            setUsernameFetchApi(`http://localhost:8080/rest/user/${user.username}`);
        }
    }, [user]);

    return (
        <UserLayout>
            <div className='mb-3 text-danger' style={{ fontSize: '20px' }}>
                <b>Thông tin cá nhân</b>
            </div>
            {usernameFetchApi && <ProfileContent usernameFetchApi={usernameFetchApi} />}
        </UserLayout>
    );
}