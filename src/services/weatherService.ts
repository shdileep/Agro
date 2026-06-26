
export interface WeatherData {
    current: {
        temp: number;
        humidity: number;
        description: string;
        icon: string;
        isDay: boolean;
        windSpeed: number;
    };
    hourly: Array<{
        time: string;
        temp: number;
        icon: string;
    }>;
    daily: Array<{
        day: string;
        maxTemp: number;
        minTemp: number;
        icon: string;
    }>;
    location: string;
    smartNote: string;
    farmingTip: {
        title: string;
        description: string;
        color: string; // 'green', 'amber', 'red'
        icon: string;
    };
}

// Map WMO codes to FontAwesome icons and descriptions
const getWeatherIcon = (code: number, isDay: number = 1): { icon: string; label: string } => {
    // 0: Clear sky
    if (code === 0) return { icon: isDay ? 'fa-sun' : 'fa-moon', label: 'Clear' };
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    if (code >= 1 && code <= 3) return { icon: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon', label: 'Partly Cloudy' };
    // 45, 48: Fog
    if (code === 45 || code === 48) return { icon: 'fa-smog', label: 'Foggy' };
    // 51, 53, 55: Drizzle
    if (code >= 51 && code <= 55) return { icon: 'fa-cloud-rain', label: 'Drizzle' };
    // 61, 63, 65: Rain
    if (code >= 61 && code <= 67) return { icon: 'fa-cloud-showers-heavy', label: 'Rain' };
    // 71-77: Snow
    if (code >= 71 && code <= 77) return { icon: 'fa-snowflake', label: 'Snow' };
    // 95-99: Thunderstorm
    if (code >= 95 && code <= 99) return { icon: 'fa-cloud-bolt', label: 'Thunderstorm' };

    return { icon: 'fa-cloud', label: 'Cloudy' };
};

const generateAgroSmartNote = (temp: number, humidity: number, code: number): string => {
    let note = "Conditions are stable. Good day for general maintenance.";

    if (code >= 95) note = "Dear Agro User, Heavy thunderstorms detected! Stop all field work immediately and seek shelter.";
    else if (code >= 61) note = "Dear Agro User, Rain is expected. Delay irrigation and ensure drainage channels are open.";
    else if (temp > 35) note = "Dear Agro User, Extreme heat conditions. Irrigate crops early morning or late evening to prevent water loss.";
    else if (humidity > 85 && temp > 25) note = "Dear Agro User, High humidity and heat detected. Watch out for fungal infections in crops.";
    else if (temp < 15) note = "Dear Agro User, Temperatures are dropping. Protect sensitive seedlings from frost.";
    else if (code === 0) note = "Dear Agro User, Clear skies ahead. excellent conditions for solar-powered equipment and spraying.";

    return note;
};

const generateFarmingTip = (temp: number, windSpeed: number, code: number) => {
    // Spraying Conditions
    if (windSpeed > 15) return { title: 'Avoid Spraying', description: 'High winds causes drift.', color: 'red', icon: 'fa-ban' };
    if (code >= 51) return { title: 'No Spraying', description: 'Rain will wash chemicals away.', color: 'red', icon: 'fa-cloud-rain' };
    if (temp > 30) return { title: 'Caution', description: 'Heat may evaporate sprays quickly.', color: 'amber', icon: 'fa-triangle-exclamation' };

    // Irrigation
    if (code === 0 && temp > 25) return { title: 'Ideal for Spraying', description: 'Calm winds and clear skies.', color: 'green', icon: 'fa-spray-can' };

    // General
    return { title: 'Good Conditions', description: 'Favorable for field observation.', color: 'green', icon: 'fa-check' };
};

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
        // 1. Fetch Weather Data (Open-Meteo) including windspeed now
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        // 2. Fetch Location Name (OpenStreetMap Nominatim)
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        // Extract city/town/village
        const address = geoData.address || {};
        const locationName = address.city || address.town || address.village || address.county || "Unknown Location";
        const state = address.state || "";
        const fullLocation = state ? `${locationName}, ${state}` : locationName;

        // 3. Process Data
        const currentHourIndex = new Date().getHours();

        // Ensure we handle day wrap-around for hourly forecast if needed, but Open-Meteo returns 7 days of hourly normally.
        // However, the standard call returns 0-168 hours starting from today 00:00.
        // So distinct index logic: The API `current` values are instantaneous. `hourly` array starts at 00:00 today.
        // So `currentHourIndex` corresponds exactly to the array index for today's hours.

        const hourlyStr = weatherData.hourly.temperature_2m.slice(currentHourIndex + 1, currentHourIndex + 13).map((temp: number, i: number) => {
            const index = currentHourIndex + 1 + i;
            const code = weatherData.hourly.weather_code[index];
            const timeDate = new Date();
            timeDate.setHours(currentHourIndex + 1 + i);
            timeDate.setMinutes(0);
            const timeStr = timeDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const hourOfDay = timeDate.getHours();
            const isDay = hourOfDay >= 6 && hourOfDay <= 18 ? 1 : 0; // Simple approximation for icon
            const { icon } = getWeatherIcon(code, isDay);
            return { time: timeStr, temp: Math.round(temp), icon };
        });

        // Daily: 
        // Open-Meteo returns today as index 0. If user says "Friday is completed", they mean if it's late Friday, show Saturday?
        // Usually daily forecast includes Today. I will keep Today as index 0 (Today, Tomorrow, etc.)
        // But verify the date string.

        const dailyStr = weatherData.daily.time.map((dateStr: string, i: number) => {
            const max = weatherData.daily.temperature_2m_max[i];
            const min = weatherData.daily.temperature_2m_min[i];
            const code = weatherData.daily.weather_code[i];
            const date = new Date(dateStr);
            const day = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
            const { icon } = getWeatherIcon(code);
            return { day, maxTemp: Math.round(max), minTemp: Math.round(min), icon };
        });

        const currentCode = weatherData.current.weather_code;
        const isDay = weatherData.current.is_day;
        const { icon, label } = getWeatherIcon(currentCode, isDay);
        const windSpeed = weatherData.current.wind_speed_10m;
        const temp = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;

        return {
            current: {
                temp: Math.round(temp),
                humidity: humidity,
                description: label,
                icon,
                isDay: !!isDay,
                windSpeed
            },
            hourly: hourlyStr,
            daily: dailyStr,
            location: fullLocation,
            smartNote: generateAgroSmartNote(temp, humidity, currentCode),
            farmingTip: generateFarmingTip(temp, windSpeed, currentCode)
        };

    } catch (error) {
        console.error("Weather Fetch Error:", error);
        throw error;
    }
};
