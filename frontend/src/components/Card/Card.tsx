import { useEffect, useState } from "react";
import type { CarsI } from "../../interfaces/carsI";
import type { TrackI } from "../../interfaces/tracksI";
import "./card.scss";
import type { CategoryFilterI } from "../../interfaces/filtersI";
// import type { LeaguesI } from "../../interfaces/leaguesI";

type CardProps =
    | {
          track: TrackI;
          car?: null;
          //  league?: null;
      }
    | {
          track?: null;
          car: CarsI;
          // league?: null
      };

//  | { track?: null; car?: null; league: LeaguesI };

const Card: React.FC<CardProps> = ({ track, car }) => {
    const server = import.meta.env.VITE_BACKEND;
    const [categories, setCategories] = useState<CategoryFilterI[]>([]);

    const getCategories = async () => {
        let response = (await fetch(server + "api/filters/categories/")) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as CategoryFilterI[];
            setCategories(data);
        }
    };

    useEffect(() => {
        getCategories();
    }, [car]);
    return (
        <div className="track-card">
            <img src="#" alt={track ? track.name : car.make + car.model} />
            <div className="track-info">
                {track ? (
                    <h3>
                        {track.name}, {track.location}
                    </h3>
                ) : (
                    <h3>
                        {car.make}&nbsp;{car.model}
                    </h3>
                )}
                <div className="track-stats">
                    {track ? (
                        <>
                            <h3>Track lenght:</h3>
                            <p>{track.length_km} km</p>
                        </>
                    ) : (
                        <>
                            <h3>Category:</h3>
                            <p>
                                {categories.find((cat) => cat.category_id === car.category_id)?.name || car.category_id}
                            </p>
                        </>
                    )}
                </div>
                <div className="track-stats">
                    {track ? (
                        <>
                            <h3>Famous corner:</h3>
                            <p>{track.famous_corner}</p>
                        </>
                    ) : (
                        <>
                            <h3>Horsepower:</h3>
                            <p>{car.horsepower} HP</p>
                        </>
                    )}
                </div>
                {car && (
                    <div className="track-stats">
                        <h3>Weight:</h3>
                        <p>{car.mass} kg</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
