import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { logActivity } from '../utils/activityLogger.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // preserve extension
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${uuidv4()}${ext}`);
    }
});

export const upload = multer({ storage });

export const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { uploadedBy } = req.body;
        const id = uuidv4();
        const name = req.file.originalname;
        const type = req.file.mimetype;
        const size = formatBytes(req.file.size);
        const filePath = req.file.filename; // Store relative filename

        const sql = `INSERT INTO documents (id, name, type, size, path, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(sql, [id, name, type, size, filePath, uploadedBy || 'Admin'], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // --- LOG ACTIVITY ---
            logActivity(req, `Uploaded file: ${name}`, 'Documents');

            res.status(201).json({
                id,
                name,
                type,
                size,
                uploadedBy: uploadedBy || 'Admin',
                date: new Date().toISOString()
            });
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

export const getFiles = (req, res) => {
    db.all("SELECT * FROM documents ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Map rows to match frontend expectation
        const files = rows.map(row => ({
            id: row.id,
            name: row.name,
            type: row.type,
            size: row.size,
            uploadedBy: row.uploaded_by,
            date: row.created_at,
            path: row.path
        }));

        res.json(files);
    });
};

export const deleteFile = (req, res) => {
    const { id } = req.params;

    db.get("SELECT path FROM documents WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'File not found' });

        const filePath = path.join(uploadDir, row.path);

        // Delete from FS
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from DB
        db.run("DELETE FROM documents WHERE id = ?", [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // --- LOG ACTIVITY ---
            logActivity(req, `Deleted file: ${row.name || 'Unknown'}`, 'Documents');

            res.json({ message: 'File deleted successfully' });
        });
    });
};

export const downloadFile = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM documents WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'File not found' });

        const filePath = path.join(uploadDir, row.path);
        if (fs.existsSync(filePath)) {
            res.download(filePath, row.name); // Sets Content-Disposition and Type automatically
        } else {
            res.status(404).json({ error: 'Physical file missing' });
        }
    });
};

// Helper
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
