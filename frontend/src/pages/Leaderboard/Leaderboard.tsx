import "./leaderboard.scss";
import Header from "../../components/Header/Header";
import TrackCard from "../../components/TrackCard/TrackCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { TrackI } from "../../interfaces/tracksI";

const Leaderboard = () => {
    const server = import.meta.env.VITE_BACKEND;
    const [tracks, setTracks] = useState<TrackI[]>([]);

    const fetchTracks = async () => {
        let response = (await fetch(server + "api/tracks")) as Response;
        if (response.status == 200) {
            setTracks(JSON.parse(await response.text()) as Array<TrackI>);
        }
    };

    useEffect(() => {
        fetchTracks();
    }, []);

    return (
        <>
            <Header loggedIn={false} currentPage="leaderboard" />
            <div className="leaderboard-content">
                <div className="leaderboard-grid">
                    {tracks.map((track) => (
                        <Link to={`/leaderboard/track/${track.track_id}`} key={track.track_id} className="link">
                            <TrackCard track={track} />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
