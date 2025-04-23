import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value; // Assuming JWT token is stored in cookies
    console.log(token); // Log the token for debugging
    console.log(req.nextUrl.pathname); // Log the requested path for debugging
    // Check if the user is trying to access /profile but is not logged in
    if (!token && req.nextUrl.pathname.startsWith("/profile")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// Define the paths where middleware should run
export const config = {
    matcher: ["/profile/:path*"], // Apply middleware to profile routes
};
// This middleware checks if the user is logged in by verifying the presence of a JWT token in cookies. If the token is not present and the user tries to access the profile page, they are redirected to the login page.