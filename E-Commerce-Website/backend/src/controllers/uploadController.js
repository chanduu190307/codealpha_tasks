'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const { createdResponse } = require('../utils/ApiResponse');
const { validateMagicBytes, UPLOAD_DIR } = require('../utils/fileUpload');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw ApiError.badRequest('No file uploaded');
    }

    // Deep inspection: validate actual magic byte structure rather than trusting client MIME or extension
    const detectedExt = validateMagicBytes(req.file.buffer);
    if (!detectedExt) {
      throw ApiError.badRequest(
        'File rejected: invalid image signature. Only true JPEG, PNG, GIF, and WebP images are allowed. SVG and active content are forbidden.'
      );
    }

    // Safe filename generation using UUID (completely ignores client-supplied filename to prevent path traversal)
    const safeFilename = `${crypto.randomUUID()}.${detectedExt}`;
    const targetPath = path.join(UPLOAD_DIR, safeFilename);

    // Save to disk
    await fs.promises.writeFile(targetPath, req.file.buffer);

    const fileUrl = `/uploads/${safeFilename}`;

    return createdResponse(
      res,
      {
        url: fileUrl,
        filename: safeFilename,
        size: req.file.size,
        format: detectedExt,
      },
      'Image uploaded successfully'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
