export async function api(path, options = {}) {
  const { headers, body, ...rest } = options;
  const isFormData = body instanceof FormData;

  const res = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(headers || {})
    },
    body,
    ...rest
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch (e) { data = text; }
  }

  if (!res.ok) {
    const error = new Error(data && data.message ? data.message : 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function formatDate(dateStr, options = { day: '2-digit', month: 'long', year: 'numeric' }) {
  return new Date(dateStr).toLocaleDateString('en-GB', options);
}