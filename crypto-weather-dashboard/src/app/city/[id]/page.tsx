'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;


const cityData = {
  london: { id: '2643743', name: 'London' },
  tokyo: { id: '1850144', name: 'Tokyo' },
  newYork: { id: '5128581', name: 'New York' }
};

// Reverse mapping from ID to name for direct ID access
const idToCity = Object.entries(cityData).reduce((acc, [key, data]) => {
  acc[data.id] = { key, name: data.name };
  return acc;
}, {} as Record<string, { key: string, name: string }>);

const fetchCityCoordinates = async (cityId: string) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to fetch city data: ${response.status} ${errorData.message || ''}`);
  }
  const data = await response.json();
  return { 
    lat: data.coord.lat, 
    lon: data.coord.lon,
    currentTemp: data.main.temp,
    currentWeather: data.weather[0].main,
    currentDescription: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed
  };
};


const fetchBasicForecast = async (cityId: string) => {
 
  const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to fetch forecast: ${response.status} ${errorData.message || ''}`);
  }
  
  const data = await response.json();
// instead of any use T
  return data.list.map((item: T) => ({
    time: new Date(item.dt * 1000).toLocaleDateString() + ` ${new Date(item.dt * 1000).getHours()}:00`,
    temperature: item.main.temp,
    humidity: item.main.humidity,
  }));
};

const CityPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [history, setHistory] = useState<{ time: string; temperature: number; humidity: number }[]>([]);
  const [currentData, setCurrentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let cityId: string;
        
        
        if (idToCity[id]) {
         
          cityId = id;
          setCityName(idToCity[id].name);
        } else {
         
          const normalizedId = id.toLowerCase().replace(/\s+/g, '');
          
         
          const cityKey = Object.keys(cityData).find(
            key => key.toLowerCase() === normalizedId
          );
          
          if (!cityKey) {
            throw new Error(`City not found. Available cities are: London, Tokyo, New York`);
          }
          
          cityId = cityData[cityKey as keyof typeof cityData].id;
          setCityName(cityData[cityKey as keyof typeof cityData].name);
        }
        
       
        const cityInfo = await fetchCityCoordinates(cityId);
        setCurrentData(cityInfo);
        
    
        const forecastData = await fetchBasicForecast(cityId);
        setHistory(forecastData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error(err);
        } else {
          setError('Failed to load weather data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-6 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Weather Details for {cityName || id}</h1>

      {loading && <p className="text-xl text-blue-600 font-medium">Loading weather data...</p>}
      {error && <p className="text-xl bg-red-100 p-4 rounded-lg border-l-4 border-red-600 text-red-800">{error}</p>}

      {!loading && !error && (
        <>
          {currentData && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg mb-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Current Weather</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <p className="text-5xl font-bold mb-2">{currentData.currentTemp.toFixed(1)}°C</p>
                  <p className="text-xl capitalize">{currentData.currentDescription}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="text-lg mb-2"><span className="font-semibold">Humidity:</span> {currentData.humidity}%</p>
                  <p className="text-lg"><span className="font-semibold">Wind:</span> {currentData.windSpeed} m/s</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Temperature Forecast</h2>
     
            {history.length > 0 ? (
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={history} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis 
                      dataKey="time" 
                      angle={-45} 
                      textAnchor="end" 
                      interval={2} 
                      height={100}
                      tick={{ fill: '#333', fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      yAxisId="left"
                      domain={['auto', 'auto']} 
                      tick={{ fill: '#333', fontSize: 12 }}
                      stroke="#666"
                      label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#333' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      tick={{ fill: '#333', fontSize: 12 }}
                      stroke="#666"
                      label={{ value: 'Humidity (%)', angle: -90, position: 'insideRight', fill: '#333' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderColor: '#ddd',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        borderRadius: '5px',
                        fontSize: '14px',
                        color: '#333'
                      }} 
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#FF5722" 
                      strokeWidth={3}
                      name="Temperature (°C)" 
                      dot={{ fill: '#FF5722', r: 4 }}
                      activeDot={{ r: 8, fill: '#FF5722' }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#2196F3" 
                      strokeWidth={3}
                      name="Humidity (%)" 
                      dot={{ fill: '#2196F3', r: 4 }}
                      activeDot={{ r: 8, fill: '#2196F3' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xl text-gray-700 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">No forecast data available for the selected city.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CityPage;