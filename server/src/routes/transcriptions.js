import { Router } from 'express';
import { insertTranscription, listTranscriptions } from '../services/supabase.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const transcriptions = await listTranscriptions();
    res.json({ transcriptions });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const transcript = req.body?.transcript?.trim();

    if (!transcript) {
      const error = new Error('Transcript text is required.');
      error.status = 400;
      throw error;
    }

    const record = await insertTranscription({
      file_name: req.body?.file_name || `Live transcript ${new Date().toLocaleString()}`,
      file_size: null,
      mime_type: 'audio/live',
      transcript,
      duration_seconds: req.body?.duration_seconds ?? null
    });

    res.status(201).json({ transcription: record });
  } catch (error) {
    next(error);
  }
});

export default router;
