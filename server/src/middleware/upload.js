import multer from 'multer';

const allowedMimeTypes = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/x-m4a',
  'audio/mp4',
  'audio/m4a'
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const extensionAllowed = /\.(mp3|wav|m4a)$/i.test(file.originalname);
    const mimeAllowed = allowedMimeTypes.has(file.mimetype);

    if (extensionAllowed || mimeAllowed) {
      cb(null, true);
      return;
    }

    cb(new Error('Only .mp3, .wav, and .m4a audio files are supported.'));
  }
});
