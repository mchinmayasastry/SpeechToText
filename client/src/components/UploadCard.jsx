import { useRef, useState } from 'react';
import { FileAudio, Loader2, Upload, X } from 'lucide-react';

const MAX_FILE_SIZE_MB = 25;
const supportedExtensions = ['mp3', 'wav', 'm4a'];

function UploadCard({ onUpload, isUploading }) {
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  function validateFile(nextFile) {
    if (!nextFile) return false;

    const extension = nextFile.name.split('.').pop()?.toLowerCase();
    if (!supportedExtensions.includes(extension)) {
      setLocalError('Choose an MP3, WAV, or M4A file.');
      return false;
    }

    if (nextFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setLocalError(`Audio files must be ${MAX_FILE_SIZE_MB} MB or smaller.`);
      return false;
    }

    setLocalError('');
    return true;
  }

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0];
    if (validateFile(nextFile)) {
      setFile(nextFile);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const nextFile = event.dataTransfer.files?.[0];
    if (validateFile(nextFile)) {
      setFile(nextFile);
    }
  }

  function clearFile() {
    setFile(null);
    setLocalError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (file) {
      onUpload(file);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Upload audio</h2>
        <p className="mt-1 text-sm text-slate-300">Supports MP3, WAV, and M4A files up to 25 MB.</p>
      </div>

      <label
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-violet-200/40 bg-slate-950/30 px-5 py-8 text-center transition hover:border-pink-200/80 hover:bg-white/10 focus-within:ring-2 focus-within:ring-pink-200"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isUploading}
        />
        <div className="rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 p-3 text-white">
          <Upload aria-hidden="true" className="h-7 w-7" />
        </div>
        <span className="mt-4 text-base font-semibold text-white">Drop audio here or browse</span>
        <span className="mt-2 text-sm text-slate-300">Your file is sent securely to the backend for transcription.</span>
      </label>

      {localError ? <p className="mt-3 text-sm text-rose-200">{localError}</p> : null}

      {file ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileAudio aria-hidden="true" className="h-5 w-5 flex-none text-pink-200" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="rounded-md p-2 text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-200"
            aria-label="Remove selected file"
            disabled={isUploading}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!file || isUploading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 via-blue-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isUploading ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <Upload aria-hidden="true" className="h-5 w-5" />}
        {isUploading ? 'Transcribing audio...' : 'Start transcription'}
      </button>
    </form>
  );
}

export default UploadCard;
