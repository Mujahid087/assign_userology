// src/store/slices/weatherSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface WeatherData {
  id: string; // city id
  name: string;
  temperature: number;
  humidity: number;
  conditions: string;
  icon: string;
  timestamp: number;
  history?: {
    date: string;
    temperature: number;
    humidity: number;
  }[];
}

interface WeatherState {
  data: Record<string, WeatherData>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: WeatherState = {
  data: {},
  loading: false,
  error: null,
  lastUpdated: null,
};


export const defaultCities = ['New York', 'London', 'Tokyo'];


export const fetchWeatherForCity = createAsyncThunk(
  'weather/fetchWeatherForCity',
  async (city: string) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_OPENWEATHERMAP_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric'
      }
    });
    
    return {
      id: response.data.id.toString(),
      name: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      conditions: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      timestamp: Date.now(),
    };
  }
);

export const fetchWeatherHistory = createAsyncThunk(
  'weather/fetchWeatherHistory',
  async (city: string) => {
    
    const now = new Date();
    const history = Array(7).fill(0).map((_, index) => {
      const date = new Date();
      date.setDate(now.getDate() - index);
      
      return {
        date: date.toISOString().split('T')[0],
        temperature: Math.round(15 + Math.random() * 10),
        humidity: Math.round(40 + Math.random() * 40),
      };
    });
    
    return {
      city,
      history: history.reverse(), 
    };
  }
);

export const fetchAllDefaultCities = createAsyncThunk(
  'weather/fetchAllDefaultCities',
  async (_, { dispatch }) => {
    const promises = defaultCities.map(city => dispatch(fetchWeatherForCity(city)));
    await Promise.all(promises);
    return Date.now();
  }
);

// Slice
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateLastUpdated(state) {
      state.lastUpdated = Date.now();
    },
    clearWeatherError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchWeatherForCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeatherForCity.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.loading = false;
        state.data[action.payload.id] = {
          ...action.payload,
          history: state.data[action.payload.id]?.history || [],
        };
        state.lastUpdated = Date.now();
      })
      .addCase(fetchWeatherForCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      
     
      .addCase(fetchWeatherHistory.fulfilled, (state, action) => {
        const { city, history } = action.payload;
        const cityEntry = Object.values(state.data).find(c => c.name === city);
        
        if (cityEntry) {
          state.data[cityEntry.id] = {
            ...cityEntry,
            history,
          };
        }
      });
  },
});

export const { updateLastUpdated, clearWeatherError } = weatherSlice.actions;
export default weatherSlice.reducer;