import type { ListingsI, ProfileListingsI } from "../../types/listing";
import "./listing.scss";

type ListingProps =
    | {
          position?: number | string;
          listing: ListingsI;
          tempUnit?: string;
          title?: boolean;
          profile: false;
      }
    | {
          position?: number | string;
          listing: ProfileListingsI;
          tempUnit?: string;
          title?: boolean;
          profile: true;
      };

const celsiusToFahrenheit = (temp: number) => {
    return (temp * (9 / 5) + 32).toPrecision(3);
};

const Listing: React.FC<ListingProps> = ({ position, listing, tempUnit, title, profile }) => {
    return (
        <div className={title ? "title listing" : "listing"}>
            <div className="medal">
                {position === 1 ? (
                    <p className="position-first">{position}</p>
                ) : position === 2 ? (
                    <p className="position-second">{position}</p>
                ) : position === 3 ? (
                    <p className="position-third">{position}</p>
                ) : (
                    <p>{position}</p>
                )}
            </div>
            {/* Always render the same columns in the same order */}
            <p>{profile ? listing.track : listing.username}</p>
            <p>{listing.car}</p>
            <p>{listing.category}</p>
            <p>{listing.tyre}</p>
            <p>{listing.weather}</p>
            <p>
                {title
                    ? listing.trackTemp
                    : tempUnit === "°C"
                    ? listing.trackTemp
                    : celsiusToFahrenheit(Number(listing.trackTemp))}
                {!title && tempUnit}
            </p>
            <p>{listing.lap_time}</p>
        </div>
    );
};

export default Listing;
