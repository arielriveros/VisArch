import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/api/config';

interface FetchResponse<T> {
  data: T | null;
  status: number;
  error: unknown | null;
  loading: boolean;
  execute: () => void;
}

interface useFetchProps<T> {
  url: string;
  options?: RequestInit;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export default function useFetch<T>(props: useFetchProps<T>): FetchResponse<T> {
  const { url, options = {}, immediate = true, onSuccess, onError } = props;
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState(0);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const optionsRef = useRef(options);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  const execute = useCallback(
    async ({ abortSignal }: { abortSignal?: AbortSignal } = {}) => {
      try {
        setError(null);
        setLoading(true);

        const requestOptions = {
          ...optionsRef.current,
          credentials: 'include', // Ensure credentials are included
          signal: abortSignal,
        } as RequestInit;

        const res = await fetch(`${API_BASE_URL}/${url}`, requestOptions);
        setStatus(res.status);

        if (!res.ok) {
          const errorText = await res.text();
          setError(errorText);
          onErrorRef.current && onErrorRef.current(errorText);
          throw new Error(errorText);
        }

        const data = await res.json();
        setData(data);
        onSuccessRef.current && onSuccessRef.current(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Fetch was aborted, do nothing
          return;
        }
        onErrorRef.current && onErrorRef.current((err as Error).message);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    const abortController = new AbortController();
    if (immediate) {
      execute({ abortSignal: abortController.signal });
    }
    return () => {
      abortController.abort();
    };
  }, [execute, immediate]);

  return { data, error, loading, status, execute };
}
