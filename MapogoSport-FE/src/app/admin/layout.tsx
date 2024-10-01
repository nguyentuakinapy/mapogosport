import AdminLayout from "@/components/Admin/AdminLayout"
import './globals.css'
import './adminStyle.scss';

export const metadata = {
    title: 'Admin'
}

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminLayout>{children}</AdminLayout>
    )
}
