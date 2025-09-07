import React, { useState, useEffect, createContext, useContext } from 'react';

// --- SETUP & CONFIGURATION ---

// Tailwind CSS Script Injection
(() => {
  if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);
    
    // Configure Tailwind for Dark Mode
    tailwindScript.onload = () => {
      window.tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {},
        },
      };
    };
  }
})();

// App Context
const AppContext = createContext();

// App Provider to manage state and fetch data
const AppProvider = ({ children }) => {
    const [currentCity, setCurrentCity] = useState({ lat: 23.8103, lon: 90.4125, name: "Dhaka" });
    const [favoriteCities, setFavoriteCities] = useState([]);
    const [theme, setTheme] = useState('dark');
    const [units, setUnits] = useState('metric');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Replace with your actual API key
    const API_KEY = '0d947102d717c574df8d1b71b05941dd';

    useEffect(() => {
        // Load favorites from local storage on initial render
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteCities'));
        if (storedFavorites) {
            setFavoriteCities(storedFavorites);
        }

        // Apply theme to the document
        document.body.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        // Fetch weather data when city or units change
        const fetchWeatherData = async () => {
            setLoading(true);
            setError(null);
            
            if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
                setError('Please provide a valid OpenWeatherMap API key.');
                setLoading(false);
                return;
            }

            try {
                // Fetch current and forecast data
                const [currentRes, forecastRes] = await Promise.all([
                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${currentCity.lat}&lon=${currentCity.lon}&appid=${API_KEY}&units=${units}`),
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${currentCity.lat}&lon=${currentCity.lon}&appid=${API_KEY}&units=${units}`)
                ]);

                if (!currentRes.ok || !forecastRes.ok) {
                    throw new Error('Failed to load weather data.');
                }

                const currentData = await currentRes.json();
                const forecastData = await forecastRes.json();

                setWeatherData({ current: currentData, forecast: forecastData });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [currentCity, units, API_KEY]);

    // Save favorites to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    }, [favoriteCities]);

    const addFavorite = (city) => {
        if (!favoriteCities.some(fav => fav.name === city.name)) {
            setFavoriteCities([...favoriteCities, city]);
        }
    };

    const removeFavorite = (cityName) => {
        setFavoriteCities(favoriteCities.filter(fav => fav.name !== cityName));
    };

    const value = {
        currentCity, setCurrentCity, favoriteCities, addFavorite, removeFavorite,
        weatherData, loading, error, theme, setTheme, units, setUnits, API_KEY
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- SVG ICONS (Self-contained components) ---
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
const XIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

// A helper component to render the appropriate weather icon based on the icon code
const WeatherIcon = ({ code, className }) => {
    const iconMap = {
        '01d': <Sun className={className} />,
        '01n': <Moon className={className} />,
        '02d': <Cloud className={className} />,
        '02n': <Cloud className={className} />,
        '03d': <Cloud className={className} />,
        '03n': <Cloud className={className} />,
        '04d': <Cloud className={className} />,
        '04n': <Cloud className={className} />,
        '09d': <CloudRain className={className} />,
        '09n': <CloudRain className={className} />,
        '10d': <CloudDrizzle className={className} />,
        '10n': <CloudDrizzle className={className} />,
        '11d': <AlertTriangle className={className} />,
        '11n': <AlertTriangle className={className} />,
        '13d': <CloudSnow className={className} />,
        '13n': <CloudSnow className={className} />,
        '50d': <Cloud className={className} />,
        '50n': <Cloud className={className} />,
    };
    return iconMap[code] || <Cloud className={className} />;
};

// --- MAIN UI COMPONENTS ---
function MainWeatherDisplay() {
    const { weatherData, units, loading, error } = useContext(AppContext);

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <div className="loading-spinner w-16 h-16 border-sky-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-grow flex items-center justify-center text-center p-4">
                <p className="text-red-500 font-bold">{error}</p>
            </div>
        );
    }
    
    if (!weatherData) return null;

    const current = weatherData.current;
    const forecast = weatherData.forecast;

    const todayForecasts = forecast.list.filter(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getDate() === new Date().getDate();
    });
    
    const maxTempToday = todayForecasts.length > 0 ? Math.max(...todayForecasts.map(item => item.main.temp_max)) : current.main.temp_max;
    const minTempToday = todayForecasts.length > 0 ? Math.min(...todayForecasts.map(item => item.main.temp_min)) : current.main.temp_min;

    return (
        <div className="flex-grow flex flex-col p-6 md:p-8 text-white dark:text-gray-100">
            {/* Top Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">{current.name}</h1>
                    <p className="text-gray-400 dark:text-gray-400">{new Date(current.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg">{Math.round(maxTempToday)}° / {Math.round(minTempToday)}°</p>
                    <p className="text-sm text-gray-400 dark:text-gray-400 capitalize">{current.weather[0].description}</p>
                </div>
            </div>

            {/* Main Temp & Icon */}
            <div className="my-auto flex flex-col items-center text-center">
                 <WeatherIcon code={current.weather[0].icon} className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-lg" />
                 <p className="text-7xl sm:text-8xl font-extrabold tracking-tighter">{Math.round(current.main.temp)}°<span className="text-5xl align-top font-light">{units === 'metric' ? 'C' : 'F'}</span></p>
            </div>
            
            {/* Details Grid */}
            <div className="mt-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white/10 dark:bg-black/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Feels Like</p>
                    <p className="text-xl font-bold">{Math.round(current.main.feels_like)}°</p>
                </div>
                <div className="bg-white/10 dark:bg-black/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Humidity</p>
                    <p className="text-xl font-bold">{current.main.humidity}%</p>
                </div>
                 <div className="bg-white/10 dark:bg-black/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Wind Speed</p>
                    <p className="text-xl font-bold">{Math.round(current.wind.speed)} {units === 'metric' ? 'm/s' : 'mph'}</p>
                </div>
                 <div className="bg-white/10 dark:bg-black/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Pressure</p>
                    <p className="text-xl font-bold">{current.main.pressure} hPa</p>
                 </div>
            </div>
        </div>
    );
}

