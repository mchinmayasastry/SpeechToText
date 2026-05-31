# Speech-to-Text Web Application

A full-stack speech-to-text dashboard built with React, Tailwind CSS, Node.js, Express, Multer, OpenAI Whisper, and Supabase.

## Features

- Upload `.mp3`, `.wav`, and `.m4a` audio files
- Transcribe uploaded audio using the OpenAI Audio Transcriptions API with `whisper-1`
- Convert live microphone speech to real-time captions while someone is speaking
- Store uploaded and live transcription history in Supabase
- View the latest transcription result and previous transcriptions
- Responsive dashboard UI with loading, empty, and error states
- REST API architecture

## Project Structure

```text
client/
  src/
    components/
    App.jsx
    main.jsx
server/
  src/
    index.js
    routes/
    services/
    middleware/
```

## Supabase Setup

Create a table named `transcriptions`:

```sql
create table transcriptions (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_size bigint,
  mime_type text,
  transcript text not null,
  duration_seconds numeric,
  created_at timestamptz not null default now()
);
```

For local development, use a Supabase service role key on the server only. Never expose it in the React client.

## Environment Variables

Copy the examples and fill in your values:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

The client can leave `VITE_API_BASE_URL` empty during local development because Vite proxies `/api` to the Express server.

## Install

```bash
npm install
npm run install:all
```

## Run

```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

The React app calls `/api/...` routes. In development, Vite proxies `/api` to the Express server at `http://localhost:5000`, so the frontend and backend are linked without hardcoding the backend URL in client code.

## API

### `POST /api/upload`

Multipart form data:

- `audio`: required audio file, `.mp3`, `.wav`, or `.m4a`

Returns the stored transcription record.

### `GET /api/transcriptions`

Returns previous transcriptions ordered by newest first.

### `POST /api/transcriptions`

Saves a live microphone transcript to Supabase.

```json
{
  "transcript": "Live caption text",
  "duration_seconds": 42
}
```

## Live Captions

The live caption feature uses the browser Web Speech API for interim words, similar to meeting captions. It works best in Chrome or Edge and requires microphone permission. Completed live captions are saved through the backend with `POST /api/transcriptions`, so frontend and backend stay linked through the `/api` proxy.

## Notes

OpenAI currently supports the `audio/transcriptions` endpoint for uploaded speech-to-text. The upload flow uses `whisper-1` as requested. OpenAI file uploads for transcription are limited, so the server enforces a 25 MB upload limit.
