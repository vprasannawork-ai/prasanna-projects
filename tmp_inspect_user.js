import 'dotenv/config';
import mongoose from 'mongoose';
import User from './backend/user.js';

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fake_news_portal';

(async () => {
  await mongoose.connect(mongoUri);
  const user = await User.findOne({ email: process.argv[2] });
  console.log('found user:', user && user.toObject());
  await mongoose.disconnect();
})();
