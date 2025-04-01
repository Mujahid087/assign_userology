
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface NewsState {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: NewsState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async () => {
    
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_NEWSDATA_BASE_URL}/news`, {
      params: {
        apikey: apiKey,
        q: 'cryptocurrency OR bitcoin OR ethereum',
        language: 'en',
        size: 5
      }
    });
    
    return response.data.results.map((item: any) => ({
      id: item.article_id,
      title: item.title,
      description: item.description,
      url: item.link,
      source: item.source_id,
      publishedAt: item.pubDate,
    }));
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearNewsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<NewsItem[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news';
      });
  },
});

export const { clearNewsError } = newsSlice.actions;
export default newsSlice.reducer;