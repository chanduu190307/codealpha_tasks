import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates image magic bytes from file buffer
 */
export function verifyImageMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47
  ) {
    return true;
  }

  // GIF: GIF87a or GIF89a (47 49 46 38)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return true;
  }

  // WebP: RIFF .... WEBP
  const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  if (isRiff && isWebp) {
    return true;
  }

  return false;
}

/**
 * Configures secure Multer disk storage instance for a given target subfolder
 */
export function createSecureUpload(subDir = 'posts') {
  const uploadDir = path.join(process.cwd(), 'backend', 'media', subDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : '.jpg';
      const randomHex = crypto.randomBytes(16).toString('hex');
      cb(null, `${subDir}_${Date.now()}_${randomHex}${safeExt}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`Invalid file extension: ${ext}. Allowed: .jpg, .jpeg, .png, .webp, .gif`), false);
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
      return cb(new Error(`Invalid MIME type: ${file.mimetype}`), false);
    }
    cb(null, true);
  };

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
  });
}

/**
 * Middleware to verify magic bytes of uploaded file after multer processes it
 */
export function validateUploadedImageFile(req, res, next) {
  if (!req.file) return next();

  const filePath = req.file.path;
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(16);
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);

    if (!verifyImageMagicBytes(buffer)) {
      // Remove malicious or corrupted file immediately
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        detail: 'Uploaded file failed magic byte verification. Invalid image content.'
      });
    }

    next();
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(400).json({
      success: false,
      detail: 'Failed to inspect uploaded file.'
    });
  }
}
