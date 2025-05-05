import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/useModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        const userId = await getDataFromToken(request);

        // If token is missing or invalid, redirect to /login
        if (!userId) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const user = await User.findOne({ _id: userId }).select("-password");

        return NextResponse.json({
            mesaaage: "User found",
            data: user,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
