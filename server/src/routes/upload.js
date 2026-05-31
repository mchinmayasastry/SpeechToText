import { Router } from 'express';
import { toFile } from 'openai/uploads';
import { upload } from '../middleware/upload.js';
import { getOpenAI } from '../services/openai.js';
import { insertTranscription } from '../services/supabase.js';

const router = Router();

router.post('/', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Audio file is required.');
      error.status = 400;
      throw error;
    }

    const audioFile = await toFile(
      req.file.buffer,
      req.file.originalname,
      { type: req.file.mimetype }
    );

    const transcription = await getOpenAI().audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'verbose_json'
    });

    const record = await insertTranscription({
      file_name: req.file.originalname,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      transcript: transcription.text,
      duration_seconds: transcription.duration ?? null
    });

    res.status(201).json({ transcription: record });
  } catch (error) {
    if (error.message?.includes('File too large')) {
      error.status = 413;
      error.message = 'Audio files must be 25 MB or smaller.';
    }
    next(error);
  }
});

export default router;
