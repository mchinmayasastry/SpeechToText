import { AlertTriangle, X } from 'lucide-react';

function Alert({ message, onDismiss }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-rose-300/30 bg-rose-500/15 p-4 text-rose-50" role="alert">
      <div className="flex gap-3">
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-rose-200" />
        <p className="text-sm leading-6">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 text-rose-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-rose-200"
        aria-label="Dismiss error"
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}

export default Alert;
