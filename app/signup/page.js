"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const { username, email, password } = user;
    

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState("");

    const userCheck = async (username) => {
        try {
            const response = await axios.post("/api/user/check", { username });
            if (response.data.exists) {
                setUsernameError("Username already exists");
                setButtonDisabled(true);
            } else {
                setUsernameError("");
                setButtonDisabled(!(user.email && user.password)); // Enable if other fields filled
            }
        } catch (error) {
            console.log("User check failed", error.message);
            toast.error("Failed to validate username");
        }
    };

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/user/signup", user);
            console.log("Signup success", response.data);
            toast.success("Signup successful!");
            router.push("/login");
        } catch (error) {
            console.log("Signup failed", error.message);
            toast.error(error.response?.data?.error || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isIncomplete = !username || !email || !password || usernameError !== "";
        setButtonDisabled(isIncomplete);
    }, [username, email, password, usernameError]);
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-center text-white mb-6">
                    {loading ? "Processing..." : "Signup"}
                </h1>
                <hr className="mb-4 border-gray-600" />

                {/* Username Field */}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-300 font-medium">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={(e) => {
                            const newUsername = e.target.value;
                            setUser({ ...user, username: newUsername });
                            setUsernameError("");
                        }}
                        onBlur={() => userCheck(user.username)}
                        placeholder="Enter username"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {usernameError && (
                        <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                    )}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-300 font-medium">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Enter email"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password Field */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-300 font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Signup Button */}
                <button
                    onClick={onSignup}
                    disabled={buttonDisabled}
                    className={`w-full py-2 font-semibold rounded-lg transition ${
                        buttonDisabled
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 border-2 border-white rounded-full border-t-transparent" viewBox="0 0 24 24"></svg>
                            Signing up...
                        </div>
                    ) : (
                        "Signup"
                    )}
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-400 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
