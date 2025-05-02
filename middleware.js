import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;

    console.log("Token in middleware:", token);
    console.log("Requested path:", req.nextUrl.pathname);

    const isProtectedRoute = req.nextUrl.pathname.startsWith("/profile");

    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname); // Optional: add redirect back
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile/:path*"], // You can also add other protected routes here
};
