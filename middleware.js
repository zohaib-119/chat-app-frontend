import { NextResponse } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    console.log("Middleware running on:", pathname);

    const token = request.cookies.get('token')?.value || '';

    console.log('token', token)

    try {
        const response = await fetch(`${baseURL}/api/auth/check-auth`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            console.log("User is authenticated");
            // Redirect authenticated users away from landing/auth pages
            if (pathname === "/" || pathname === "/auth") {
                return NextResponse.redirect(new URL("/main", request.url));
            }
            return NextResponse.next();
        } else {
            console.log("User is not authenticated");
            // Allow unauthenticated users on landing and auth pages
            if (pathname === "/" || pathname === "/auth") {
                return NextResponse.next();
            }
            // Redirect unauthenticated users from protected routes to auth page
            return NextResponse.redirect(new URL("/auth", request.url));
        }
    } catch (error) {
        console.error("Auth check failed:", error.message);
        // Allow landing and auth pages on error
        if (pathname === "/" || pathname === "/auth") {
            return NextResponse.next();
        }
        // Redirect to auth on error for protected routes
        return NextResponse.redirect(new URL("/auth", request.url));
    }
}

export const config = {
    matcher: ["/", "/auth", "/main/:path*"],
};
