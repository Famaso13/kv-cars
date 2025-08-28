import type { Listings } from "../../types/listing";
import "./listing.scss";

interface ListingProps {
    position?: number | string;
    listing: Listings;
    tempUnit?: string;
    title?: boolean;
}

const Listing: React.FC<ListingProps> = ({ position, listing, tempUnit, title }) => {
    return (
        <div className={title ? "title listing" : "listing"}>
            {position === 1 ? (
                <div className="medal">
                    <p className="position-first">{position}</p>
                </div>
            ) : position === 2 ? (
                <div className="medal">
                    <p className="position-second">{position}</p>
                </div>
            ) : position === 3 ? (
                <div className="medal">
                    <p className="position-third">{position}</p>
                </div>
            ) : (
                <p>{position}</p>
            )}
            <p>{listing.username}</p>
            <p>{listing.car}</p>
            <p>{listing.category}</p>
            <p>{listing.tyre}</p>
            <p>{listing.weather}</p>
            <p>
                {listing.trackTemp}
                {!title && tempUnit}
            </p>
            <p>{listing.lap_time}</p>
        </div>
    );
};

export default Listing;
