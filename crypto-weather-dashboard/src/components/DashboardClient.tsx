// 'use client';

// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { fetchAllDefaultCities } from '../store/slices/weatherSlice';
// import { fetchAllDefaultCryptos } from '../store/slices/cryptoSlice';
// import { fetchNews } from '../store/slices/newsSlice';
// import WeatherSection from './WeatherSection';
// import CryptoSection from './CryptoSection';
// import NewsSection from './NewsSection';
// import FavoritesSection from './FavoritesSection';

// const DashboardClient = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
 
//     dispatch(fetchAllDefaultCities());
//     dispatch(fetchAllDefaultCryptos());
//     dispatch(fetchNews());

   
//     const interval = setInterval(() => {
//       dispatch(fetchAllDefaultCities());
//       dispatch(fetchAllDefaultCryptos());
//       dispatch(fetchNews());
//     }, 60000);

//     return () => clearInterval(interval);
//   }, [dispatch]);

//   return (
//     <div className="space-y-8">
//       <FavoritesSection />
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <WeatherSection />
//         <CryptoSection />
//       </div>
      
//       <NewsSection />
//     </div>
//   );
// };

// export default DashboardClient;


'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../store/store'; // ✅ Use typed dispatch
import { fetchAllDefaultCities } from '../store/slices/weatherSlice';
import { fetchAllDefaultCryptos } from '../store/slices/cryptoSlice';
import { fetchNews } from '../store/slices/newsSlice';
import WeatherSection from './WeatherSection';
import CryptoSection from './CryptoSection';
import NewsSection from './NewsSection';
import FavoritesSection from './FavoritesSection';

const DashboardClient = () => {
  const dispatch = useAppDispatch(); // ✅ Use typed dispatch

  useEffect(() => {
    dispatch(fetchAllDefaultCities());
    dispatch(fetchAllDefaultCryptos());
    dispatch(fetchNews());

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchAllDefaultCities());
      dispatch(fetchAllDefaultCryptos());
      dispatch(fetchNews());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <FavoritesSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeatherSection />
        <CryptoSection />
      </div>
      
      <NewsSection />
    </div>
  );
};

export default DashboardClient;