function SidePanel() {
    const { favoriteCities, setCurrentCity, weatherData, addFavorite, removeFavorite, theme, setTheme, units, setUnits, API_KEY } = useContext(AppContext);
    const [input, setInput] = useState('');
    const [searchError, setSearchError] = useState('');
    
    if (!weatherData) return null;
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setSearchError('');
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${API_KEY}`);
            if (!response.ok) throw new Error("Could not find location.");
            const data = await response.json();
            if (data.length > 0) {
                const city = { name: data[0].name, lat: data[0].lat, lon: data[0].lon };
                setCurrentCity(city);
                setInput('');
            } else {
                setSearchError("City not found.");
            }
        } catch (err) {
            setSearchError(err.message);
        }
    };
    
    const isCurrentFavorite = favoriteCities.some(fav => fav.name === current.name);

    const handleToggleFavorite = () => {
        const city = { name: current.name, lat: current.coord.lat, lon: current.coord.lon };
        if (isCurrentFavorite) removeFavorite(city.name);
        else addFavorite(city);
    };

    // Calculate daily forecasts from 3-hour forecast data
    const dailyForecasts = {};
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                min: item.main.temp_min,
                max: item.main.temp_max,
                icon: item.weather[0].icon,
                dt: item.dt
            };
        } else {
            dailyForecasts[date].min = Math.min(dailyForecasts[date].min, item.main.temp_min);
            dailyForecasts[date].max = Math.max(dailyForecasts[date].max, item.main.temp_max);
        }
    });

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
                        <div key={fav.name} onClick={() => setCurrentCity(fav)} className="bg-white dark:bg-slate-800/50 p-3 rounded-lg flex justify-between items-center gap-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-4">
                                <MapPin className="w-5 h-5 text-sky-500" />
                                <span>{fav.name}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); removeFavorite(fav.name); }} className="text-gray-500 hover:text-red-500">
                                <XIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hourly Forecast */}
            <div>
                <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">Hourly Forecast</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {forecast.list.slice(0, 8).map((hour, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800/50 rounded-xl flex-shrink-0 text-center w-20">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</p>
                            <WeatherIcon code={hour.weather[0].icon} className="w-8 h-8"/>
                            <p className="text-lg font-semibold">{Math.round(hour.main.temp)}°</p>
                        </div>
                    ))}
                </div>
            </div>

             {/* Daily Forecast */}
             <div>
                <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">7-Day Forecast</h2>
                <div className="flex flex-col gap-3">
                     {Object.values(dailyForecasts).slice(1, 8).map((day, index) => (
                        <div key={index} className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-3 rounded-lg">
                           <p className="font-semibold w-1/3">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                           <WeatherIcon code={day.icon} className="w-8 h-8"/>
                           <p className="w-1/3 text-right"><span className="font-semibold">{Math.round(day.max)}°</span> / {Math.round(day.min)}°</p>
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
                        <p className="font-bold text-lg">{new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-4">
                    <Sunset className="w-8 h-8 text-orange-500"/>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sunset</p>
                        <p className="font-bold text-lg">{new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
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

// Main App component that renders the UI
function AppContent() {
    return (
        <div className="bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
            <main className="min-h-screen w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=2832&auto=format&fit=crop')" }}>
                <div className={`min-h-screen w-full bg-black/30 dark:bg-slate-900/50 backdrop-blur-sm grid grid-cols-1 lg:grid-cols-3`}>
                    <div className="lg:col-span-2 flex flex-col">
                        <MainWeatherDisplay />
                    </div>
                    <div className="lg:col-span-1 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10">
                        <SidePanel />
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- MAIN REACT APPLICATION ENTRY POINT ---
export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
