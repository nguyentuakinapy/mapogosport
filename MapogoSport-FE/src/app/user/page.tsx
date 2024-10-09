'use client'
import { ReactNode } from 'react'
import './types/user.scss'
import UserLayout from '@/components/User/UserLayout'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-web">
            <UserLayout>
                {children}
            </UserLayout>
        </div>
    )
}
