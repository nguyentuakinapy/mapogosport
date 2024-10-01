interface WeatherData {
    main: {
        temp: number;
        humidity: number;
    };
    weather: {
        description: string;
    }[];
    name: string;
}