import { createClient } from './supabaseClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function getAuthHeader(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    return {
      'Authorization': `Bearer ${session.access_token}`
    };
  }
  return {};
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const authHeader = await getAuthHeader();
  
  const headers = {
    'Content-Type': 'application/json',
    ...authHeader,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError('An unexpected error occurred', response.status);
    }
    
    throw new ApiError(
      errorData.error?.message || 'API request failed',
      response.status,
      errorData.error?.code
    );
  }

  // Not all endpoints return JSON (e.g. streaming ones)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json();
    return json.data || json;
  }
  
  return response;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> => 
    fetchWithAuth(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data: any, options?: RequestInit): Promise<T> => 
    fetchWithAuth(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  put: <T>(endpoint: string, data: any, options?: RequestInit): Promise<T> =>
    fetchWithAuth(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  patch: <T>(endpoint: string, data: any, options?: RequestInit): Promise<T> =>
    fetchWithAuth(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
    
  // Helper for SSE streaming
  stream: async function* (endpoint: string, data: any) {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new ApiError('Stream request failed', response.status);
    }

    if (!response.body) {
      throw new Error('Response body is missing');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(dataStr);
              yield parsed;
            } catch (e) {
              console.warn('Failed to parse SSE JSON chunk', dataStr);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};
