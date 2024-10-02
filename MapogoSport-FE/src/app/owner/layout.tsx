import OwnerLayout from "@/components/Owner/OwnerLayout"
import './owner.scss'

export const metadata = {
    title: 'Chủ sân'
}

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <OwnerLayout>{children}</OwnerLayout>
    )
}
