
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  lastUpdated: string;
  history?: {
    date: string;
    price: number;
  }[];
}

interface CryptoState {
  data: Record<string, CryptoData>;
  livePrices: Record<string, number>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CryptoState = {
  data: {},
  livePrices: {},
  loading: false,
  error: null,
  lastUpdated: null,
};


export const defaultCryptos = ['bitcoin', 'ethereum', 'solana'];


export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (cryptoId: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_COINGECKO_BASE_URL}/coins/${cryptoId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      }
    });
    
    return {
      id: response.data.id,
      symbol: response.data.symbol,
      name: response.data.name,
      price: response.data.market_data.current_price.usd,
      priceChange24h: response.data.market_data.price_change_percentage_24h,
      marketCap: response.data.market_data.market_cap.usd,
      lastUpdated: response.data.last_updated,
    };
  }
);

export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchCryptoHistory',
  async (cryptoId: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_COINGECKO_BASE_URL}/coins/${cryptoId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: 7,
        },
      }
    );
    
 
    const history = response.data.prices.map((entry: [number, number]) => {
      const [timestamp, price] = entry;
      return {
        date: new Date(timestamp).toISOString().split('T')[0],
        price,
      };
    });
    
    return {
      id: cryptoId,
      history,
    };
  }
);

export const fetchAllDefaultCryptos = createAsyncThunk(
  'crypto/fetchAllDefaultCryptos',
  async (_, { dispatch }) => {
    const promises = defaultCryptos.map(crypto => dispatch(fetchCryptoData(crypto)));
    await Promise.all(promises);
    return Date.now();
  }
);

// Slice
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateLivePrice(state, action: PayloadAction<{ id: string; price: number }>) {
      const { id, price } = action.payload;
      state.livePrices[id] = price;
   
      if (state.data[id]) {
        state.data[id].price = price;
      }
    },
    clearCryptoError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action: PayloadAction<CryptoData>) => {
        state.loading = false;
        state.data[action.payload.id] = {
          ...action.payload,
          history: state.data[action.payload.id]?.history || [],
        };
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      })
      
     
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        const { id, history } = action.payload;
        if (state.data[id]) {
          state.data[id].history = history;
        }
      });
  },
});

export const { updateLivePrice, clearCryptoError } = cryptoSlice.actions;
export default cryptoSlice.reducer;