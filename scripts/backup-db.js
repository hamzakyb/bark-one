import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

async function backup() {
    console.log('Connecting to old MongoDB to check for existing data...');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB!');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log(`Found ${collections.length} collections:`, collections.map(c => c.name));

        const backupData = {};

        for (const col of collections) {
            const name = col.name;
            const documents = await db.collection(name).find({}).toArray();
            console.log(`Collection "${name}" has ${documents.length} documents.`);
            backupData[name] = documents;
        }

        const backupPath = path.join(__dirname, 'backup-data.json');
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
        console.log(`Backup completed successfully! Saved to: ${backupPath}`);
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Backup failed:', error);
    }
}

backup();
