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
    const sessionDataAuth = request.cookies.get('sessionDataAuth')?.value; // Get the cookie
    const pathname = request.nextUrl.pathname;

    const privatePaths = ['/admin', '/owner', '/user/profile'];

    const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path));

    // Redirect if no session data is found and the path is private
    if (isPrivatePath && !sessionDataAuth) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('notLoggedIn', 'true');
        return NextResponse.redirect(loginUrl);
    }

    // if (sessionDataAuth) {
    //     let sessionData: SessionData | null = null;

    //     try {
    //         sessionData = JSON.parse(sessionDataAuth) as SessionData;
    //     } catch (error) {
    //         console.error("Failed to parse sessionDataAuth:", error);
    //         return NextResponse.next();
    //     }

    //     if (sessionData && sessionData.authorities) {
    //         const hasAdminRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_ADMIN");
    //         const hasOwnerRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_OWNER");
    //         const hasStaffRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_STAFF");
    //         const hasUserRole = sessionData.authorities.some((auth) => auth.role.name === "ROLE_USER");
    //         // If the user is an ADMIN, they should not be allowed to access /owner
    //         if (hasAdminRole && pathname.startsWith('/owner')) {
    //             const noRightsUrl = new URL('/', request.url);
    //             noRightsUrl.searchParams.set('noRights', 'true');
    //             return NextResponse.redirect(noRightsUrl);
    //         }

    //         // If the user is an OWNER, they should not be allowed to access /admin
    //         if (hasOwnerRole && pathname.startsWith('/admin')) {
    //             const noRightsUrl = new URL('/', request.url);
    //             noRightsUrl.searchParams.set('noRights', 'true');
    //             return NextResponse.redirect(noRightsUrl);
    //         }

    //         if(hasStaffRole && pathname.startsWith('/owner')){
    //             const noRightsUrl = new URL('/', request.url);
    //             noRightsUrl.searchParams.set('noRights', 'true');
    //             return NextResponse.redirect(noRightsUrl);
    //         }
    //           // Nếu người dùng chỉ có ROLE_USER và cố truy cập đường dẫn riêng tư
    //           if (hasUserRole && isPrivatePath) {
    //             const noRightsUrl = new URL('/', request.url);
    //             noRightsUrl.searchParams.set('noRights', 'true');
    //             return NextResponse.redirect(noRightsUrl);
    //         }

    //         // Allow access if conditions pass
    //         return NextResponse.next();
    //     } else {
    //         console.error("Invalid sessionData structure:", sessionData);
    //     }
    // }

    return NextResponse.next();
}
