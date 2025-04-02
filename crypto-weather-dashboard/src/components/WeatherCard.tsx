
'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { WeatherData } from '../store/slices/weatherSlice';
import { toggleFavoriteCity } from '../store/slices/userPreferencesSlice';
import Image from 'next/image';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { favoriteCities } = useSelector((state: RootState) => state.userPreferences);
  const isFavorite = favoriteCities.includes(weather.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteCity(weather.id));
  };

  const handleCardClick = () => {
    router.push(`/city/${weather.id}`);
  };

  return (
    <div onClick={handleCardClick} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{weather.name}</h3>
        <button
          onClick={handleToggleFavorite}
          className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>
      <div className="flex items-center mt-2">
      <Image
  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
  alt={weather.conditions}
  width={64}  // ✅ Add width
  height={64} // ✅ Add height
  className="w-16 h-16"
/>
        <div className="ml-2">
          <div className="text-3xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</div>
          <div className="text-gray-600 capitalize">{weather.conditions}</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

