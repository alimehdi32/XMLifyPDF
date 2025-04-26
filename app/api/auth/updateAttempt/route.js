import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/useModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const attempts = user.NoofConversion || 0; // Use NoofConversion, not attempts

    return NextResponse.json({ success: true, attempts }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
    try {
        const { email } = await req.json(); // ⬅️ get body from request

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { email: email },
            { $inc: { NoofConversion: 1 } },
            { new: true } // ⬅️ returns updated user
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "User attempts updated successfully", attempts: user.NoofConversion },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
