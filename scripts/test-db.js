import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    console.log('Testing connection to:', MONGODB_URI?.replace(/:([^@]+)@/, ':****@'));
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
