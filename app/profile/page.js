"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState([]);

    const logout = async () => {
        try {
            await axios.get("/api/user/logout");
            toast.success("Logout successful");
            router.push("/login");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/user/profile");
            console.log(res.data);
            setData([res.data.data.username, res.data.data.email, res.data.data._id]);
        } catch (error) {
            console.log("Error fetching user details:", error.message);
            toast.error("Failed to get user details");
        }
    };
   
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-semibold text-white">Profile</h1>
                <p className="text-gray-400 mt-2">Welcome to your profile page</p>
                <hr className="my-4 border-gray-600" />

                {/* User Data */}
                <h2 className="p-2 rounded-lg bg-green-600 text-white text-sm">
                    <Link href={`/profile/${data}`} className="hover:underline">{data[0]}</Link><br />
                   Email: <Link href={`/profile/${data}`} className="hover:underline">{data[1]}</Link><br />
                   Id: <Link href={`/profile/${data}`} className="hover:underline">{data[2]}</Link>
                </h2>

                {/* Buttons Section */}
                <div className="flex flex-col space-y-4 mt-6">
                    <button
                        onClick={getUserDetails}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Get User Details
                    </button>

                    <button
                        onClick={logout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
