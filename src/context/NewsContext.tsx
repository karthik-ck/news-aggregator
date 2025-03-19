import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NewsContextType {
  articles: any[];
  setArticles: (articles: any[]) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<any[]>([]);
  
  return (
    <NewsContext.Provider value={{ articles, setArticles }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within a NewsProvider');
  return context;
};
