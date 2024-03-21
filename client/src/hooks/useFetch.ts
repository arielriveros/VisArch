import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/api/config';

interface FetchResponse<T> {
  data: T | null;
  status: number;
  error: string | null;
  loading: boolean;
}

export default function useFetch<T>(url: string, options?: RequestInit ): FetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/${url}`, optionsRef.current)
      .then(res => {
        setStatus(res.status);
        return res.json();
      })
      .then(data => {
        setData(data);
      })
      .catch(err => {
        console.error(err.msg);
        setError(err.msg);
      })
      .finally(() => setLoading(false));
      
  }, [url]);

  return { data, error, loading, status };
}
