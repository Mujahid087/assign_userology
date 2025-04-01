'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useState } from 'react';

const NewsSection = () => {
  const { items, loading, error, lastUpdated } = useSelector((state: RootState) => state.news);
  const [showError, setShowError] = useState(!!error);
  

  const lastUpdatedText = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString() 
    : 'Never';
  

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Crypto News</h2>
        <div className="text-sm text-gray-500">Last updated: {lastUpdatedText}</div>
      </div>
  
      {error && showError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setShowError(false)}
          >
            <span className="sr-only">Close</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      
   
      {loading && items.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
    
      {items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{item.title}</h3>
                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>{item.source}</span>
                  <span>{formatPublishedDate(item.publishedAt)}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
      
    
      {!loading && items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No news articles available.</p>
        </div>
      )}
    </div>
  );
};

export default NewsSection;