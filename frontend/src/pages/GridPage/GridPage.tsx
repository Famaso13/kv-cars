import "./gridPage.scss";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import type { TrackI } from "../../interfaces/tracksI";
import type { CarsI } from "../../interfaces/carsI";

interface GridPageProps {
    type: "leaderboard" | "tracks" | "cars";
}

const GridPage: React.FC<GridPageProps> = ({ type }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const server = import.meta.env.VITE_BACKEND;
    const [tracks, setTracks] = useState<TrackI[]>([]);
    const [cars, setCars] = useState<CarsI[]>([]);

    const fetchTracks = async () => {
        let response = (await fetch(server + "api/tracks")) as Response;
        if (response.status == 200) {
            setTracks(JSON.parse(await response.text()) as Array<TrackI>);
        }
    };

    const fetchCars = async () => {
        let response = (await fetch(server + "api/cars")) as Response;
        if (response.status == 200) {
            setCars(JSON.parse(await response.text()) as Array<CarsI>);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("user") !== null) setLoggedIn(true);
        fetchTracks();
        fetchCars();
    }, []);

    return (
        <>
            <Header
                loggedIn={loggedIn}
                currentPage={type === "leaderboard" ? "leaderboard" : type === "tracks" ? "tracks" : "cars"}
            />
            <div className="leaderboard-content">
                {type !== "cars" && (
                    <div className="leaderboard-grid">
                        {tracks.map((track) => (
                            <Link
                                to={
                                    type === "leaderboard"
                                        ? `/leaderboard/track/${track.track_id}`
                                        : `/tracks/${track.track_id}`
                                }
                                key={track.track_id}
                                className="link"
                            >
                                <Card track={track} />
                            </Link>
                        ))}
                    </div>
                )}
                {type === "cars" && (
                    <div className="leaderboard-grid">
                        {cars.map((car) => (
                            <Link to={`/cars/${car.car_id}`} key={car.car_id} className="link">
                                <Card car={car} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default GridPage;
