import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload.js';
import transcriptionsRouter from './routes/transcriptions.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS.'));
  }
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'speech-to-text-api' });
});

app.use('/api/upload', uploadRouter);
app.use('/api/transcriptions', transcriptionsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Speech-to-text API running on http://localhost:${port}`);
});
