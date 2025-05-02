"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [payments, setPayment] = useState([]);

    const logout = async () => {
        try {
            const res = await fetch('/api/user/logout', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                setData([]);
                router.push('/');
            } else {
                console.error('Logout failed:', res.statusText);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/user/profile");
            setData([res.data.data.username, res.data.data.email, res.data.data._id]);
        } catch (error) {
            toast.error("Failed to get user details");
        }
    };

    const getPaymentDetails = async () => {
        try {
            const res = await axios.get("/api/paymentHistory");
            setPayment(res.data); // assuming res.data = { payments: [...] }
        } catch (error) {
            toast.error("Failed to get payment history");
        }
    };

    useEffect(() => {
        getUserDetails();
        getPaymentDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl p-8 text-white space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold">User Profile</h1>
                    <p className="text-gray-400 mt-2">Welcome to your personalized dashboard</p>
                </div>

                {/* User Info */}
                <div className="bg-gray-700 rounded-xl p-4 text-sm md:text-base">
                    <p className="mb-2">
                        <span className="font-semibold">Username:</span>{" "}
                        <Link href={`/profile/${data[0]}`} className="text-blue-400 hover:underline">{data[0]}</Link>
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold">Email:</span>{" "}
                        <Link href={`mailto:${data[1]}`} className="text-blue-400 hover:underline">{data[1]}</Link>
                    </p>
                    <p>
                        <span className="font-semibold">User ID:</span>{" "}
                        <span className="text-gray-300">{data[2]}</span>
                    </p>
                </div>

                {/* Payment History */}
                <div>
                    <h2 className="text-xl font-semibold scrollbar-hidden mb-4 border-b border-gray-600 pb-2">Payment History</h2>
                    {payments?.payments && payments.payments.length > 0 ? (
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            {payments.payments.map((payment, index) => (
                                <div key={index} className="bg-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition">
                                    <p><span className="font-medium">Amount:</span> ₹{payment.amount/100}</p>
                                    <p><span className="font-medium">Date:</span> {new Date(payment.createdAt).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Receipt:</span> {payment.receipt}</p>
                                    <p><span className="font-medium">Transaction ID:</span> {payment.razorpay_payment_id}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No payment history found.</p>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
