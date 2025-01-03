'use client'

import { useState, useEffect } from 'react';

interface SearchResult {
  url: string;
  title: string;
}

export function useSearchResults(keyword: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (!keyword) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword }),
        });
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setResults(data.results);
        }
      } catch (err) {
        setError('An error occurred while fetching results');
      } finally {
        setIsLoading(false);
      }
    };

    handleSearch();
  }, [keyword]);

  return { results, isLoading, error };
}

