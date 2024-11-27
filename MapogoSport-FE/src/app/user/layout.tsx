import HomeLayout from "@/components/HomeLayout"
import { ReactNode } from "react"

export const metadata = {
    title: 'Quản lý tài khoản'
}

export default function Layout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <HomeLayout>{children}</HomeLayout>
    )
}
