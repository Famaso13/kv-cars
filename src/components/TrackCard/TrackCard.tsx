import "./trackCard.scss";

interface TrackCardProps {
    // TODO implement track type
    track: number;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
    return (
        <div className="track-card">
            <img src="" alt="Track" />
            <div className="track-info">
                <h3>Track Name, location - todo backend{track}</h3>
                <div className="track-stats">
                    <h3>Track lenght:</h3>
                    <p> lenght - todo backend</p>
                </div>
                <div className="track-stats">
                    <h3>Famous corner:</h3>
                    <p> corner - todo backend</p>
                </div>
            </div>
        </div>
    );
};

export default TrackCard;
