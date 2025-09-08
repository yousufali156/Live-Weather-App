import React, { useState, useEffect, createContext, useContext } from 'react';

// --- SETUP & CONFIGURATION ---

// This code loads the Tailwind CSS framework and configures dark mode.
(() => {
  if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);
    
    tailwindScript.onload = () => {
      window.tailwind.config = {
        darkMode: 'class',
      };
    };
  }
})();

// This hook saves and retrieves app states (like current city, favorite cities, and theme) from local storage, so data persists even after the browser is closed.
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// --- SVG ICONS (Self-contained components) ---
// SVG code for various weather icons and UI elements used in the app.
const Sun = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const Moon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>;
const Cloud = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>;
const CloudDrizzle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M8 19v1"></path><path d="M8 14v1"></path><path d="M16 19v1"></path><path d="M16 14v1"></path><path d="M12 21v1"></path><path d="M12 16v1"></path></svg>;
const CloudRain = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>;
const CloudSnow = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 17.5l-2-2 2-2"></path><path d="M8 17.5l-2-2 2-2"></path><path d="M12 20l-2-2 2-2"></path></svg>;
const Wind = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path><path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path><path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path></svg>;
const Droplets = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.47-2.29-1.23-3.12-1.45-1.55-4.3-1.55-5.75 0C3.27 10 2.8 11.13 2.8 12.25c0 2.22 1.8 4.05 4 4.05Z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.56 2.62.1 5.38-1.44 7.38"></path><path d="M14 21a6.98 6.98 0 0 0 7-7c0-2.22-1-4.22-2.5-5.5s-3.5-2-5.5-2.5c-.83 1.5-1.08 3.16-.9 4.64"></path></svg>;
const Thermometer = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path></svg>;
const Search = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const Heart = ({ className, isFavorite }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const MapPin = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Sunrise = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m17.66 12.34 1.41-1.41"></path><path d="M22 22H2"></path><path d="m16 5-4-4-4 4"></path></svg>;
const Sunset = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 10V2"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m17.66 12.34 1.41-1.41"></path><path d="M22 22H2"></path><path d="m16 18-4 4-4-4"></path></svg>;
const AlertTriangle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;

// --- CONTEXT & PROVIDERS ---
// This React Context is used to pass app states to different components.
const AppContext = createContext();

const AppProvider = ({ children }) => {
    // API KEYs are now constants inside AppProvider
    const WEATHERAPI_KEY = "5d4631a4118a4d65b4741506250809";
    const OPENWEATHER_API_KEY = "0d947102d717c574df8d1b71b05941dd";
    const LOCATIONIQ_API_KEY = "pk.375c7400029716887a010093a20998e1"; // Example key, replace with your own
    const [currentCity, setCurrentCity] = useLocalStorage('currentCity', { name: "bogra", lat: 24.8465, lon: 89.3757 });
    const [favoriteCities, setFavoriteCities] = useLocalStorage('favoriteCities', [{ name: "London" }]);
    const [theme, setTheme] = useLocalStorage('theme', 'dark');
    const [units, setUnits] = useLocalStorage('units', 'metric');
    
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    
    // This useEffect handles the main API calls.
    useEffect(() => {
        const fetchWeatherWithFallback = async () => {
            setLoading(true);
            setError(null);
            
            // Try with WeatherAPI.com first
            try {
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${currentCity.lat},${currentCity.lon}&days=7`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error("WeatherAPI.com failed to fetch data. Trying OpenWeatherMap...");
                }
                
                const data = await response.json();
                
                // Convert WeatherAPI.com data to a common format
                const formattedData = {
                    location: data.location,
                    current: data.current,
                    forecast: data.forecast,
                    hourly: data.forecast.forecastday[0].hour,
                    source: 'weatherapi'
                };
                setWeatherData(formattedData);

            } catch (err) {
                console.error("Primary API failed:", err);
                
                // Fallback to OpenWeatherMap
                try {
                    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity.name}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
                    const openWeatherResponse = await fetch(openWeatherUrl);

                    if (!openWeatherResponse.ok) {
                        throw new Error("OpenWeatherMap also failed. Could not fetch data.");
                    }
                    
                    const openWeatherData = await openWeatherResponse.json();

                    // Convert OpenWeatherMap data to a common format
                    const formattedData = {
                        location: {
                            name: openWeatherData.city.name,
                            lat: openWeatherData.city.coord.lat,
                            lon: openWeatherData.city.coord.lon
                        },
                        current: {
                            temp_c: openWeatherData.list[0].main.temp,
                            is_day: 1, // Placeholder as OpenWeather doesn't provide this directly in forecast
                            condition: {
                                text: openWeatherData.list[0].weather[0].description,
                                icon: openWeatherData.list[0].weather[0].icon
                            },
                            feelslike_c: openWeatherData.list[0].main.feels_like,
                            humidity: openWeatherData.list[0].main.humidity,
                            wind_kph: openWeatherData.list[0].wind.speed * 3.6, // Convert m/s to kph
                            uv: "N/A"
                        },
                        forecast: {
                            forecastday: openWeatherData.list.filter((item, index) => index % 8 === 0).map(item => ({
                                date: item.dt_txt,
                                day: {
                                    maxtemp_c: item.main.temp_max,
                                    mintemp_c: item.main.temp_min,
                                    condition: {
                                        icon: item.weather[0].icon,
                                        text: item.weather[0].description
                                    }
                                }
                            }))
                        },
                        // Additional data for SidePanel's hourly forecast
                        hourly: openWeatherData.list.slice(0, 24).map(item => ({
                            time: item.dt_txt,
                            is_day: 1, // Placeholder
                            condition: {
                                icon: item.weather[0].icon,
                                text: item.weather[0].description
                            },
                            temp_c: item.main.temp
                        })),
                        source: 'openweathermap'
                    };
                    setWeatherData(formattedData);
                    
                } catch (fallbackErr) {
                    setError(fallbackErr.message);
                    console.error("Fallback API also failed:", fallbackErr);
                }
            } finally {
                setLoading(false);
            }
        };

        if (currentCity.name) {
            fetchWeatherWithFallback();
        }
    }, [currentCity, units, WEATHERAPI_KEY, OPENWEATHER_API_KEY]);

    const addFavorite = (city) => {
        if (!favoriteCities.some(fav => fav.name === city.name)) {
            setFavoriteCities([...favoriteCities, city]);
        }
    };
    const removeFavorite = (cityName) => setFavoriteCities(favoriteCities.filter(fav => fav.name !== cityName));
    
    const value = { currentCity, setCurrentCity, favoriteCities, addFavorite, removeFavorite, weatherData, loading, error, theme, setTheme, units, setUnits, WEATHERAPI_KEY, OPENWEATHER_API_KEY, LOCATIONIQ_API_KEY };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- HELPER & CHILD COMPONENTS ---
// This component loads the correct icon based on the weather data source.
const WeatherIcon = ({ code, className, isDay, source }) => {
  // Use WeatherAPI.com icons
  if (source === 'weatherapi') {
      const iconCode = code.match(/(\d+)\.png$/)?.[1] || code;
      const iconUrl = `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`;
      return <img src={iconUrl} alt="Weather icon" className={className} />;
  }
  // Use OpenWeatherMap icons
  else {
      return <img src={`https://openweathermap.org/img/wn/${code}@2x.png`} alt="Weather icon" className={className} />;
  }
};

const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400"></div>
    </div>
);

const MessageBox = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                <p className="text-center font-medium dark:text-gray-200">{message}</p>
                <button onClick={onClose} className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Close</button>
            </div>
        </div>
    );
};

// --- MAIN UI COMPONENTS ---
// This component is the app's main display, showing current weather data.
function MainWeatherDisplay() {
    const { weatherData, units } = useContext(AppContext);
    if (!weatherData) return <div className="flex-grow flex items-center justify-center"><p>No weather data available.</p></div>;

    const { location, current, forecast } = weatherData;
    const isDay = current.is_day === 1;
    const today = forecast?.forecastday?.[0];
    const source = weatherData.source || 'weatherapi';
    
    return (
        <div className="flex-grow flex flex-col p-6 md:p-8 text-white dark:text-gray-100">
            {/* Top Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">{location.name}</h1>
                    <p className="text-gray-400 dark:text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg">{Math.round(today?.day.maxtemp_c)}° / {Math.round(today?.day.mintemp_c)}°</p>
                    <p className="text-sm text-gray-400 dark:text-gray-400 capitalize">{current.condition.text}</p>
                </div>
            </div>

            {/* Main Temp & Icon */}
            <div className="my-auto flex flex-col items-center text-center">
                 <WeatherIcon code={current.condition.icon} isDay={isDay} source={source} className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-lg" />
                 <p className="text-7xl sm:text-8xl font-extrabold tracking-tighter">{Math.round(current.temp_c)}°<span className="text-5xl align-top font-light">C</span></p>
            </div>
            
            {/* Details Grid */}
            <div className="mt-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Feels Like</p>
                    <p className="text-xl font-bold">{Math.round(current.feelslike_c)}°</p>
                </div>
                <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Humidity</p>
                    <p className="text-xl font-bold">{current.humidity}%</p>
                </div>
                 <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Wind Speed</p>
                    <p className="text-xl font-bold">{current.wind_kph} kph</p>
                </div>
                 <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">UV Index</p>
                    <p className="text-xl font-bold">{current.uv || 'N/A'}</p>
                 </div>
            </div>
        </div>
    );
}

// This component is the app's side panel, where search, forecasts, and other options are located.
function SidePanel({WEATHERAPI_KEY, OPENWEATHER_API_KEY, LOCATIONIQ_API_KEY}) {
    const { favoriteCities, setCurrentCity, weatherData, addFavorite, removeFavorite, theme, setTheme, units, setUnits } = useContext(AppContext);
    const [input, setInput] = useState('');
    const [searchError, setSearchError] = useState('');
    
    if (!weatherData) return null;
    const { location, current, forecast, hourly } = weatherData;
    const source = weatherData.source || 'weatherapi';

    // This function uses the LocationIQ API to find the correct latitude and longitude from a city name.
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setSearchError('');
        try {
            // Try Nominatim API first
            const geoUrl = `https://nominatim.openstreetmap.org/search?q=${input}&format=json&limit=1`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (geoData.length > 0) {
                const { display_name, lat, lon } = geoData[0];
                const city = { name: display_name.split(',')[0], lat, lon };
                setCurrentCity(city);
                setInput('');
            } else {
                throw new Error("City not found. Trying WeatherAPI.com...");
            }
        } catch (err) {
            console.error("Nominatim search failed:", err);
            // Fallback to WeatherAPI.com search
            try {
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${input}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error("City not found.");
                const data = await response.json();
                
                const city = { name: data.location.name, lat: data.location.lat, lon: data.location.lon };
                setCurrentCity(city);
                setInput('');
            } catch (fallbackErr) {
                setSearchError(fallbackErr.message);
            }
        }
    };
    
    const isCurrentFavorite = favoriteCities.some(fav => fav.name === location.name);

    const handleToggleFavorite = () => {
        const city = { name: location.name, lat: location.lat, lon: location.lon };
        if (isCurrentFavorite) removeFavorite(city.name);
        else addFavorite(city);
    };

    return (
        <div className="bg-gray-100 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 text-slate-800 dark:text-gray-100 h-full flex flex-col gap-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                 <form onSubmit={handleSearch} className="relative flex-grow">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search for a city..." className="w-full bg-white/50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"><Search className="w-5 h-5" /></button>
                 </form>
                 <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="ml-4 p-2 rounded-full bg-white/50 dark:bg-slate-800/50">
                    {theme === 'light' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                 </button>
            </div>
             {searchError && <p className="text-red-500 text-sm -mt-4">{searchError}</p>}
            
            {/* Favorites */}
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300">Favorites</h2>
                    <button onClick={handleToggleFavorite} className={`transition-colors ${isCurrentFavorite ? "text-red-500" : "text-gray-400 dark:text-slate-400 hover:text-red-500"}`}>
                        <Heart className="w-6 h-6" isFavorite={isCurrentFavorite} />
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {favoriteCities.map(fav => (
                        <div key={fav.name} onClick={() => setCurrentCity(fav)} className="bg-white dark:bg-slate-800/50 p-3 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                            <MapPin className="w-5 h-5 text-sky-500" />
                            <span>{fav.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hourly Forecast */}
            <div>
                <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">Hourly Forecast</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {hourly && hourly.map((hour, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800/50 rounded-xl flex-shrink-0 text-center w-20">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</p>
                            <WeatherIcon code={hour.condition.icon} isDay={hour.is_day === 1} source={source} className="w-8 h-8"/>
                            <p className="text-lg font-semibold">{Math.round(hour.temp_c)}°</p>
                        </div>
                    ))}
                </div>
            </div>

             {/* Daily Forecast */}
             <div>
                <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">7-Day Forecast</h2>
                <div className="flex flex-col gap-3">
                     {forecast?.forecastday.map((day, index) => (
                        <div key={index} className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-3 rounded-lg">
                           <p className="font-semibold w-1/3">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                           <WeatherIcon code={day.day.condition.icon} isDay={true} source={source} className="w-8 h-8"/>
                           <p className="w-1/3 text-right"><span className="font-semibold">{Math.round(day.day.maxtemp_c)}°</span> / {Math.round(day.day.mintemp_c)}°</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sunrise & Sunset */}
            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-4">
                    <Sunrise className="w-8 h-8 text-yellow-500"/>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sunrise</p>
                        <p className="font-bold text-lg">{forecast?.forecastday?.[0].astro.sunrise}</p>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-4">
                    <Sunset className="w-8 h-8 text-orange-500"/>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sunset</p>
                        <p className="font-bold text-lg">{forecast?.forecastday?.[0].astro.sunset}</p>
                    </div>
                 </div>
            </div>

            {/* Unit Toggle */}
            <div className="mt-auto text-center">
                 <div className="inline-flex rounded-full bg-white dark:bg-slate-800/50 p-1">
                    <button onClick={() => setUnits('metric')} className={`px-4 py-1 rounded-full text-sm font-semibold ${units === 'metric' ? 'bg-sky-500 text-white' : 'text-slate-500'}`}>°C</button>
                    <button onClick={() => setUnits('imperial')} className={`px-4 py-1 rounded-full text-sm font-semibold ${units === 'imperial' ? 'bg-sky-500 text-white' : 'text-slate-500'}`}>°F</button>
                 </div>
            </div>
        </div>
    );
}

function AppContent({WEATHERAPI_KEY, OPENWEATHER_API_KEY, LOCATIONIQ_API_KEY}) {
    const { loading, error } = useContext(AppContext);
    const [showMessage, setShowMessage] = useState(false);
    
    useEffect(() => {
        if(error) {
            setShowMessage(true);
        }
    }, [error]);

    const handleCloseMessage = () => {
        setShowMessage(false);
    };

    return (
        <div className="bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
            <main className="min-h-screen w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=2832&auto=format&fit=crop')" }}>
                {loading && <LoadingSpinner />}
                {showMessage && <MessageBox message={error} onClose={handleCloseMessage} />}
                
                <div className={`min-h-screen w-full bg-black/30 dark:bg-slate-900/50 backdrop-blur-sm grid grid-cols-1 lg:grid-cols-3 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="lg:col-span-2 flex flex-col">
                        <MainWeatherDisplay />
                    </div>
                    <div className="lg:col-span-1 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10">
                        <SidePanel WEATHERAPI_KEY={WEATHERAPI_KEY} OPENWEATHER_API_KEY={OPENWEATHER_API_KEY} LOCATIONIQ_API_KEY={LOCATIONIQ_API_KEY} />
                    </div>
                </div>
            </main>
        </div>
    )
}

// --- MAIN APP COMPONENT ---
export default function App() {
    // API keys are defined here. Use your own keys.
    const WEATHERAPI_KEY = "5d4631a4118a4d65b4741506250809";
    const OPENWEATHER_API_KEY = "0d947102d717c574df8d1b71b05941dd";
    const LOCATIONIQ_API_KEY = "pk.375c7400029716887a010093a20998e1";
    return (
        <AppProvider>
            <AppContent WEATHERAPI_KEY={WEATHERAPI_KEY} OPENWEATHER_API_KEY={OPENWEATHER_API_KEY} LOCATIONIQ_API_KEY={LOCATIONIQ_API_KEY} />
        </AppProvider>
    );
}
