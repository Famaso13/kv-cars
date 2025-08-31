import Header from "../../components/Header/Header";
import "./trackLeaderboard.scss";
import { useParams } from "react-router-dom";
import LeaderboardListings from "../../components/LeaderboardListings/LeaderboardListings";
import FormInput from "../../components/FormInput/FormInput";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import type { TrackI } from "../../interfaces/tracksI";
import type { CarFilterI, CategoryFilterI, TireFilterI, WeatherFilterI } from "../../interfaces/filtersI";

const TrackLeaderboard = () => {
    const server = import.meta.env.VITE_BACKEND;
    const { id } = useParams<{ id: string }>();
    const trackIdNum = id ? Number(id) : NaN;
    const [track, setTrack] = useState<TrackI>({} as TrackI);
    const [apply, setApply] = useState(0);

    useEffect(() => {
        const fetchTrackById = async (id: number) => {
            let response = (await fetch(server + "api/tracks/" + id)) as Response;
            if (response.status == 200) {
                setTrack(JSON.parse(await response.text()) as TrackI);
            }
        };

        fetchTrackById(trackIdNum);
    }, [trackIdNum, server]);

    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [carId, setCarId] = useState<number | null>(null);
    const [tireId, setTireId] = useState<number | null>(null);
    const [weather, setWeather] = useState<string | null>(null);
    const [dateISO, setDateISO] = useState<string | null>(null);

    const [categories, setCategories] = useState<CategoryFilterI[]>([]);
    const [cars, setCars] = useState<CarFilterI[]>([]);
    const [tires, setTires] = useState<TireFilterI[]>([]);
    const [weatherList, setWeatherList] = useState<WeatherFilterI[]>([]);

    useEffect(() => {
        setCarId(null);
        setTireId(null);
        setTires([]);
        const fetchCategories = async () => {
            let response = (await fetch(server + "api/filters/categories")) as Response;
            if (response.status == 200) {
                let data = JSON.parse(await response.text()) as Array<CategoryFilterI>;
                setCategories(data);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setCarId(null);
        setTireId(null);
        setTires([]);
        if (categoryId == null) {
            setCars([]);
            return;
        }
        const fetchCars = async (categoryId: number | null) => {
            let response = (await fetch(server + "api/filters/cars/" + categoryId)) as Response;
            if (response.status == 200) {
                let data = JSON.parse(await response.text()) as Array<CarFilterI>;
                setCars(data);
            }
        };
        fetchCars(categoryId);
    }, [categoryId]);

    useEffect(() => {
        setTireId(null);
        if (carId == null) {
            setTires([]);
            return;
        }
        const fetchTires = async (carId: number | null) => {
            let response = (await fetch(server + "api/filters/tires/" + carId)) as Response;
            if (response.status == 200) {
                let data = JSON.parse(await response.text()) as Array<TireFilterI>;
                setTires(data);
            }
        };
        fetchTires(categoryId);
    }, [carId]);

    useEffect(() => {
        const fetchWeather = async (trackId: number | null) => {
            let response = (await fetch(server + "api/filters/weather/" + trackId)) as Response;
            if (response.status == 200) {
                let data = JSON.parse(await response.text()) as Array<WeatherFilterI>;
                setWeatherList(data);
            }
        };
        fetchWeather(trackIdNum);
    }, []);

    const onChangeCategory = (val: string) => setCategoryId(val ? Number(val) : null);
    const onChangeCar = (val: string) => setCarId(val ? Number(val) : null);
    const onChangeTire = (val: string) => setTireId(val ? Number(val) : null);
    const onChangeWeather = (val: string) => setWeather(val || null);
    const onChangeDate = (val: string) => setDateISO(val || null);

    const onClear = () => {
        setCategoryId(null);
        setCarId(null);
        setTireId(null);
        setWeather(null);
        applyFilters();
    };

    const applyFilters = () => {
        setApply((t) => t + 1);
    };

    return (
        <div>
            <Header loggedIn={true} currentPage="leaderboard" />
            <div className="full-screen">
                <div className="leaderboard-filters">
                    <h2>Data filters</h2>
                    <FormInput
                        label="Category"
                        array={categories}
                        type="select"
                        width={"80%"}
                        value={categoryId?.toString() ?? ""}
                        light
                        onChange={onChangeCategory}
                    />
                    <FormInput
                        label="Cars"
                        array={cars}
                        type="select"
                        value={carId?.toString() ?? ""}
                        light
                        width={"80%"}
                        onChange={onChangeCar}
                    />
                    <FormInput
                        label="Tires"
                        array={tires}
                        type="select"
                        value={tireId?.toString() ?? ""}
                        light
                        width={"80%"}
                        onChange={onChangeTire}
                    />
                    <FormInput
                        label="Weather"
                        array={weatherList}
                        type="select"
                        light
                        width={"80%"}
                        onChange={onChangeWeather}
                    />
                    <FormInput label="Date" type="date" light width={"80%"} onChange={onChangeDate} />
                    <Button label="Apply Filters" onClick={applyFilters} style="secondary" width="80%" />
                    <Button label="Clear Filters" onClick={onClear} style="secondary" width="80%" />
                </div>
                <div className="leaderboard-data">
                    <h1>Leaderboard for {track.name}</h1>
                    <div className="leaderboard">
                        <div className="leaderboard-entries">
                            <LeaderboardListings
                                track_id={Number(id)}
                                categoryId={categoryId}
                                carId={carId}
                                tireId={tireId}
                                weather={weather}
                                dateISO={dateISO}
                                apply={apply}
                                profile={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackLeaderboard;
