import React, { useState, useEffect, createContext, useContext } from 'react';
import { FaGithub, FaLinkedin, FaMailBulk } from 'react-icons/fa';

// --- SETUP & CONFIGURATION ---

// This code loads the Tailwind CSS framework and configures dark mode for the application.
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

// This hook saves and retrieves app states from local storage to ensure data persistence.
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item === null || item === 'undefined' || item === '') {
                return initialValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error(error);
            if (typeof initialValue === 'string' && item !== null && item !== 'undefined' && item !== '') {
                return item;
            }
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
// This section contains SVG icon components for various weather conditions and UI elements.
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
const Locate = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h3"></path><path d="M19 12h3"></path><path d="M12 2v3"></path><path d="M12 19v3"></path><circle cx="12" cy="12" r="7"></circle></svg>;
const ArrowUp = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>;
const Github = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.111.819-.258.819-.576 0-.288-.01-1.054-.015-2.075-3.336.724-4.042-1.61-4.042-1.61-.542-1.359-1.323-1.72-1.323-1.72-1.111-.762.084-.746.084-.746 1.23.085 1.87 1.264 1.87 1.264 1.089 1.865 2.864 1.323 3.567 1.01.112-.789.426-1.323.774-1.628-2.718-.31-5.581-1.358-5.581-6.04 0-1.332.474-2.426 1.252-3.273-.124-.31-.541-1.554.118-3.227 0 0 1.02-.328 3.331 1.25.969-.268 2-.401 3-.406 2.31-1.578 3.328-1.25 3.328-1.25.659 1.673.242 2.917.118 3.227.777.847 1.252 1.94 1.252 3.273 0 4.692-2.868 5.727-5.592 6.035.437.375.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.286 0 .315.216.691.825.572 4.767-1.586 8.201-6.087 8.201-11.385C24 5.373 18.627 0 12 0Z" /></svg>;
const Linkedin = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM4 21h4V8H4zM6 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>;
const Mail = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M2.5 4h19c.8 0 1.5.7 1.5 1.5v15c0 .8-.7 1.5-1.5 1.5h-19c-.8 0-1.5-.7-1.5-1.5v-15c0-.8.7-1.5 1.5-1.5zm.5 2.5v12.5h18v-12.5l-9 6-9-6z" /></svg>;
const PoweredBy = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2A10 10 0 1 0 12 22A10 10 0 1 0 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" /></svg>;

// --- CONTEXT & PROVIDERS ---
// This React Context is used to pass application states to different components.
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const WEATHERAPI_KEY = "5d4631a4118a4d65b4741506250809";
    const OPENWEATHER_API_KEY = "0d947102d717c574df8d1b71b05941dd";
    const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

    const [currentCity, setCurrentCity] = useLocalStorage('currentCity', { name: "Bogra", lat: 24.8465, lon: 89.3757 });
    const [favoriteCities, setFavoriteCities] = useLocalStorage('favoriteCities', [{ name: "London" }]);
    const [theme, setTheme] = useLocalStorage('theme', 'dark');
    const [units, setUnits] = useLocalStorage('units', 'metric');

    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    const [showMapModal, setShowMapModal] = useState(false);
    const [mapData, setMapData] = useState(null);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    useEffect(() => {
        const fetchWeatherWithFallback = async () => {
            setLoading(true);
            setError(null);

            // Attempt to fetch data from WeatherAPI.com first.
            try {
                const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${currentCity.lat},${currentCity.lon}&days=7`;
                const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentCity.lat}&lon=${currentCity.lon}&appid=${OPENWEATHER_API_KEY}`;

                const [weatherResponse, airPollutionResponse] = await Promise.all([
                    fetch(weatherUrl),
                    fetch(airPollutionUrl)
                ]);

                if (!weatherResponse.ok) {
                    throw new Error("WeatherAPI.com failed to fetch data. Trying OpenWeatherMap...");
                }

                const weatherData = await weatherResponse.json();
                const airPollutionData = airPollutionResponse.ok ? await airPollutionResponse.json() : null;

                const getAQI = (data) => {
                    if (!data || !data.list || data.list.length === 0) return "N/A";
                    const aqi = data.list[0].main.aqi;
                    switch (aqi) {
                        case 1: return "Good";
                        case 2: return "Fair";
                        case 3: return "Moderate";
                        case 4: return "Poor";
                        case 5: return "Very Poor";
                        default: return "N/A";
                    }
                };

                // Converting data from WeatherAPI.com to a standardized format.
                const formattedData = {
                    location: weatherData.location,
                    current: weatherData.current,
                    forecast: weatherData.forecast,
                    hourly: weatherData.forecast.forecastday[0].hour,
                    aqi: getAQI(airPollutionData),
                    source: 'weatherapi'
                };
                setWeatherData(formattedData);

            } catch (err) {
                console.error("Primary API failed:", err);

                // Falling back to OpenWeatherMap API if the primary API fails.
                try {
                    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity.name}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
                    const openWeatherResponse = await fetch(openWeatherUrl);

                    if (!openWeatherResponse.ok) {
                        throw new Error("OpenWeatherMap also failed. Could not fetch data.");
                    }

                    const openWeatherData = await openWeatherResponse.json();

                    // Converting data from OpenWeatherMap to a standardized format.
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
                        hourly: openWeatherData.list.slice(0, 24).map(item => ({
                            time: item.dt_txt,
                            is_day: 1, // Placeholder
                            condition: {
                                icon: item.weather[0].icon,
                                text: item.weather[0].description
                            },
                            temp_c: item.main.temp
                        })),
                        aqi: "N/A", // OpenWeatherMap's pollution API requires separate call
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

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const geocodeUrl = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                    fetch(geocodeUrl)
                        .then(res => res.json())
                        .then(data => {
                            const cityName = data.address.city || data.address.town || data.address.village || data.address.country;
                            if (cityName) {
                                setCurrentCity({ name: cityName, lat: latitude, lon: longitude });
                            }
                        })
                        .catch(err => console.error("Geolocation reverse geocoding failed", err));
                },
                (err) => {
                    console.error("Geolocation permission denied or failed:", err);
                    // Fallback to default city if geolocation fails
                    setCurrentCity({ name: "Bogra", lat: 24.8465, lon: 89.3757 });
                }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
            // Fallback to default city if geolocation is not supported
            setCurrentCity({ name: "Bogra", lat: 24.8465, lon: 89.3757 });
        }
    }, []);

    const addFavorite = (city) => {
        if (!favoriteCities.some(fav => fav.name === city.name)) {
            setFavoriteCities([...favoriteCities, city]);
        }
    };
    const removeFavorite = (cityName) => setFavoriteCities(favoriteCities.filter(fav => fav.name !== cityName));

    const value = {
        currentCity, setCurrentCity, favoriteCities, addFavorite, removeFavorite, weatherData, loading, error, theme, setTheme, units, setUnits, WEATHERAPI_KEY, OPENWEATHER_API_KEY, NOMINATIM_BASE_URL,
        showMapModal, setShowMapModal, mapData, setMapData
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- HELPER & CHILD COMPONENTS ---
const WeatherIcon = ({ code, className, isDay, source }) => {
    if (source === 'weatherapi') {
        const iconUrl = `https:${code}`;
        return <img src={iconUrl} alt="Weather icon" className={className} />;
    }
    else {
        // A custom mapping is added for OpenWeatherMap icons to render them correctly.
        const iconMapping = {
            '01d': <Sun className={className} />,
            '01n': <Moon className={className} />,
            '02d': <Cloud className={className} />,
            '02n': <Cloud className={className} />,
            '03d': <Cloud className={className} />,
            '03n': <Cloud className={className} />,
            '04d': <Cloud className={className} />,
            '04n': <Cloud className={className} />,
            '09d': <CloudDrizzle className={className} />,
            '09n': <CloudDrizzle className={className} />,
            '10d': <CloudRain className={className} />,
            '10n': <CloudRain className={className} />,
            '11d': <AlertTriangle className={className} />,
            '11n': <AlertTriangle className={className} />,
            '13d': <CloudSnow className={className} />,
            '13n': <CloudSnow className={className} />,
            '50d': <Cloud className={className} />,
            '50n': <Cloud className={className} />,
        };
        return iconMapping[code] || <Cloud className={className} />;
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

const MapModal = ({ show, onClose, data }) => {
    if (!show) return null;

    // Checks if the data object is null before attempting to destructure it.
    if (!data) return null;

    const { location, current } = data;
    const { OPENWEATHER_API_KEY } = useContext(AppContext);

    // A useRef is used here to initialize the Leaflet map.
    const mapRef = React.useRef(null);

    React.useEffect(() => {
        if (mapRef.current) {
            // Check if the Leaflet library (L) is globally available before using it.
            if (window.L) {
                const L = window.L;
                const mapElement = mapRef.current;

                // If a map instance already exists, it is removed to prevent duplicates.
                if (mapElement.leafletElement) {
                    mapElement.leafletElement.remove();
                }

                const map = L.map(mapElement).setView([location.lat, location.lon], 10);
                mapElement.leafletElement = map; // Store the map instance

                // The OpenStreetMap tile layer is added to the map.
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // The OpenWeatherMap temperature tile layer is added to the map.
                L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=' + OPENWEATHER_API_KEY, {
                    attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                }).addTo(map);
            } else {
                console.error("Leaflet library (L) is not available.");
            }
        }
    }, [location, OPENWEATHER_API_KEY]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-xl max-w-2xl mx-auto w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-gray-100">{location.name}</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                    <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Current Temp</p>
                        <p className="text-2xl font-bold">{Math.round(current.temp_c)}°C</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Condition</p>
                        <p className="text-2xl font-bold capitalize">{current.condition.text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN UI COMPONENTS ---
function MainWeatherDisplay() {
    const { weatherData, units } = useContext(AppContext);
    if (!weatherData) return <div className="flex-grow flex items-center justify-center"><p>No weather data available.</p></div>;

    const { location, current, forecast } = weatherData;
    const isDay = current.is_day === 1;
    const today = forecast?.forecastday?.[0];
    const source = weatherData.source || 'weatherapi';

    const getBackgroundClass = (conditionText, isDay) => {
        const text = conditionText.toLowerCase();
        if (text.includes('sunny') || text.includes('clear')) {
            return isDay ? 'bg-gradient-to-br from-blue-300 via-blue-400 to-sky-500' : 'bg-gradient-to-br from-gray-900 via-slate-800 to-slate-900';
        }
        if (text.includes('rain') || text.includes('drizzle')) {
            return 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
        }
        if (text.includes('snow') || text.includes('sleet')) {
            return 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400';
        }
        if (text.includes('cloud')) {
            return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
        }
        return 'bg-cover bg-center'; // Default background
    };

    return (
        <div className={`flex-grow flex flex-col p-6 md:p-8 text-white dark:text-gray-100 transition-all duration-500 ${getBackgroundClass(current.condition.text, isDay)}`} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=2832&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 md:p-10 flex flex-col flex-grow">
                {/* Top Header */}
                <div className="flex justify-between items-start mb-auto">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">{location.name}</h1>
                        <p className="text-gray-400 dark:text-gray-400 mt-2 text-sm md:text-base drop-shadow-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg drop-shadow-lg">{Math.round(today?.day.maxtemp_c)}° / {Math.round(today?.day.mintemp_c)}°</p>
                        <p className="text-sm text-gray-400 dark:text-gray-400 capitalize drop-shadow-lg">{current.condition.text}</p>
                    </div>
                </div>

                {/* Main Temp & Icon */}
                <div className="my-auto flex flex-col items-center text-center">
                    <WeatherIcon code={current.condition.icon} isDay={isDay} source={source} className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-lg" />
                    <p className="text-7xl sm:text-8xl font-extrabold tracking-tighter drop-shadow-lg">{Math.round(current.temp_c)}°<span className="text-5xl align-top font-light">C</span></p>
                </div>

                {/* Details Grid */}
                <div className="mt-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm md:text-base">
                    <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl backdrop-blur-lg">
                        <p className="text-sm text-gray-400">Feels Like</p>
                        <p className="text-xl font-bold">{Math.round(current.feelslike_c)}°</p>
                    </div>
                    <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl backdrop-blur-lg">
                        <p className="text-sm text-gray-400">Humidity</p>
                        <p className="text-xl font-bold">{current.humidity}%</p>
                    </div>
                    <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl backdrop-blur-lg">
                        <p className="text-sm text-gray-400">Wind Speed</p>
                        <p className="text-xl font-bold">{current.wind_kph} kph</p>
                    </div>
                    <div className="bg-black/20 dark:bg-white/10 p-4 rounded-xl backdrop-blur-lg">
                        <p className="text-sm text-gray-400">UV Index</p>
                        <p className="text-xl font-bold">{current.uv || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidePanel() {
    const { favoriteCities, setCurrentCity, weatherData, addFavorite, removeFavorite, theme, setTheme, units, setUnits, setShowMapModal, setMapData, NOMINATIM_BASE_URL } = useContext(AppContext);
    const [input, setInput] = useState('');
    const [searchError, setSearchError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    // Check if weatherData is null before destructuring
    if (!weatherData) return null;

    const { location, current, forecast, hourly } = weatherData;
    const source = weatherData.source || 'weatherapi';

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setSearchError('');
        setSuggestions([]);
        try {
            const geoUrl = `${NOMINATIM_BASE_URL}/search?q=${input}&format=json&limit=1`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            if (geoData.length > 0) {
                const { display_name, lat, lon } = geoData[0];
                const city = { name: display_name.split(',')[0], lat, lon };
                setCurrentCity(city);
                setInput('');
            } else {
                throw new Error("City not found.");
            }
        } catch (err) {
            setSearchError(err.message);
        }
    };

    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const url = `${NOMINATIM_BASE_URL}/search?q=${query}&format=json&limit=5`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Could not fetch suggestions.");
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Suggestion fetch failed:", error);
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setInput(query);
        fetchSuggestions(query);
    };

    const handleSuggestionClick = (suggestion) => {
        const city = { name: suggestion.display_name.split(',')[0], lat: suggestion.lat, lon: suggestion.lon };
        setCurrentCity(city);
        setInput('');
        setSuggestions([]);
    };

    const handleMyLocateClick = async () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapData({ location: { lat: latitude, lon: longitude, name: "Your Location" }, current: weatherData.current });
                    // Modal removed, now fetches and displays weather directly
                    setCurrentCity({ name: "Your Location", lat: latitude, lon: longitude });
                },
                (err) => {
                    console.error("Geolocation permission denied or failed:", err);
                    setShowErrorMessage(true); // show message box instead of alert
                }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
            setShowErrorMessage(true); // show message box instead of alert
        }
    };

    const handleCloseErrorMessage = () => {
        setShowErrorMessage(false);
    };

    const isCurrentFavorite = favoriteCities.some(fav => fav.name === location.name);

    const handleToggleFavorite = () => {
        const city = { name: location.name, lat: location.lat, lon: location.lon };
        if (isCurrentFavorite) removeFavorite(city.name);
        else addFavorite(city);
    };

    return (
        <div className="bg-gray-100 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 text-slate-800 dark:text-gray-100 h-full flex flex-col gap-6 overflow-y-auto">
            {showErrorMessage && <MessageBox message="Geolocation permission denied or not supported." onClose={handleCloseErrorMessage} />}
            {/* Header */}
            <div className="flex justify-between items-center relative">
                <form onSubmit={handleSearch} className="relative flex-grow">
                    <input type="text" value={input} onChange={handleInputChange} placeholder="Search for a city..." className="w-full bg-white/50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"><Search className="w-5 h-5" /></button>
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                            {suggestions.map((s, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(s)} className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                    {s.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="ml-4 p-2 rounded-full bg-white/50 dark:bg-slate-800/50">
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
            </div>
            {searchError && <p className="text-red-500 text-sm -mt-4">{searchError}</p>}

            {/* My Location Button */}
            <button onClick={handleMyLocateClick} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors">
                <Locate className="w-5 h-5" /> My Location
            </button>

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
                            <WeatherIcon code={hour.condition.icon} isDay={hour.is_day === 1} source={source} className="w-8 h-8" />
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
                            <WeatherIcon code={day.day.condition.icon} isDay={true} source={source} className="w-8 h-8" />
                            <p className="w-1/3 text-right"><span className="font-semibold">{Math.round(day.day.maxtemp_c)}°</span> / {Math.round(day.day.mintemp_c)}°</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sunrise & Sunset */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-4">
                    <Sunrise className="w-8 h-8 text-yellow-500" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sunrise</p>
                        <p className="font-bold text-lg">{forecast?.forecastday?.[0].astro.sunrise}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-4">
                    <Sunset className="w-8 h-8 text-orange-500" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sunset</p>
                        <p className="font-bold text-lg">{forecast?.forecastday?.[0].astro.sunset}</p>
                    </div>
                </div>
            </div>

            {/* Air Quality Index */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">Air Quality</p>
                <p className="text-xl font-bold">{weatherData.aqi}</p>
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

// This is the Footer component which displays the current time and social links.
const Footer = () => {
    const [time, setTime] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // This effect updates the clock every second.
    useEffect(() => {
        const formatter = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
        const updateClock = () => setTime(formatter.format(new Date()));
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    // This effect detects scroll position to show/hide the scroll-to-top button.
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // This function scrolls the page smoothly to the top.
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const socials = [
        { href: "https://github.com/yousufali156", icon: <FaGithub className="w-7 h-7" />, label: "GitHub" },
        { href: "https://www.linkedin.com/in/yousufali156", icon: <FaLinkedin className="w-7 h-7" />, label: "LinkedIn" },
        { href: "mailto:mdyousufali.dev@gmail.com", icon: <FaMailBulk className="w-7 h-7" />, label: "Email" },
    ];

    return (
        <>
            {/* Footer */}
            <footer className="relative py-16 overflow-hidden text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-slate-900">
                {/* Pattern Layer */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />

                <div className="relative max-w-6xl mx-auto px-4 text-center">
                    {/* Logo + Name & Title Section (Responsive) */}
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8 mb-8 group">
                        {/* Logo with gradient glow + hover rotate */}
                        <div className="relative p-[2px] rounded-full bg-gradient-to-r from-purple-500 via-blue-600 to-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                            <img
                                src="/yousuf-logo.png"
                                alt="Yousuf Logo"
                                className="h-20 w-20 rounded-full object-contain border-2 border-black 
                transition-all duration-500 ease-in-out 
                group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] logo-hover-rotate animate-spin-slow"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://i.ibb.co/wFRM3C9W/Yousuf-Ali-Web-Developer.png";
                                }}
                            />
                        </div>

                        {/* Name & Title */}
                        <div className="text-center md:text-left group">
                            {/* Main Name */}
                            <h2
                                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent 
      bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
      relative bg-[length:200%_auto] animate-gradient-pan drop-shadow-[0_0_10px_rgba(255,182,193,0.7)]
      transition-all duration-500"
                            >
                                MD. YOUSUF ALI
                                {/* Underline Animation */}
                                <span
                                    className="absolute bottom-0 left-0 w-full h-[3px] rounded-full
        bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
        scale-x-0 group-hover:scale-x-100
        transition-transform duration-500 ease-out origin-left"
                                ></span>
                            </h2>

                            {/* Subtitle */}
                            <p className="mt-2 text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 drop-shadow-[0_0_5px_rgba(255,182,193,0.5)]">
                                MERN Stack Front-end Developer
                            </p>

                            {/* Gradient Animation */}
                            <style>
                                {`
                                    @keyframes gradient-pan {
                                    0% { background-position: 0% center; }
                                    50% { background-position: 100% center; }
                                    100% { background-position: 0% center; }
                                    }
                                    .animate-gradient-pan {
                                    animation: gradient-pan 6s linear infinite;
                                    }
                                `}
                            </style>
                        </div>

                        {/* Animations */}
                        <style>{`
                                    @keyframes gradient-pan {
                                        0% { background-position: 0% center; }
                                        100% { background-position: 200% center; }
                                    }

                                    @keyframes bounce-rotate {
                                        0% { transform: rotate(0deg) scale(1); }
                                        80% { transform: rotate(350deg) scale(1.1); }
                                        100% { transform: rotate(360deg) scale(1); }
                                    }

                                    .group:hover .logo-hover-rotate {
                                        animation: bounce-rotate 0.8s ease-in-out;
                                    }
                             `}
                        </style>

                    </div>


                    {/* Social Buttons (Responsive Spacing) */}
                    <div className="flex justify-center space-x-4 sm:space-x-6 mb-10">
                        {socials.map(({ href, icon, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-md 
                                border border-white/20 text-2xl shadow-lg 
                                hover:scale-125 hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-500"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>

                    {/* Clock Section (Responsive) */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg sm:text-xl font-semibold mb-10">
                        <span>Current Time:</span>
                        <span
                            id="footer-clock"
                            className="px-4 py-2 rounded-lg font-mono text-green-400 backdrop-blur-lg border border-green-400/40 
                             shadow-[0_0_15px_#00ffcc,0_0_40px_#00ffcc] animate-pulse"
                        >
                            {time}
                        </span>
                    </div>

                    {/* Footer Text (Responsive) */}
                    <div className="border-t border-white/20 pt-6 text-sm sm:text-base">
                        <p>
                            © {new Date().getFullYear()}{" "}
                            <span className="font-semibold text-purple-400">
                                Md. Yousuf Ali
                            </span>{" "}
                            - Crafted for the Weather Dashboard project.
                        </p>
                        <div className="flex justify-center items-center mt-2 text-sm text-gray-400">
                            <PoweredBy className="w-4 h-4 mr-2" /> Powered by OpenWeatherMap
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to top button (Cleaned up) */}
            <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className={`fixed bottom-6 right-6 z-50 flex items-center justify-center 
                    rounded-full backdrop-blur-md border border-white/30
                    p-3 shadow-lg transition-all duration-300 
                    hover:scale-110 hover:shadow-[0_0_25px_rgba(255,0,200,0.8)] hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500
                    ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}`}
            >
                <ArrowUp className="w-6 h-6 font-bold" />
            </button>

            {/* Custom Animation */}
            <style>{`
                    @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                    }
      `}</style>
        </>
    );
};

function AppContent() {
    const { loading, error } = useContext(AppContext);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (error) {
            setShowMessage(true);
        }
    }, [error]);

    const handleCloseMessage = () => {
        setShowMessage(false);
    };

    return (
        <div className="bg-base-300 font-sans transition-colors duration-300">
            <main className="min-h-screen w-full bg-cover bg-center relative">
                {loading && <LoadingSpinner />}
                {showMessage && <MessageBox message={error} onClose={handleCloseMessage} />}

                <div className={`min-h-screen w-full  backdrop-blur-sm grid grid-cols-1 lg:grid-cols-3 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="lg:col-span-2 flex flex-col">
                        <MainWeatherDisplay />
                    </div>
                    <div className="lg:col-span-1 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10">
                        <SidePanel />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}


// --- MAIN APP COMPONENT ---
export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
