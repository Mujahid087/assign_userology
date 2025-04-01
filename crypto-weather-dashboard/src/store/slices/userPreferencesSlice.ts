import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface UserPreferencesState {
  favoriteCities: string[]; 
  favoriteCryptos: string[]; 
}

const getInitialState = (): UserPreferencesState => {
  if (typeof window !== 'undefined') {
    const savedPrefs = localStorage.getItem('user_preferences');
    if (savedPrefs) {
      try {
        return JSON.parse(savedPrefs);
      } catch (e) {
        console.error('Failed to parse saved preferences', e);
      }
    }
  }
  
  return {
    favoriteCities: [],
    favoriteCryptos: [],
  };
};

// Slice
const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState: getInitialState(),
  reducers: {
    toggleFavoriteCity(state, action: PayloadAction<string>) {
      const cityId = action.payload;
      const index = state.favoriteCities.indexOf(cityId);
      
      if (index === -1) {
        state.favoriteCities.push(cityId);
      } else {
        state.favoriteCities.splice(index, 1);
      }
      
 
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_preferences', JSON.stringify(state));
      }
    },
    toggleFavoriteCrypto(state, action: PayloadAction<string>) {
      const cryptoId = action.payload;
      const index = state.favoriteCryptos.indexOf(cryptoId);
      
      if (index === -1) {
        state.favoriteCryptos.push(cryptoId);
      } else {
        state.favoriteCryptos.splice(index, 1);
      }
      

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_preferences', JSON.stringify(state));
      }
    },
  },
});

export const { toggleFavoriteCity, toggleFavoriteCrypto } = userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;