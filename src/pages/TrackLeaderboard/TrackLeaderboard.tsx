import Header from "../../components/Header/Header";
import "./trackLeaderboard.scss";
import { useParams } from "react-router-dom";
import { useState } from "react";

type TempUnit = "celsius" | "fahrenheit";

const TrackLeaderboard = () => {
    const { id } = useParams<{ id: string }>();

    const track = id; //TODO Replace with actual track fetching logic

    const [tempUnit, setTempUnit] = useState<TempUnit>("celsius");

    return (
        <div>
            <Header loggedIn={true} currentPage="leaderboard" />
            <div className="full-screen">
                <div className="leaderboard-filters"></div>
                <div className="leaderboard-data">
                    <h1>Leaderboard for {track}</h1>
                    <div className="leaderboard">
                        <div className="leaderboard-settings">
                            <p>Temperature Unit:</p>
                            <select
                                id="temp-unit"
                                name="tempUnit"
                                value={tempUnit}
                                onChange={(e) => setTempUnit(e.target.value as TempUnit)}
                            >
                                <option value="celsius">°C (Celsius)</option>
                                <option value="fahrenheit">°F (Fahrenheit)</option>
                            </select>
                        </div>
                        <div className="leaderboard-entries">
                            {/* TODO implement fetching and displaying leaderboard entries */}
                            <p>Leaderboard entries will be displayed here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackLeaderboard;
