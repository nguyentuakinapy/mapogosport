'use client';
import { Suspense } from 'react';
import UserLayout from '@/components/User/UserLayout';
import './types/user.scss';
import ProfileContent from '@/components/User/modal/user.profile';
import { useData } from '../context/UserContext';

export default function RootLayout() {
    const user = useData();

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UserLayout>
                <div className='title-header' style={{ fontSize: '20px' }}>Thông tin cá nhân</div>
                {user && <ProfileContent user={user} />}
            </UserLayout>
        </Suspense>
    );
}