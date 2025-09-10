import { useEffect, useState } from "react";
import type { CarsI } from "../../interfaces/carsI";
import type { TrackI } from "../../interfaces/tracksI";
import "./card.scss";
import type { CategoryFilterI } from "../../interfaces/filtersI";
import type { LeaguesI } from "../../interfaces/leaguesI";
import type { UserI } from "../../interfaces/usersI";

type CardProps =
    | {
          track: TrackI;
          car?: null;
          league?: null;
      }
    | {
          track?: null;
          car: CarsI;
          league?: null;
      }
    | { track?: null; car?: null; league: LeaguesI };

const Card: React.FC<CardProps> = ({ track, car, league }) => {
    const server = import.meta.env.VITE_BACKEND;
    const [categories, setCategories] = useState<CategoryFilterI[]>([]);
    const [owner, setOwner] = useState<UserI>({} as UserI);

    const getCategories = async () => {
        let response = (await fetch(server + "api/filters/categories/")) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as CategoryFilterI[];
            setCategories(data);
        }
    };

    const getOwner = async (user_id: number) => {
        let response = (await fetch(server + "api/user/" + user_id)) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as UserI;
            setOwner(data);
        }
    };

    useEffect(() => {
        getCategories();
    }, [car]);

    useEffect(() => {
        if (!league) return;
        getOwner(league.owner_id);
    }, [league]);
    return (
        <div className="track-card">
            {!league && (
                <img
                    src={
                        track
                            ? `${server}api/tracks/${track.track_id}/image`
                            : car && `${server}api/cars/${car.car_id}/image`
                    }
                    alt={track ? track.name : car && car.make + car.model}
                />
            )}
            <div className="track-info">
                {track && (
                    <>
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
                    </>
                )}
                {car && (
                    <>
                        <h3>
                            {car.make}&nbsp;{car.model}
                        </h3>
                        <div className="track-stats">
                            <h3>Category:</h3>
                            <p>
                                {categories.find((cat) => cat.category_id === car.category_id)?.name || car.category_id}
                            </p>
                        </div>
                        <div className="track-stats">
                            <h3>Horsepower:</h3>
                            <p>{car.horsepower} HP</p>
                        </div>
                        <div className="track-stats">
                            <h3>Weight:</h3>
                            <p>{car.mass} kg</p>
                        </div>
                    </>
                )}
            </div>
            {league && (
                <div className="card-league">
                    <h1>{league.name}</h1>
                    {league.description !== "" && (
                        <div className="track-stats">
                            <h3>Description:</h3>
                            <p>{league.description}</p>
                        </div>
                    )}
                    <div className="track-stats">
                        <h3>Owner:</h3>
                        <p>{owner.username}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;
