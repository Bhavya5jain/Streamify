import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure temp directory exists
const tempDir = path.join(process.cwd(), "public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        // Add timestamp to avoid filename conflicts
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB max
    },
});