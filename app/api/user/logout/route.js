import { NextResponse } from "next/server";


export async function GET() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout successful",
                success: true,
            }
        )
        response.cookies.set("token", " ", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Required for HTTPS
            sameSite: 'lax', // or 'none' if using cross-site
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        })
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
        
    }