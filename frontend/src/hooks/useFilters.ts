import { useEffect, useState } from "react";
import type { CarFilterI, CategoryFilterI, TireFilterI, WeatherFilterI } from "../interfaces/filtersI";

export function useFilters() {
    const server = import.meta.env.VITE_BACKEND;
    const [categories, setCategories] = useState<CategoryFilterI[]>([]);
    const [cars, setCars] = useState<CarFilterI[]>([]);
    const [tires, setTires] = useState<TireFilterI[]>([]);
    const [weatherList, setWeatherList] = useState<WeatherFilterI[]>([]);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [carId, setCarId] = useState<number | null>(null);

    useEffect(() => {
        setCarId(null);
        setTires([]);
        fetch(server + "api/filters/categories")
            .then((res) => res.json())
            .then(setCategories);
    }, [server]);

    useEffect(() => {
        setCarId(null);
        setTires([]);
        if (categoryId == null) {
            setCars([]);
            return;
        }
        fetch(server + "api/filters/cars/" + categoryId)
            .then((res) => res.json())
            .then(setCars);
    }, [categoryId, server]);

    useEffect(() => {
        if (carId == null) {
            setTires([]);
            return;
        }
        fetch(server + "api/filters/tires/" + carId)
            .then((res) => res.json())
            .then(setTires);
    }, [carId, server]);

    useEffect(() => {
        fetch(server + "api/filters/weather")
            .then((res) => res.json())
            .then(setWeatherList);
    }, [server]);

    return {
        categories,
        cars,
        tires,
        weatherList,
        categoryId,
        setCategoryId,
        carId,
        setCarId,
    };
}
