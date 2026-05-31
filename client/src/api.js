const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed. Please try again.');
  }

  return payload;
}

export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });

  return parseResponse(response);
}

export async function fetchTranscriptions() {
  const response = await fetch(`${API_BASE_URL}/api/transcriptions`);
  return parseResponse(response);
}

export async function saveLiveTranscription({ transcript, duration_seconds }) {
  const response = await fetch(`${API_BASE_URL}/api/transcriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      file_name: `Live transcript ${new Date().toLocaleString()}`,
      transcript,
      duration_seconds
    })
  });

  return parseResponse(response);
}
