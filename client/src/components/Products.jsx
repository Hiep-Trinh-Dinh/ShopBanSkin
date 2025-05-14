import Header from './Header';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { useState } from 'react';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        <ProductGrid searchTerm={searchTerm} />
        <Pagination />
      </main>
    </div>
  );
}