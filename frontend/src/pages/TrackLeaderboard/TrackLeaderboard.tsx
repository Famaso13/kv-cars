import Header from "../../components/Header/Header";
import "./trackLeaderboard.scss";
import { useParams } from "react-router-dom";
import LeaderboardListings from "../../components/LeaderboardListings/LeaderboardListings";
import FormInput from "../../components/FormInput/FormInput";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import type { TrackI } from "../../interfaces/tracksI";

const TrackLeaderboard = () => {
    const server = import.meta.env.VITE_BACKEND;
    const { id } = useParams<{ id: string }>();
    const [track, setTrack] = useState<TrackI>({} as TrackI);

    const fetchTrackById = async (id: string | undefined) => {
        let response = (await fetch(server + "api/tracks/" + id)) as Response;
        if (response.status == 200) {
            setTrack(JSON.parse(await response.text()) as TrackI);
        }
    };

    useEffect(() => {
        fetchTrackById(id);
    }, []);

    //TODO Replace with filter fetching
    const categories: string[] = ["A", "B", "C"];
    const tyres: string[] = ["Soft", "Medium", "Hard"];
    const cars: string[] = ["Car1", "Car2", "Car3"];
    const weather: string[] = ["Sunny", "Cloudy", "Rainy"];

    const [category, setCategory] = useState(categories[0]);
    const [car, setCar] = useState(cars[0]);
    const [tyre, setTyre] = useState(tyres[0]);
    const [wthr, setWthr] = useState(weather[0]);
    const [date, setDate] = useState("");

    const applyFilters = () => {
        const filters = { category, car, tyre, weather: wthr, date };
        console.log("Apply filters:", filters);
        //  TODO - add fetch logic
    };

    return (
        <div>
            <Header loggedIn={true} currentPage="leaderboard" />
            <div className="full-screen">
                <div className="leaderboard-filters">
                    <h2>Data filters</h2>
                    <FormInput
                        label="Category"
                        type="select"
                        array={categories}
                        width={"80%"}
                        light
                        onChange={setCategory}
                    />
                    <FormInput label="Cars" type="select" array={cars} light width={"80%"} onChange={setCar} />
                    <FormInput label="Tyres" type="select" array={tyres} light width={"80%"} onChange={setTyre} />
                    <FormInput label="Weather" type="select" array={weather} light width={"80%"} onChange={setWthr} />
                    <FormInput label="Date" type="date" light width={"80%"} onChange={setDate} />
                    <Button label="Apply Filters" onClick={applyFilters} style="secondary" width="80%" />
                </div>
                <div className="leaderboard-data">
                    <h1>Leaderboard for {track.name}</h1>
                    <div className="leaderboard">
                        <div className="leaderboard-entries">
                            <LeaderboardListings />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackLeaderboard;
