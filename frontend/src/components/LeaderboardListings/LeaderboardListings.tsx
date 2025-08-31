import React, { useEffect, useState } from "react";
import type { ListingsI, ProfileListingsI } from "../../types/listing";
import Listing from "../Listing/Listing";
import "./leaderboardListings.scss";

interface LeaderboardListingsProps {
    track_id?: number;
    categoryId?: number | null;
    carId?: number | null;
    tireId?: number | null;
    weather?: string | null;
    dateISO?: string | null;
    apply?: number;
    driver_id?: number;
    profile?: boolean;
}

const LeaderboardListings: React.FC<LeaderboardListingsProps> = ({
    track_id,
    categoryId,
    carId,
    tireId,
    weather,
    dateISO,
    apply,
    driver_id,
    profile,
}) => {
    const [tempUnit, setTempUnit] = useState("°C");

    // TODO Replace with actual fetching logic
    const server = import.meta.env.VITE_BACKEND;

    const [listings, setListings] = useState<ListingsI[]>([]);
    const [profileListings, setProfileListings] = useState<ProfileListingsI[]>([]);

    const fetchListings = async (track_id: number) => {
        let response = (await fetch(server + "api/listings/" + track_id)) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as Array<ListingsI>;
            console.log(data);
            setListings(data);
        }
    };

    const fetchFilteredListings = async (track_id: number) => {
        const params = new URLSearchParams();

        if (categoryId != null) params.append("category_id", String(categoryId));
        if (carId != null) params.append("car_id", String(carId));
        if (tireId != null) params.append("tire_id", String(tireId));
        if (weather) params.append("weather", weather);
        if (dateISO) params.append("date", dateISO);
        let response = (await fetch(server + "api/listings/" + track_id + "?" + params.toString())) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as Array<ListingsI>;
            console.log(data);
            setListings(data);
        }
    };

    const fetchDriverListings = async (driver_id: number) => {
        let response = (await fetch(server + "api/listings/driver/" + driver_id)) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as Array<ProfileListingsI>;
            console.log(data);
            setProfileListings(data);
        }
    };

    useEffect(() => {
        if (track_id !== undefined) fetchFilteredListings(track_id);
    }, [apply, track_id, server]);

    useEffect(() => {
        if (track_id !== undefined) fetchListings(track_id);
    }, [track_id, server]);

    useEffect(() => {
        if (driver_id !== undefined) fetchDriverListings(driver_id);
    }, [driver_id, profile, server]);

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
                    {profile ? (
                        <Listing
                            position={"Position"}
                            listing={{
                                track: "Track",
                                car: "Car",
                                category: "Category",
                                tyre: "Tyre",
                                weather: "Weather",
                                trackTemp: "Track Temperature",
                                lap_time: "Lap Time",
                            }}
                            tempUnit={tempUnit}
                            title
                            profile={true}
                        />
                    ) : (
                        <Listing
                            position={"Position"}
                            listing={{
                                username: "Username",
                                car: "Car",
                                category: "Category",
                                tyre: "Tyre",
                                weather: "Weather",
                                trackTemp: "Track Temperature",
                                lap_time: "Lap Time",
                            }}
                            tempUnit={tempUnit}
                            title
                            profile={false}
                        />
                    )}
                </div>
                <hr />
                <div className="leaderboard-listings">
                    {!profile &&
                        listings.map((listing, index) => (
                            <div key={index} className="leaderboard-listing">
                                <Listing position={index + 1} listing={listing} tempUnit={tempUnit} profile={false} />
                                {index !== listings.length - 1 && <hr />}
                            </div>
                        ))}

                    {profile &&
                        profileListings.map((profileListing, index) => (
                            <div key={index} className="leaderboard-listing">
                                <Listing
                                    position={index + 1}
                                    listing={profileListing}
                                    tempUnit={tempUnit}
                                    profile={true}
                                />
                                {index !== profileListings.length - 1 && <hr />}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default LeaderboardListings;
