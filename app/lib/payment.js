import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const paymentSchema = new mongoose.Schema({
  email: String,
  razorpay_payment_id: String,
  receipt: String,
  currency: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);