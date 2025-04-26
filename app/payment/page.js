"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import {useRouter} from "next/navigation";
import { setCookie } from 'cookies-next'; // (for client side)
import { Toaster, toast } from "react-hot-toast";

const PaymentPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("Customer");
  const [email, setEmail] = useState("customer@gmail.com");

  const router = useRouter(); // ✅ Hook usage

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchCredentials = async () => {
    try {
      const res = await fetch("/api/auth/credential", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsername(data.username);
        setEmail(data.email);
        console.log("Fetched credentials:", data);
      } else if (res.status === 401) {
        console.error("User not authenticated:", data.error);
        router.push("/login"); // Redirect to login page if not authenticated
      } else {
        console.error("Failed to fetch credentials:", data.error);
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  }
  
  const handlePayment = async (e) => {
    e.preventDefault();

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    // Create order on server
    const orderData = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 10 }), // ₹10 in rupees
    }).then((res) => res.json());

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "XMLifyPDF", // change this
      description: "Payment for services",
      order_id: orderData.id,
      handler: async function (response) {
        // You can verify payment here by sending `response` to your backend
       /* alert("Payment successful!");
        console.log(response);
        const paymentData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        const res = await fetch("/api/payment/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          console.log("Payment verified:", data);
          alert("Payment verified successfully!");
          router.push("/success"); // Redirect to success page
        } else {
          console.error("Payment verification failed:", data.error);
          alert("Payment verification failed. Please try again.");
        }*/
          toast.success("🎉 Payment Successful!");
          setCookie('paymentDone', 'true', { maxAge: 60 * 10 }); // valid for 10 mins
        router.push("/")
      },
      prefill: {
        name: username,
        email: email,
        contact: "9999999999",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const fadeSlide = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e0c3fc] via-[#8ec5fc] to-[#d9afd9] overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background Gradient Blobs */}
      <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] bg-pink-300 rounded-full opacity-30 blur-[100px] z-0"></div>
      <div className="absolute bottom-[-100px] right-[-80px] w-[300px] h-[300px] bg-indigo-300 rounded-full opacity-30 blur-[100px] z-0"></div>

      {/* Payment Card Content */}
      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-3xl shadow-2xl transition-all duration-500">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Ready to Make Payment?
              </h2>
              <p className="text-center text-gray-600 text-lg mb-6">
                Securely complete your payment with a single click.
              </p>
              <button
               onClick={async (e) => {
                await fetchCredentials();
                await handlePayment(e);
              }}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-indigo-700 transform transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
              >
                <span className="block">Click to Pay ₹499</span>
              </button>
              <button
                type="button"
                onClick={() => {setStep(1); router.push("/");}}
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                <FaArrowLeft /> Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentPage;
