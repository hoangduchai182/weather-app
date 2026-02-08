'use client';

// Debug utility for API calls
export async function debugFetch(url: string, options?: RequestInit) {
  console.log(`[API] Calling: ${url}`, options);

  try {
    const response = await fetch(url, options);
    console.log(`[API] Response status: ${response.status}`);
    console.log(`[API] Response headers:`, Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log(`[API] Response text (first 200 chars):`, text.substring(0, 200));

    try {
      const json = JSON.parse(text);
      console.log(`[API] Parsed JSON:`, json);
      return { ok: response.ok, status: response.status, data: json };
    } catch (e) {
      console.error(`[API] Failed to parse JSON:`, e);
      return { ok: false, status: response.status, error: 'Invalid JSON', text };
    }
  } catch (error) {
    console.error(`[API] Fetch error:`, error);
    throw error;
  }
}
