'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { CryptoData } from '../store/slices/cryptoSlice';
import { toggleFavoriteCrypto } from '../store/slices/userPreferencesSlice';

interface CryptoCardProps {
  crypto: CryptoData;
  livePrice?: number;
}

const CryptoCard = ({ crypto, livePrice }: CryptoCardProps) => {
  const dispatch = useDispatch();
  const { favoriteCryptos } = useSelector((state: RootState) => state.userPreferences);
  
  const isFavorite = favoriteCryptos.includes(crypto.id);
  
  
  const currentPrice = livePrice || crypto.price;
  
  
  const priceChangeClass = crypto.priceChange24h > 0 
    ? 'text-green-600' 
    : crypto.priceChange24h < 0 
      ? 'text-red-600' 
      : 'text-gray-600';
  
  
  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(4) : price.toFixed(2);
  };
  
 
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };
  

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteCrypto(crypto.id));
  };
  
  return (
    <Link href={`/crypto/${crypto.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{crypto.name}</h3>
            <div className="text-gray-600 text-sm">{crypto.symbol.toUpperCase()}</div>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
          >
            {isFavorite ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-baseline">
            <div className="text-2xl font-bold text-gray-800">
              ${formatPrice(currentPrice)}
            </div>
            <div className={`${priceChangeClass} font-medium`}>
              {crypto.priceChange24h > 0 ? '+' : ''}
              {crypto.priceChange24h.toFixed(2)}%
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            Market Cap: {formatMarketCap(crypto.marketCap)}
          </div>
          
          
          {livePrice && livePrice !== crypto.price && (
            <div className="mt-2 text-xs flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
              <span className="text-green-600">Live</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;