import type { TrackI } from "../../interfaces/tracksI";
import "./trackCard.scss";

interface TrackCardProps {
    track: TrackI;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
    return (
        <div className="track-card">
            <img src="#" alt={track.name} />
            <div className="track-info">
                <h3>
                    {track.name}, {track.location}
                </h3>
                <div className="track-stats">
                    <h3>Track lenght:</h3>
                    <p>{track.length_km} km</p>
                </div>
                <div className="track-stats">
                    <h3>Famous corner:</h3>
                    <p>{track.famous_corner}</p>
                </div>
            </div>
        </div>
    );
};

export default TrackCard;
