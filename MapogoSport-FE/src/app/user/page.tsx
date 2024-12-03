'use client';
import { Suspense } from 'react';
import UserLayout from '@/components/User/UserLayout';
import './types/user.scss';
import ProfileContent from '@/components/User/modal/user.profile';
import { useData } from '../context/UserContext';
import Loading from '@/components/loading';

export default function RootLayout() {
    const user = useData();

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UserLayout>
                <div className='title-header' style={{ fontSize: '20px' }}>Thông tin cá nhân</div>
                {!user ? 
                  <div className="d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
                        <Loading></Loading>
                  </div> : <ProfileContent user={user} />}
            </UserLayout>
        </Suspense>
    );
}