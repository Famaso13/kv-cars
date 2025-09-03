import { useEffect, useState } from "react";
import "./carDetail.scss";
import { useParams } from "react-router-dom";
import type { CarsI } from "../../interfaces/carsI";
import Header from "../../components/Header/Header";
import LeaderboardListings from "../../components/LeaderboardListings/LeaderboardListings";
import type { CategoryFilterI } from "../../interfaces/filtersI";

const CarDetail = () => {
    const server = import.meta.env.VITE_BACKEND;
    const { id } = useParams<{ id: string }>();
    const carIdNum = id ? Number(id) : NaN;
    const [car, setCar] = useState<CarsI>({} as CarsI);

    const [categories, setCategories] = useState<CategoryFilterI[]>([]);

    const getCategories = async () => {
        let response = (await fetch(server + "api/filters/categories/")) as Response;
        if (response.status === 200) {
            let data = JSON.parse(await response.text()) as CategoryFilterI[];
            setCategories(data);
        }
    };

    useEffect(() => {
        getCategories();
    }, [car]);

    useEffect(() => {
        const fetchCarById = async (car_id: number) => {
            let response = (await fetch(server + "api/car/" + car_id)) as Response;
            if (response.status == 200) {
                setCar(JSON.parse(await response.text()) as CarsI);
            }
        };

        fetchCarById(carIdNum);
    }, [carIdNum, server]);
    return (
        <div className="car-detail">
            <Header loggedIn={true} currentPage="cars" />
            <div className="cars-title">
                <h1>
                    {car.make} {car.model}
                </h1>
            </div>
            <div className="car-info">
                <div className="car-stats">
                    <img src="" alt={car.model} />
                    <div className="car-card-details">
                        <div>
                            <h2>Category</h2>
                            <p>
                                {categories.find((cat) => cat.category_id === car.category_id)?.name || car.category_id}
                            </p>
                        </div>

                        <div>
                            <h2>Horsepower:</h2>
                            <p>{car.horsepower} HP</p>
                        </div>

                        <div>
                            <h2>Weight:</h2>
                            <p>{car.mass} kg</p>
                        </div>
                    </div>
                </div>
                <div className="car-leaderboard">
                    <LeaderboardListings carId={car.car_id} type="cars" />
                </div>
            </div>
        </div>
    );
};

export default CarDetail;
