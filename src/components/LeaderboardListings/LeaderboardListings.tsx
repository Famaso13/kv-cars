import { useState } from "react";
import type { Listings } from "../../types/listing";
import Listing from "../Listing/Listing";
import "./leaderboardListings.scss";

const LeaderboardListings = () => {
    const [tempUnit, setTempUnit] = useState("°C");

    // TODO Replace with actual fetching logic
    const listings: Listings[] = [
        {
            username: "Karlo",
            car: "Car 1",
            category: "A",
            tyre: "Soft",
            weather: "Sunny",
            trackTemp: 30,
            date: "2023-10-01",
        },
        {
            username: "Ana",
            car: "Car 2",
            category: "B",
            tyre: "Medium",
            weather: "Cloudy",
            trackTemp: 25,
            date: "2023-10-02",
        },
        {
            username: "Marko",
            car: "Car 3",
            category: "C",
            tyre: "Hard",
            weather: "Rainy",
            trackTemp: 20,
            date: "2023-10-03",
        },
        {
            username: "Ivana",
            car: "Car 4",
            category: "A",
            tyre: "Soft",
            weather: "Sunny",
            trackTemp: 32,
            date: "2023-10-04",
        },
    ];

    return (
        <>
            <div className="leaderboard-settings">
                <p>Temperature Unit:</p>
                <select id="temp-unit" name="tempUnit" value={tempUnit} onChange={(e) => setTempUnit(e.target.value)}>
                    <option value="°C">°C (Celsius)</option>
                    <option value="°F">°F (Fahrenheit)</option>
                </select>
            </div>
            <div className="leaderboard-container">
                <div className="leaderboard-listings">
                    <Listing
                        position={"Position"}
                        listing={{
                            username: "Username",
                            car: "Car",
                            category: "Category",
                            tyre: "Tyre",
                            weather: "Weather",
                            trackTemp: "Track Temperature",
                            date: "Date",
                        }}
                        tempUnit={tempUnit}
                        title
                    />
                </div>
                <hr />
                <div className="leaderboard-listings">
                    {listings.map((listing, index) => (
                        <>
                            <div key={index} className="leaderboard-listing">
                                <Listing position={index + 1} listing={listing} tempUnit={tempUnit} />
                            </div>
                            {index !== listings.length - 1 && <hr />}
                        </>
                    ))}
                </div>
            </div>
        </>
    );
};

export default LeaderboardListings;
