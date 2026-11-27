/**
 * Normalize socket payload to { id, text }.
 * Supports both legacy string payloads and { id, text } objects.
 */
export function normalizeSocketSegment(payload) {
  if (payload == null) return { id: '', text: '' };

  if (typeof payload === 'string' || typeof payload === 'number') {
    return { id: '', text: String(payload).trim() };
  }

  if (typeof payload === 'object') {
    const text = String(payload.text ?? payload.sentence ?? '').trim();
    const id =
      payload.id != null && String(payload.id).length > 0
        ? String(payload.id)
        : '';
    return { id, text };
  }

  return { id: '', text: '' };
}
