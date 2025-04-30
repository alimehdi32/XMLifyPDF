import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import { Payment } from '../../../lib/payment'; 

export async function POST(req) {
  const body = await req.json();

  // 1. Get token from cookies
  const token = req.cookies.get("token")?.value; // if using Next.js App Router
  if (!token) {
    return Response.json({ error: "Unauthorized. No token." }, { status: 401 });
  }

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  if (!decoded) {
    return Response.json({ error: "Unauthorized. Invalid token." }, { status: 401 });
  }

  const email = decoded.email; // 🛡️ now you have user's email securely

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: body.amount * 100, // amount in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await instance.orders.create(options);
    console.log("Razorpay Order Created:", order);
    const newPayment = new Payment({ email: email, razorpay_payment_id: order.id, receipt: order.receipt, currency: order.currency, amount: order.amount });
    // Save the payment details to the database
    await newPayment.save();
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create Razorpay order" }), {
      status: 500,
    });
  }
}
