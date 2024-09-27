import AdminLayout from "@/components/Admin/AdminLayout"
import './globals.css'

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
