import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Pool (Placeholder for now, uses env vars)
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Routes
app.get('/', (req, res) => {
    res.send('Financa ERP API is running');
});

app.get('/api/health', async (req, res) => {
    try {
        // Optional: Check DB connection
        // const client = await pool.connect();
        // client.release();
        res.json({ status: 'ok', database: 'disconnected (configure .env)' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
