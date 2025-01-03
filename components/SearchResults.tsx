'use client'

import { useSearchResults } from '../hooks/useSearchResults';

export default function SearchResults({ keyword }: { keyword: string }) {
  const { results, isLoading, error } = useSearchResults(keyword);

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Search Results for "{keyword}"</h2>
      {results.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((result, index) => (
            <li key={index} className="border-b pb-2">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block"
              >
                <h3 className="text-blue-600 hover:underline font-medium">{result.title}</h3>
                <p className="text-green-700 text-sm truncate">{result.url}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

