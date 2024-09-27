import HomeLayout from "@/components/HomeLayout"

export const metadata = {
    title: 'Quản lý tài khoản'
}

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <HomeLayout>{children}</HomeLayout>
    )
}
