'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import WeatherCard from './WeatherCard';
import { defaultCities } from '../store/slices/weatherSlice';
import { useState } from 'react';

const WeatherSection = () => {
  const { data, loading, error, lastUpdated } = useSelector((state: RootState) => state.weather);
  const [showError, setShowError] = useState(!!error);

  const weatherItems = Object.values(data);
  
 
  const hasData = weatherItems.length > 0;
  
 
  const lastUpdatedText = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString() 
    : 'Never';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Weather</h2>
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
      
   
      {loading && !hasData && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
   
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherItems.map((weather) => (
            <WeatherCard key={weather.id} weather={weather} />
          ))}
        </div>
      )}
     
      {!loading && !hasData && (
        <div className="text-center py-8">
          <p className="text-gray-500">No weather data available.</p>
        </div>
      )}
    </div>
  );
};

export default WeatherSection;