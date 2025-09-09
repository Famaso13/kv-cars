import { useEffect, useState } from "react";
import "../CarDetail/carDetail.scss";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import LeaderboardListings from "../../components/LeaderboardListings/LeaderboardListings";
import type { TrackI } from "../../interfaces/tracksI";

const TrackDetail = () => {
    const server = import.meta.env.VITE_BACKEND;
    const { id } = useParams<{ id: string }>();
    const trackIdNum = id ? Number(id) : NaN;
    const [track, setTrack] = useState<TrackI>({} as TrackI);

    useEffect(() => {
        const fetchTrackById = async (track_id: number) => {
            let response = (await fetch(server + "api/tracks/" + track_id)) as Response;
            if (response.status == 200) {
                setTrack(JSON.parse(await response.text()) as TrackI);
            }
        };

        fetchTrackById(trackIdNum);
    }, [trackIdNum, server]);
    return (
        <div className="car-detail">
            <Header loggedIn={true} currentPage="tracks" />
            <div className="cars-title">
                <h1>{track.name}</h1>
            </div>
            <div className="car-info">
                <div className="car-stats">
                    <img src="" alt={track.name} />
                    <div className="car-card-details">
                        <div>
                            <h2>Location:</h2>
                            <p>{track.location}</p>
                        </div>

                        <div>
                            <h2>Length:</h2>
                            <p>{track.length_km} km</p>
                        </div>

                        <div>
                            <h2>Famous Corner:</h2>
                            <p>{track.famous_corner}</p>
                        </div>
                    </div>
                </div>
                <div className="car-leaderboard">
                    <LeaderboardListings track_id={track.track_id} type="track_detail" />
                </div>
            </div>
        </div>
    );
};

export default TrackDetail;
