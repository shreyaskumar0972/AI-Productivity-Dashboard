import { useEffect, useState } from "react";

function getWeatherInfo(code) {
    if (code === 0) return ["☀️", "Clear sky"];
    if ([1, 2].includes(code)) return ["🌤️", "Partly cloudy"];
    if (code === 3) return ["☁️", "Overcast"];
    if ([45, 48].includes(code)) return ["🌫️", "Foggy"];
    if ([51, 53, 55, 56, 57].includes(code)) return ["🌦️", "Drizzle"];
    if ([61, 63, 65, 66, 67].includes(code)) return ["🌧️", "Rain"];
    if ([71, 73, 75, 77].includes(code)) return ["❄️", "Snow"];
    if ([80, 81, 82].includes(code)) return ["🌦️", "Rain showers"];
    if ([95, 96, 99].includes(code)) return ["⛈️", "Thunderstorm"];

    return ["🌡️", "Unknown"];
}

function Weather() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadWeather() {
            try {
                const latitude = 31.224;
                const longitude = 75.77;

                const url =
                    `https://api.open-meteo.com/v1/forecast` +
                    `?latitude=${latitude}` +
                    `&longitude=${longitude}` +
                    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
                    `&timezone=Asia%2FKolkata`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Weather request failed");
                }

                const data = await response.json();

                setWeather(data.current);
            } catch (error) {
                console.error(error);
                setError(true);
            }
        }

        loadWeather();
    }, []);

    if (error) {
        return (
            <section className="panel">
                <h2>Weather</h2>
                <p>Unable to load weather.</p>
            </section>
        );
    }

    if (!weather) {
        return (
            <section className="panel">
                <h2>Weather</h2>
                <p>Loading weather...</p>
            </section>
        );
    }

    const [icon, description] =
        getWeatherInfo(weather.weather_code);

    return (
        <section className="panel">
            <h2>Weather</h2>

            <div className="weather-temperature">
                {Math.round(weather.temperature_2m)}°C {icon}
            </div>

            <p>Phagwara, Punjab</p>

            <div className="weather-details">
                <span>
                    Feels like {Math.round(weather.apparent_temperature)}°C
                </span>

                <span>
                    Humidity {weather.relative_humidity_2m}%
                </span>
            </div>

            <p>{description}</p>
        </section>
    );
}

export default Weather;