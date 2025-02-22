import { NextResponse } from "next/server";

export async function middleware(request) {
    // const { pathname } = request.nextUrl;

    // console.log("Middleware running on:", pathname);

    // try {
    //     const response = await fetch("http://localhost:5000/api/auth/check-auth", {
    //         method: "GET",
    //         headers: {
    //             Cookie: request.headers.get("cookie") || "",
    //         },
    //         credentials: "include",
    //     });

    //     const data = await response.json();

    //     if (data.success) {
    //         console.log("User is authenticated");
    //         // there is data.user
    //         if (pathname === "/") {
    //             return NextResponse.redirect(new URL("/chats", request.url));
    //         }
    //         return NextResponse.next();
    //     } else {
    //         console.log("User is not authenticated");
    //         if (pathname !== "/") {
    //             return NextResponse.redirect(new URL("/", request.url));
    //         }
            return NextResponse.next();
    //     }
    // } catch (error) {
    //     console.error("Auth check failed:", error.message);
    //     if (pathname !== "/") {
    //         return NextResponse.redirect(new URL("/", request.url));
    //     }
    //    return NextResponse.next();
    // }
}

export const config = {
    matcher: ["/", "/chats"],
};
