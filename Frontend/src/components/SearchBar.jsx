import React, { useState, useEffect } from 'react';

export const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim() === '') return;
    
    onSearch({ search: query });
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 w-full max-w-2xl mx-auto">
      <div className="flex items-center border border-gray-600 rounded-full overflow-hidden shadow-lg bg-gray-700">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Busca otra película..."
          className="w-full bg-transparent p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-gray-900 px-6 py-4 font-bold hover:bg-yellow-300 transition-colors duration-200"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};