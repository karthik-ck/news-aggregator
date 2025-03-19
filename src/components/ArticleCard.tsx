import React from 'react';

interface Article {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
}

interface ArticleCardProps {
  article: Article;
}

const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPkPKWHy4e8J9v37ZJMiOXhM8v4PFNGMfUWl05neqdVcHmEy1-cFjUlvA&s';

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="article-card">
      <img src={article.urlToImage || defaultImage} alt={article.title} />
      <div className="content">
        <h2>{article.title}</h2>
        <p>{article.description || 'No description available.'}</p>
        <p className="article-source">Source: {article.source.name}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
          Read More
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
