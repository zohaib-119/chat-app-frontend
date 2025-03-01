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
            // there is data.user
            if (pathname === "/") {
                return NextResponse.redirect(new URL("/main", request.url));
            }
            return NextResponse.next();
        } else {
            console.log("User is not authenticated");
            if (pathname !== "/") {
                return NextResponse.redirect(new URL("/", request.url));
            }
            return NextResponse.next();
        }
    } catch (error) {
        console.error("Auth check failed:", error.message);
        if (pathname !== "/") {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/", "/main/:path*"],
};
