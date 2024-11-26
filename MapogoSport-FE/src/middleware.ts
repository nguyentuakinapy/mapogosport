import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionDataAuth = request.cookies.get('sessionDataAuth')?.value; // Get the cookie
    const pathname = request.nextUrl.pathname;

    // List of protected paths requiring authentication
    const privatePaths = [
        '/admin',
        '/owner',
    ];

    // Check if the current path matches any private paths
    const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path));

    if (isPrivatePath && !sessionDataAuth) {
        // Redirect to home with query parameter if not authenticated
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('notLoggedIn', 'true');
        return NextResponse.redirect(loginUrl);
    }

    // Allow access if authenticated or on a public path
    return NextResponse.next();
}
