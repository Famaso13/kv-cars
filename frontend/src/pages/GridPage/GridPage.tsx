import "./gridPage.scss";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import type { TrackI } from "../../interfaces/tracksI";
import type { CarsI } from "../../interfaces/carsI";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import type { LeaguesI } from "../../interfaces/leaguesI";

interface GridPageProps {
    type: "leaderboard" | "tracks" | "cars" | "league";
}

const GridPage: React.FC<GridPageProps> = ({ type }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const server = import.meta.env.VITE_BACKEND;
    const [tracks, setTracks] = useState<TrackI[]>([]);
    const [cars, setCars] = useState<CarsI[]>([]);
    const [leagues, setLeagues] = useState<LeaguesI[]>([]);

    const [modalShow, setModalShow] = useState(false);

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

    const fetchLeagues = async () => {
        let response = (await fetch(server + "api/leagues")) as Response;
        if (response.status == 200) {
            setLeagues(JSON.parse(await response.text()) as Array<LeaguesI>);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("user") !== null) setLoggedIn(true);
        fetchTracks();
        fetchCars();
        fetchLeagues();
    }, []);

    return (
        <>
            {modalShow && <Modal setModal={setModalShow} type={type} />}
            <Header
                loggedIn={loggedIn}
                currentPage={
                    type === "leaderboard"
                        ? "leaderboard"
                        : type === "tracks"
                        ? "tracks"
                        : type === "cars"
                        ? "cars"
                        : "leagues"
                }
            />
            <div className="leaderboard-content">
                <div className="leaderboard-add">
                    {type === "league" && (
                        <Button label="Add League" style="primary" onClick={() => setModalShow(true)} />
                    )}
                </div>
                {(type === "tracks" || type === "leaderboard") && (
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
                {type === "league" && (
                    <div className="leaderboard-grid">
                        {leagues.map((league) => (
                            <Link to={`/leagues/${league.league_id}`} key={league.league_id} className="link">
                                <p>{league.name}</p>
                                {/* <Card car={} /> */}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default GridPage;
