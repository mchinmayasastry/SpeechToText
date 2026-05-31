import { useEffect, useMemo, useState } from 'react';
import { fetchTranscriptions, saveLiveTranscription, uploadAudio } from './api.js';
import UploadCard from './components/UploadCard.jsx';
import LiveCaptionCard from './components/LiveCaptionCard.jsx';
import TranscriptionResult from './components/TranscriptionResult.jsx';
import HistoryList from './components/HistoryList.jsx';
import Alert from './components/Alert.jsx';
import { Mic2, Sparkles } from 'lucide-react';

function App() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingLive, setIsSavingLive] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState('');

  const latestHistory = useMemo(
    () => transcriptions.filter((item) => item.id !== currentResult?.id),
    [transcriptions, currentResult]
  );

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setIsLoadingHistory(true);
    setError('');

    try {
      const data = await fetchTranscriptions();
      setTranscriptions(data.transcriptions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function handleUpload(file) {
    setIsUploading(true);
    setError('');
    setCurrentResult(null);

    try {
      const data = await uploadAudio(file);
      setCurrentResult(data.transcription);
      setTranscriptions((items) => [data.transcription, ...items]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleLiveSave(payload) {
    setIsSavingLive(true);
    setError('');

    try {
      const data = await saveLiveTranscription(payload);
      setCurrentResult(data.transcription);
      setTranscriptions((items) => [data.transcription, ...items]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsSavingLive(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-white/15 p-3 text-pink-200 ring-1 ring-white/20">
              <Mic2 aria-hidden="true" className="h-7 w-7" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-pink-200">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                AI transcription workspace
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Speech-to-Text Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                Upload audio for Whisper transcription or use live captions for real-time speech-to-text.
              </p>
            </div>
          </div>
        </header>

        {error ? <Alert message={error} onDismiss={() => setError('')} /> : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <LiveCaptionCard onSave={handleLiveSave} isSaving={isSavingLive} />
          <TranscriptionResult result={currentResult} isLoading={isUploading || isSavingLive} />
        </section>

        <UploadCard onUpload={handleUpload} isUploading={isUploading} />

        <HistoryList
          transcriptions={latestHistory}
          isLoading={isLoadingHistory}
          onRefresh={loadHistory}
        />
      </div>
    </main>
  );
}

export default App;
