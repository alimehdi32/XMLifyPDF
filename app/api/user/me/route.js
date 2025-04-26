import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ isLoggedIn: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.json({ isLoggedIn: true, user: decoded });
    } catch (error) {
        return NextResponse.json({ isLoggedIn: false });
    }
}
