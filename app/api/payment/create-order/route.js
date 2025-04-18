import Razorpay from 'razorpay';

export async function POST(req) {
  const body = await req.json();

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
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create Razorpay order" }), {
      status: 500,
    });
  }
}
