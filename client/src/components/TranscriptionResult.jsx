import { Clipboard, FileText, Loader2 } from 'lucide-react';

function TranscriptionResult({ result, isLoading }) {
  async function copyTranscript() {
    if (result?.transcript) {
      await navigator.clipboard.writeText(result.transcript);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Current result</h2>
          <p className="mt-1 text-sm text-slate-300">Your latest transcript appears here.</p>
        </div>
        {result?.transcript ? (
          <button
            type="button"
            onClick={copyTranscript}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-200"
            aria-label="Copy transcript"
            title="Copy transcript"
          >
            <Clipboard aria-hidden="true" className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="min-h-72 rounded-lg border border-white/10 bg-slate-950/35 p-4">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center text-center text-slate-200">
            <Loader2 aria-hidden="true" className="mb-4 h-9 w-9 animate-spin text-pink-200" />
            <p className="font-medium">Generating transcript</p>
            <p className="mt-2 max-w-sm text-sm text-slate-400">Longer audio files can take a moment to process.</p>
          </div>
        ) : result?.transcript ? (
          <article>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-violet-400/15 px-3 py-1 text-violet-100">{result.file_name}</span>
              {result.duration_seconds ? (
                <span className="rounded-full bg-blue-400/15 px-3 py-1 text-blue-100">
                  {Math.round(result.duration_seconds)}s
                </span>
              ) : null}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-100 sm:text-base">{result.transcript}</p>
          </article>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center text-slate-300">
            <FileText aria-hidden="true" className="mb-4 h-10 w-10 text-violet-200" />
            <p className="font-medium text-white">No transcript yet</p>
            <p className="mt-2 max-w-sm text-sm text-slate-400">Upload an audio file to create your first transcription.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TranscriptionResult;
