
'use client';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { RootState } from '../../../store/store';
import { useAppDispatch } from "../../../store/hooks"; // ✅ Correct
import { fetchCryptoData, fetchCryptoHistory } from '../../../store/slices/cryptoSlice';
import { Line } from 'react-chartjs-2';  
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;

 
  const { data, loading, error } = useSelector((state: RootState) => state.crypto);

  const cryptoDetails = data[id];
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id && !cryptoDetails) {
      dispatch(fetchCryptoData(id)); 
    }

    if (id && cryptoDetails) {
      dispatch(fetchCryptoHistory(id));  
    }
  }, [id, cryptoDetails, dispatch]);

  if (loading) return <div style={{ color: 'black' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  if (!cryptoDetails) return <div style={{ color: 'black' }}>Crypto not found.</div>;

  // Prepare the data for the graph
  const today = new Date().toISOString().split('T')[0];
  const sameDayEntries = cryptoDetails.history?.filter((entry) => entry.date === today).slice(-5) || [];
  const previousDaysEntries = cryptoDetails.history?.filter((entry) => entry.date !== today).slice(-5) || [];
  const historicalEntries = [...sameDayEntries, ...previousDaysEntries];

  const historicalLabels = historicalEntries.map((entry) => entry.date) || [];
  const historicalPrices = historicalEntries.map((entry) => entry.price) || [];

  const graphData = {
    labels: historicalLabels,
    datasets: [
      {
        label: 'Price in USD',
        data: historicalPrices,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4" style={{ color: 'black' }}>{cryptoDetails.name} Details</h2>

      {/* Graph Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'black' }}>Price Over Time</h3>
        <Line data={graphData} />
      </div>

      {/* Tabular Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'black' }}>Historical Pricing</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2" style={{ color: 'black' }}>Date</th>
              <th className="border px-4 py-2" style={{ color: 'black' }}>Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            {historicalEntries.map((entry, index) => (
              <tr key={index}>
                <td className="border px-4 py-2" style={{ color: 'black' }}>{entry.date}</td>
                <td className="border px-4 py-2" style={{ color: 'black' }}>${entry.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extended Metrics Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'black' }}>Extended Metrics</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2" style={{ color: 'black' }}>Metric</th>
              <th className="border px-4 py-2" style={{ color: 'black' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2" style={{ color: 'black' }}>Current Price</td>
              <td className="border px-4 py-2" style={{ color: 'black' }}>${cryptoDetails.price.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2" style={{ color: 'black' }}>24h Price Change</td>
              <td className="border px-4 py-2" style={{ color: 'black' }}>{cryptoDetails.priceChange24h.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="border px-4 py-2" style={{ color: 'black' }}>Market Cap</td>
              <td className="border px-4 py-2" style={{ color: 'black' }}>${cryptoDetails.marketCap.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2" style={{ color: 'black' }}>Last Updated</td>
              <td className="border px-4 py-2" style={{ color: 'black' }}>{new Date(cryptoDetails.lastUpdated).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoDetailPage;