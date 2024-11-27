import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface Role {
    name: string;
}

interface Authority {
    role: Role;
}

interface SessionData {
    username: string;
    authorities: Authority[];
}

export function middleware(request: NextRequest) {
    const sessionDataAuth = request.cookies.get('sessionDataAuth')?.value; // Lấy cookie
    const pathname = request.nextUrl.pathname;

    const privatePaths = ['/admin', '/owner', '/user/profile'];

    const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path));

    // Kiểm tra nếu không có session và đường dẫn là riêng tư
    if (isPrivatePath && !sessionDataAuth) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('notLoggedIn', 'true');
        return NextResponse.redirect(loginUrl);
    }

    if (sessionDataAuth) {
        let sessionData: SessionData | null = null;

        try {
            sessionData = JSON.parse(sessionDataAuth) as SessionData;
        } catch (error) {
            console.error("Failed to parse sessionDataAuth:", error);
            return NextResponse.next();
        }

        if (sessionData && sessionData.authorities) {
            const hasAdminRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_ADMIN");
            const hasOwnerRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_OWNER");
            const hasStaffRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_STAFF");
            const hasUserRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_USER");

            // Logic ngăn cản truy cập trái phép
            // Ngăn người dùng ROLE_ADMIN vào `/owner`
            if (hasAdminRole && pathname.startsWith('/owner')) {
                const noRightsUrl = new URL('/', request.url);
                noRightsUrl.searchParams.set('noRights', 'true');
                return NextResponse.redirect(noRightsUrl);
            }

            // Ngăn người dùng ROLE_OWNER vào `/admin`
            if (hasOwnerRole && pathname.startsWith('/admin')) {
                const noRightsUrl = new URL('/', request.url);
                noRightsUrl.searchParams.set('noRights', 'true');
                return NextResponse.redirect(noRightsUrl);
            }

            // Ngăn người dùng ROLE_STAFF vào `/owner`
            if (hasStaffRole && pathname.startsWith('/owner')) {
                const noRightsUrl = new URL('/', request.url);
                noRightsUrl.searchParams.set('noRights', 'true');
                return NextResponse.redirect(noRightsUrl);
            }

            // Chỉ có ROLE_USER nhưng cố truy cập các đường dẫn riêng tư
            if (hasUserRole && !hasAdminRole && !hasOwnerRole && !hasStaffRole && isPrivatePath) {
                const noRightsUrl = new URL('/', request.url);
                noRightsUrl.searchParams.set('noRights', 'true');
                return NextResponse.redirect(noRightsUrl);
            }

            // Cho phép ROLE_OWNER vào `/owner`
            if (hasOwnerRole && pathname.startsWith('/owner')) {
                return NextResponse.next();
            }

            // Cho phép ROLE_ADMIN vào `/admin`
            if (hasAdminRole && pathname.startsWith('/admin')) {
                return NextResponse.next();
            }

            // Cho phép ROLE_STAFF vào đường dẫn tương thích nếu cần
        } else {
            console.error("Invalid sessionData structure:", sessionData);
        }
    }

    return NextResponse.next();
}
