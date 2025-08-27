import Header from "../../components/Header/Header";
import "./trackLeaderboard.scss";
import { useParams } from "react-router-dom";
import LeaderboardListings from "../../components/LeaderboardListings/LeaderboardListings";

const TrackLeaderboard = () => {
    const { id } = useParams<{ id: string }>();

    const track = id; //TODO Replace with actual track fetching logic

    return (
        <div>
            <Header loggedIn={true} currentPage="leaderboard" />
            <div className="full-screen">
                <div className="leaderboard-filters">
                    {/* TODO - make filters (select or change input component) */}
                </div>
                <div className="leaderboard-data">
                    <h1>Leaderboard for {track}</h1>
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
