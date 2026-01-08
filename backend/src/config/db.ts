import mongoose from 'mongoose';
import 'dotenv/config.js';

export default async function connect ()  {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
               console.log("Connected to MongoDB ✅");
    } catch (error) {
         console.log("Error connecting to MongoDB ❌");
    }
}

connect();
