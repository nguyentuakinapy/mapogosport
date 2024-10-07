'use client'
import { usePathname } from 'next/navigation';
import '../types/user.scss'
import useLocalStorage from "../useLocalStorage";
import SidebarItem from "./SideBarItem";
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const menuGroups = [
    {
        menuItems: [
            {
                label: "Quản lý tài khoản",
                route: "#",
                children: [
                    { label: "Thông tin tài khoản", route: "/user/profile" },
                    { label: "Địa chỉ", route: "/user/address" },
                    { label: "Đơn hàng của bạn", route: "/user/orders" },
                    { label: "Danh sách đặt sân", route: "/user/bookings" },
                ],
            },
            {
                label: "Yêu thích và voucher",
                route: "#",
                children: [
                    { label: "Sân yêu thích", route: "/user/wishlist/sportfield" },
                    { label: "Sản phẩm yêu thích", route: "/user/wishlist/product" },
                    { label: "Bình luận và đánh giá", route: "/user/wishlist/comment" },
                    { label: "Phiếu giảm giá", route: "/user/coupon" }
                ],
            }
        ],
    },
];

const Sidebar = () => {
    const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
    const pathname = usePathname();

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>("");
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/${parsedUserData.username}`)
        }
    }, [])
    const { data, error, isLoading } = useSWR(
        usernameFetchApi, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    );
    // const { data, error, isLoading } = useSWR(
    //     "http://localhost:8080/rest/user/hungnpps30910", fetcher, {
    //     revalidateIfStale: false,
    //     revalidateOnFocus: false,
    //     revalidateOnReconnect: false
    // }
    // );

    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const activeItem = menuGroups.flatMap(group => group.menuItems)
            .find(menuItem => menuItem.route === pathname || menuItem.children?.some(child => child.route === pathname));

        if (activeItem) {
            setPageName(activeItem.label.toLowerCase());
        }
    }, [pathname, setPageName]);
    useEffect(() => {
        if (data) {
            setName(data.fullname || '');
            setAvatar(data.image ? data.image : 'avatar-init.gif');
        }
    }, [data]);

    return (
        <div className="menu-user">
            <div className="text-center">
                <div className="avatar-upload">
                    <div className="avatar-edit">
                        <input type="file" name="avatar" id="imageUpload"
                            accept="image/jpeg, image/png" style={{ display: 'none' }} />
                        <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                    </div>

                    <div className="avatar-preview">
                        <div style={{ backgroundImage: `url("/images/${avatar}")` }}></div>
                    </div>
                </div>
                <div className="text-dark fw-bold mb-3">{name}</div>
            </div>
            {/* Sidebar Menu */}
            {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                    {group.menuItems.map((menuItem, menuIndex) => (
                        <SidebarItem
                            key={menuIndex}
                            item={menuItem}
                            pageName={pageName}
                            setPageName={setPageName}
                        />
                    ))}
                </div>
            ))}
            {/* Sidebar Menu */}
        </div>
    );
}

export default Sidebar;