
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import WeatherCard from './WeatherCard';
import CryptoCard from './CryptoCard';

const FavoritesSection = () => {
  const { favoriteCities, favoriteCryptos } = useSelector((state: RootState) => state.userPreferences);
  const weatherData = useSelector((state: RootState) => state.weather.data);
  const cryptoData = useSelector((state: RootState) => state.crypto.data);
  const livePrices = useSelector((state: RootState) => state.crypto.livePrices);
  
 
  const favoriteWeather = Object.values(weatherData).filter(weather => 
    favoriteCities.includes(weather.id)
  );
  

  const favoriteCrypto = Object.values(cryptoData).filter(crypto => 
    favoriteCryptos.includes(crypto.id)
  );
  

  const hasFavorites = favoriteWeather.length > 0 || favoriteCrypto.length > 0;
  

  if (!hasFavorites) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Favorites</h2>
      
  
      {favoriteWeather.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Weather</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteWeather.map((weather) => (
              <WeatherCard key={weather.id} weather={weather} />
            ))}
          </div>
        </div>
      )}
      
  
      {favoriteCrypto.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Cryptocurrency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCrypto.map((crypto) => (
              <CryptoCard 
                key={crypto.id} 
                crypto={crypto} 
                livePrice={livePrices[crypto.id]} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;