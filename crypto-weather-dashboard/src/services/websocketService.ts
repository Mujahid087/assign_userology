
import { store } from '../store/store';
import { updateLivePrice } from '../store/slices/cryptoSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { defaultCryptos } from '../store/slices/cryptoSlice';

let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000;


const lastKnownPrices: Record<string, number> = {};


const PRICE_CHANGE_THRESHOLD = 5;

export const initializeWebSocket = () => {
  if (socket) {
    socket.close();
  }

 
  const cryptosToTrack = defaultCryptos;
  
 
  const WEBSOCKET_URL = `${process.env.NEXT_PUBLIC_COINCAP_WEBSOCKET_URL}?assets=${cryptosToTrack.join(',')}`;
  
  try {
    socket = new WebSocket(WEBSOCKET_URL);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts = 0;
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
      
        Object.entries(data).forEach(([key, value]) => {
          const cryptoId = key; 
          const price = parseFloat(value as string);
          
          
          store.dispatch(updateLivePrice({ id: cryptoId, price }));
          
        
          if (lastKnownPrices[cryptoId]) {
            const previousPrice = lastKnownPrices[cryptoId];
            const percentChange = ((price - previousPrice) / previousPrice) * 100;
            
            if (Math.abs(percentChange) >= PRICE_CHANGE_THRESHOLD) {
              const direction = percentChange > 0 ? 'increased' : 'decreased';
              store.dispatch(
                addNotification({
                  type: 'price_alert',
                  title: `${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} Price Alert`,
                  message: `Price has ${direction} by ${Math.abs(percentChange).toFixed(2)}% to $${price.toFixed(2)}`
                })
              );
            }
          }
          
        
          lastKnownPrices[cryptoId] = price;
        });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      
      // Attempt to reconnect if not a clean close
      if (!event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        setTimeout(initializeWebSocket, RECONNECT_INTERVAL);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
  } catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
  }
  
  return () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };
};

export const simulateWeatherAlerts = () => {
  const cities = ['New York', 'London', 'Tokyo'];
  const alerts = [
    'Heavy rainfall expected',
    'Heatwave warning',
    'Strong winds advisory',
    'Thunderstorm warning',
    'Air quality alert',
  ];
  
  setInterval(() => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    
    store.dispatch(
      addNotification({
        type: 'weather_alert',
        title: `Weather Alert for ${randomCity}`,
        message: randomAlert
      })
    );
  }, Math.random() * 60000 + 60000); 
};

