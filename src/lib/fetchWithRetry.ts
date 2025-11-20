/**
 * Fetch utility with timeout, retry logic, and better error handling
 */

interface FetchWithRetryOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  retryOn?: number[];
}

class FetchError extends Error {
  status?: number;
  statusText?: string;
  
  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Fetch with automatic retry, timeout, and better error handling
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    timeout = 30000, // 30 seconds default
    retries = 3,
    retryDelay = 1000,
    retryOn = [408, 429, 500, 502, 503, 504],
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check if we should retry based on status code
        if (!response.ok && retryOn.includes(response.status) && attempt < retries) {
          console.warn(
            `Request failed with status ${response.status}. Retry ${attempt + 1}/${retries}`
          );
          
          // Handle rate limiting with Retry-After header
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          // Exponential backoff for other errors
          const delay = retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error: any) {
      lastError = error;

      // Don't retry on abort errors that aren't timeouts
      if (error.name === 'AbortError') {
        throw new FetchError(
          'Request timeout. Please check your connection and try again.',
          408,
          'Request Timeout'
        );
      }

      // Network errors - retry
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.warn(
          `Network error: ${error.message}. Retry ${attempt + 1}/${retries} after ${delay}ms`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Max retries reached
      if (error.message.includes('fetch')) {
        throw new FetchError(
          'Cannot connect to server. Please check your internet connection.',
          0,
          'Network Error'
        );
      }

      throw error;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new FetchError('Request failed after retries', 500, 'Internal Server Error');
}

/**
 * Wrapper for JSON responses with error handling
 */
export async function fetchJSON<T = any>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options);

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If response isn't JSON, use status text
    }

    throw new FetchError(errorMessage, response.status, response.statusText);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new FetchError('Invalid JSON response from server', 500, 'Parse Error');
  }
}

export { FetchError };
