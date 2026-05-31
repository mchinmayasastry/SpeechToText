import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Save, Trash2 } from 'lucide-react';

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function LiveCaptionCard({ onSave, isSaving }) {
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [localError, setLocalError] = useState('');
  const [startedAt, setStartedAt] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(getSpeechRecognition());
  }, []);

  const combinedText = [finalText, interimText].filter(Boolean).join(' ').trim();
  const canSave = finalText.trim().length > 0 && !isListening && !isSaving;

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function createRecognition() {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let nextFinal = '';
      let nextInterim = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript || '';

        if (result.isFinal) {
          nextFinal += `${text} `;
        } else {
          nextInterim += text;
        }
      }

      if (nextFinal) {
        setFinalText((value) => `${value} ${nextFinal}`.replace(/\s+/g, ' ').trim());
      }
      setInterimText(nextInterim.trim());
    };

    recognition.onerror = (event) => {
      setLocalError(event.error === 'not-allowed'
        ? 'Microphone permission was denied.'
        : `Speech recognition stopped: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    return recognition;
  }

  function startListening() {
    setLocalError('');

    if (!isSupported) {
      setLocalError('Live captions require Chrome or Edge with Web Speech API support.');
      return;
    }

    const recognition = createRecognition();
    recognitionRef.current = recognition;
    setStartedAt(Date.now());
    setIsListening(true);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function clearTranscript() {
    setFinalText('');
    setInterimText('');
    setLocalError('');
    setStartedAt(null);
  }

  async function handleSave() {
    const duration = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : null;
    const saved = await onSave({
      transcript: finalText.trim(),
      duration_seconds: duration
    });

    if (saved) {
      clearTranscript();
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Live captions</h2>
          <p className="mt-1 text-sm text-slate-300">Speak into your microphone and watch words appear in real time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isListening ? 'bg-emerald-300' : 'bg-slate-500'}`} />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            {isListening ? 'Listening' : 'Idle'}
          </span>
        </div>
      </div>

      <div className="min-h-48 rounded-lg border border-white/10 bg-slate-950/35 p-4">
        {combinedText ? (
          <p className="text-xl font-medium leading-9 text-white">
            {finalText}
            {interimText ? <span className="text-pink-200"> {interimText}</span> : null}
          </p>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center text-center text-slate-300">
            <Mic aria-hidden="true" className="mb-3 h-10 w-10 text-pink-200" />
            <p className="font-medium text-white">Ready for speech</p>
            <p className="mt-2 max-w-sm text-sm text-slate-400">Start listening, allow microphone access, and begin speaking.</p>
          </div>
        )}
      </div>

      {localError ? <p className="mt-3 text-sm text-rose-200">{localError}</p> : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          {isListening ? <MicOff aria-hidden="true" className="h-5 w-5" /> : <Mic aria-hidden="true" className="h-5 w-5" />}
          {isListening ? 'Stop' : 'Start live'}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isSaving ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <Save aria-hidden="true" className="h-5 w-5" />}
          Save
        </button>

        <button
          type="button"
          onClick={clearTranscript}
          disabled={isListening || isSaving || !combinedText}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Trash2 aria-hidden="true" className="h-5 w-5" />
          Clear
        </button>
      </div>
    </section>
  );
}

export default LiveCaptionCard;
