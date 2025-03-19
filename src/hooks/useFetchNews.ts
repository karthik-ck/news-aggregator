// src/hooks/useFetchNews.ts
import { useState, useEffect } from 'react';
import { fetchNewsFromNewsAPI, fetchNewsFromGuardian, fetchNewsFromNYT } from '../api/newsService';

const useFetchNews = (query: string, filters: { date: string; category: string; source: string }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const [newsAPIArticles, guardianArticles, nytArticles] = await Promise.all([
          fetchNewsFromNewsAPI(query, filters),
          fetchNewsFromGuardian(query, filters),
          fetchNewsFromNYT(query, filters),
        ]);

        let combinedArticles = [
          ...newsAPIArticles.map((a: any) => ({
            ...a,
            publishedAt: a.publishedAt || a.webPublicationDate || '',
          })),
          ...guardianArticles.map((article: any) => ({
            ...article,
            //title: article.title || 'No Title',
            // url: article.url || '#',
            // publishedAt: article.publishedAt || '',
            // source: 'The Guardian',
          })),
          ...nytArticles.map((a: any) => ({
            ///...a,
            title: a.headline.main,
            url: a.web_url,
            publishedAt: a.pub_date,
            source: { name: a.source },
            description : a.lead_paragraph
          })),
        ];

        if (combinedArticles.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }

        setArticles(combinedArticles);
      } catch (err) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, filters]);


  return { articles, loading, error, noResults };
};

export default useFetchNews;
