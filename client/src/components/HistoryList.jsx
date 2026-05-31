import { RefreshCcw, Clock, FileAudio } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Unknown date';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function HistoryList({ transcriptions, isLoading, onRefresh }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Previous transcriptions</h2>
          <p className="mt-1 text-sm text-slate-300">Recent uploads stored in Supabase.</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw aria-hidden="true" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-lg bg-white/10" />
          ))}
        </div>
      ) : transcriptions.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {transcriptions.map((item) => (
            <article key={item.id} className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-lg bg-blue-400/15 p-2 text-blue-100">
                    <FileAudio aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">{item.file_name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="line-clamp-4 text-sm leading-6 text-slate-300">{item.transcript}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-slate-950/25 p-8 text-center">
          <p className="font-medium text-white">No previous transcriptions</p>
          <p className="mt-2 text-sm text-slate-400">Completed uploads will be listed here automatically.</p>
        </div>
      )}
    </section>
  );
}

export default HistoryList;
