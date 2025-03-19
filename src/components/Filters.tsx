import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FiltersProps {
  onFilterChange: (filters: { date: string; category: string; source: string; sortBy: string }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [newsSources, setNewsSources] = useState<{ id: string; name: string }[]>([]);

  // Fetch NewsAPI sources on mount
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/sources?apiKey=b64c6fa1905d439794804472dc4dad61`
        );
        setNewsSources(response.data.sources);
      } catch (error) {
        console.error('Failed to fetch sources', error);
      }
    };
    fetchSources();
  }, []);

  const handleApplyFilters = () => {
    const appliedFilters = {
      date,
      category,
      source: source === '' ? '' : source,
      sortBy,
    };
    onFilterChange(appliedFilters);
  };  

  return (
    <div className="filters">
      {/* Date Filter */}
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      {/* Category Filter */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="technology">Technology</option>
        <option value="business">Business</option>
        <option value="sports">Sports</option>
        <option value="entertainment">Entertainment</option>
      </select>

      {/* Source Filter */}
      <select value={source} onChange={(e) => setSource(e.target.value)}>
        <option value="">All Sources</option>
        {newsSources.map((src) => (
          <option key={src.id} value={src.id}>
            {src.name}
          </option>
        ))}
      </select>

      {/* Sort By Filter */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="publishedAt">Newest First</option>
        <option value="relevancy">Most Relevant</option>
        <option value="popularity">Most Popular</option>
      </select>

      {/* Apply Button */}
      <button onClick={handleApplyFilters} className='apply_btn'>Apply</button>
    </div>
  );
};

export default Filters;
