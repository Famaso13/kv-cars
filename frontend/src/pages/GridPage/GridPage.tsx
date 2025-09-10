import "./gridPage.scss";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import type { TrackI } from "../../interfaces/tracksI";
import type { CarsI } from "../../interfaces/carsI";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import type { LeaguesI } from "../../interfaces/leaguesI";
import type { UserI } from "../../interfaces/usersI";

interface GridPageProps {
    type: "leaderboard" | "tracks" | "cars" | "league" | "leagueDetail";
}

const GridPage: React.FC<GridPageProps> = ({ type }) => {
    const { league_id } = useParams<{ league_id: string }>();
    const leagueIdNum = league_id ? Number(league_id) : NaN;

    const [user, setUser] = useState<UserI>({} as UserI);

    const [loggedIn, setLoggedIn] = useState(false);
    const server = import.meta.env.VITE_BACKEND;
    const [tracks, setTracks] = useState<TrackI[]>([]);
    const [cars, setCars] = useState<CarsI[]>([]);
    const [leagues, setLeagues] = useState<LeaguesI[]>([]);

    const [modalType, setModalType] = useState<
        | "lapInsert"
        | "profile"
        | "league"
        | "cars"
        | "tracks"
        | "leaderboard"
        | "leagueDetailAdd"
        | "leagueDetailRemove"
        | "carAdd"
        | "trackAdd"
    >("league");
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

    const fetchLoggedInUser = async () => {
        let sessionUser = sessionStorage.getItem("user");
        if (sessionUser !== null) {
            setLoggedIn(true);
            setUser(JSON.parse(sessionUser));
        }
    };

    useEffect(() => {
        fetchLoggedInUser();
        fetchTracks();
        fetchCars();
        fetchLeagues();
    }, []);

    const selectedLeague = Number.isFinite(leagueIdNum) ? leagues.find((l) => l.league_id === leagueIdNum) : undefined;

    return (
        <>
            {modalShow && <Modal setModal={setModalShow} type={modalType} league_id={leagueIdNum} />}
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
                        <Button
                            label="Add League"
                            style="primary"
                            onClick={() => {
                                setModalType("league");
                                setModalShow(true);
                            }}
                        />
                    )}
                    {type === "cars" && user.admin === 1 && (
                        <Button
                            label="Add Car"
                            style="primary"
                            onClick={() => {
                                setModalType("carAdd");
                                setModalShow(true);
                            }}
                        />
                    )}
                    {type === "tracks" && user.admin === 1 && (
                        <Button
                            label="Add Track"
                            style="primary"
                            onClick={() => {
                                setModalType("trackAdd");
                                setModalShow(true);
                            }}
                        />
                    )}
                    {type === "leagueDetail" && (
                        <>
                            <h1 className="league-title">{selectedLeague?.name}</h1>
                            <Button
                                label="Add League Drivers"
                                style="primary"
                                height={"80px"}
                                onClick={() => {
                                    setModalType("leagueDetailAdd");
                                    setModalShow(true);
                                }}
                            />
                            <Button
                                label="Remove League Drivers"
                                style="primary"
                                height={"80px"}
                                onClick={() => {
                                    setModalType("leagueDetailRemove");
                                    setModalShow(true);
                                }}
                            />
                        </>
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
                                <Card league={league} />
                            </Link>
                        ))}
                    </div>
                )}
                {type === "leagueDetail" && (
                    <div className="leaderboard-grid">
                        {tracks.map((track) => (
                            <Link
                                to={`/leagues/${leagueIdNum}/tracks/${track.track_id}`}
                                key={track.track_id}
                                className="link"
                            >
                                <Card track={track} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default GridPage;
