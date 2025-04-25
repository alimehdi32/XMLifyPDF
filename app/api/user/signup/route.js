import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/useModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const username = reqBody.username.trim();
        const email = reqBody.email.trim().toLowerCase();
        const password = reqBody.password;


        if (!username || !email || !password) {
            return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
        }
        console.log("Validation passed");

        if (!email.includes("@")) {
            return NextResponse.json({ error: "Please provide a valid email" }, { status: 400 });
        }
        console.log("Email validation passed");
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        console.log(newUser)
        // Save the new user to the database
        let savedUser;
        try {
            savedUser = await newUser.save();
            console.log("User saved:", savedUser);
        } catch (err) {
            console.error("Error saving user:", err);
        }
        if (!savedUser) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }
        console.log("User created successfully:", savedUser);
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
