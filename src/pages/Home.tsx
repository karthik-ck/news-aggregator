import React, { useState, useEffect } from 'react';
import useFetchNews from '../hooks/useFetchNews';
import ArticleCard from '../components/ArticleCard';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const [query, setQuery] = useState('latest');
  const [filters, setFilters] = useState({ date: '', category: '', source: '', sortBy: '' });
  const { articles, loading, error, noResults } = useFetchNews(query, filters);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleFilterChange = (newFilters: { date: string; category: string; source: string; sortBy: string }) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setQuery('latest');
    setFilters({ date: '', category: '', source: '', sortBy: '' });
  };

  useEffect(() => {
    handleSearch('latest');
  }, []);

  return (
    <div className="container">
      <SearchBar onSearch={handleSearch} />
      <div className="filters-container">
        <Filters onFilterChange={handleFilterChange} />
        <button onClick={handleReset} className="reset-btn">Reset</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {noResults && <p>No Articles Found</p>}
      <div className="articles-grid">
        {articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Home;
