import axios from 'axios';

const NEWS_API_KEY = 'b64c6fa1905d439794804472dc4dad61';
const GUARDIAN_API_KEY = '029ff5ad-e8b4-4b0a-91c1-f62ae2224718';
const NYT_API_KEY = '9JuqDD5IM87GlerFnn8AC958LvBUJc9K';

export const fetchNewsFromNewsAPI = async (
  query: string,
  filters: { date?: string; category?: string; source?: string; sortBy?: 'relevancy' | 'popularity' | 'publishedAt' }
) => {
  let url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`;

  if (filters.date) url += `&from=${filters.date}&to=${filters.date}`;
  if (filters.source) url += `&sources=${filters.source}`;
  if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;

  const response = await axios.get(url);
  let articles = response.data.articles;

  // Apply category filtering locally since NewsAPI doesn't support it in /everything
  if (filters.category) {
    articles = articles.filter(
      (article: any) =>
        article.category?.toLowerCase() === filters.category?.toLowerCase() ||
        article.sectionName?.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  return articles;
};

export const fetchNewsFromGuardian = async (
  query: string,
  filters: { date?: string; category?: string }
) => {
  let url = `https://content.guardianapis.com/search?q=${query}&api-key=${GUARDIAN_API_KEY}`;

  if (filters.date) url += `&from-date=${filters.date}&to-date=${filters.date}`;
  if (filters.category) url += `&section=${filters.category}`;

  const response = await axios.get(url);

  // Map the response to align with other APIs
  const articles = response.data.response.results.map((article: any) => ({
    title: article.webTitle,
    url: article.webUrl,
    publishedAt: article.webPublicationDate,
    source: { name: 'The Guardian' }
  }));

  return articles;
};


export const fetchNewsFromNYT = async (
  query: string,
  filters: { date?: string; category?: string; source?: string }
) => {
  let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${NYT_API_KEY}`;

  // Date Filters (format: YYYYMMDD)
  if (filters.date) {
    const formattedDate = filters.date.replace(/-/g, '');
    url += `&begin_date=${formattedDate}&end_date=${formattedDate}`;
  }

  // Build fq (filter query) string for category and source directly
  const fqParts = [];

  if (filters.category) {
    fqParts.push(`"${filters.category}"`);
  }

  if (filters.source) {
    fqParts.push(`source:("${filters.source}")`);
  }

  // Apply fq if there are filters
  if (fqParts.length > 0) {
    const fq = fqParts.join(' AND ');
    url += `&fq=${encodeURIComponent(fq)}`;
  }

  const response = await axios.get(url);
  return response.data.response.docs;
};