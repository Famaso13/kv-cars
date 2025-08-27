import "./leaderboard.scss";
import Header from "../../components/Header/Header";
import TrackCard from "../../components/TrackCard/TrackCard";
import { Link } from "react-router-dom";

const Leaderboard = () => {
    // TODO implement fetching and displaying tracks
    const tracks = [1, 2, 3, 4, 5, 6, 7, 8];
    return (
        <>
            <Header loggedIn={false} currentPage="leaderboard" />
            <div className="leaderboard-content">
                <div className="leaderboard-grid">
                    {tracks.map((track) => (
                        <Link to={`/leaderboard/${track}`} key={track} className="link">
                            <TrackCard track={track} />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
