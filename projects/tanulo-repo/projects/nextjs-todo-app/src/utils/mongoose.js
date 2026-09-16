import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bnaxbue.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToDatabase;

//`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bnaxbue.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`
