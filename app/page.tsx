'use client'

import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Python Search Bot</h1>
      <SearchForm onSearch={handleSearch} />
      <SearchResults keyword={searchKeyword} />
    </main>
  );
}

