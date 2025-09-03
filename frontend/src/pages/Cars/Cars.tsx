import "../Leaderboard/leaderboard.scss";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CarsI } from "../../interfaces/carsI";

const Leaderboard = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const server = import.meta.env.VITE_BACKEND;
    const [cars, setCars] = useState<CarsI[]>([]);

    const fetchCars = async () => {
        let response = (await fetch(server + "api/cars")) as Response;
        if (response.status == 200) {
            setCars(JSON.parse(await response.text()) as Array<CarsI>);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("user") !== null) setLoggedIn(true);
        fetchCars();
    }, []);

    return (
        <>
            <Header loggedIn={loggedIn} currentPage="cars" />
            <div className="leaderboard-content">
                <div className="leaderboard-grid">
                    {cars.map((car) => (
                        <Link to={`/cars/${car.car_id}`} key={car.car_id} className="link">
                            <Card car={car} />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
