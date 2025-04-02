// src/store/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import weatherReducer from './slices/weatherSlice';
// import cryptoReducer from './slices/cryptoSlice';
// import newsReducer from './slices/newsSlice';
// import userPreferencesReducer from './slices/userPreferencesSlice';
// import notificationsReducer from './slices/notificationsSlice';

// export const store = configureStore({
//   reducer: {
//     weather: weatherReducer,
//     crypto: cryptoReducer,
//     news: newsReducer,
//     userPreferences: userPreferencesReducer,
//     notifications: notificationsReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import weatherReducer from './slices/weatherSlice';
import cryptoReducer from './slices/cryptoSlice';
import newsReducer from './slices/newsSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    userPreferences: userPreferencesReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Define a custom hook for typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
