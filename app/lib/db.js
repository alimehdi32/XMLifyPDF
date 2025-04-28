import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const conversionSchema = new mongoose.Schema({
  email: String,
  pdfName: String,
  xmlContent: String,
  createdAt: { type: Date, default: Date.now },
});
export const Conversion = mongoose.models.Conversion || mongoose.model('Conversion', conversionSchema);
