import React, { useEffect, useState } from "react";
import type { CarsListingsI, ListingsI, ProfileListingsI } from "../../types/listing";
import Listing from "../Listing/Listing";
import "./leaderboardListings.scss";
import Button from "../Button/Button";

interface LeaderboardListingsProps {
    track_id?: number;
    categoryId?: number | null;
    carId?: number | null;
    tireId?: number | null;
    weather?: string | null;
    dateISO?: string | null;
    apply?: number;
    driver_id?: number;
    type: "tracks" | "track_detail" | "profile" | "cars";
    toggleFilters?: boolean;
    league_id?: number;
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
    type,
    toggleFilters,
    league_id,
}) => {
    const [tempUnit, setTempUnit] = useState("°C");

    const server = import.meta.env.VITE_BACKEND;

    const [fullListings, setFullListings] = useState<ListingsI[]>([]);
    const [leagueListings, setLeagueListings] = useState<ListingsI[]>([]);
    const [filteredListings, setFilteredListings] = useState<ListingsI[]>([]);
    const [profileListings, setProfileListings] = useState<ProfileListingsI[]>([]);
    const [carListings, setCarListings] = useState<CarsListingsI[]>([]);

    const fetchListings = async (track_id: number) => {
        let response = (await fetch(server + "api/listings/" + track_id)) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as Array<ListingsI>;
            setFullListings(data);
        }
    };

    const fetchListingsByLeagueId = async (league_id: number) => {
        let response = (await fetch(server + "api/listings/" + league_id + "/" + track_id)) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as Array<ListingsI>;
            setLeagueListings(data);
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
            setFilteredListings(data);
        }
    };

    const fetchDriverListings = async (driver_id: number) => {
        let response = (await fetch(server + "api/listings/driver/" + driver_id)) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as Array<ProfileListingsI>;
            setProfileListings(data);
        }
    };

    const fetchCarListings = async (car_id: number) => {
        let response = (await fetch(server + "api/listings/car/" + car_id)) as Response;
        if (response.status == 200) {
            let data = JSON.parse(await response.text()) as Array<CarsListingsI>;
            setCarListings(data);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const paginate = <T,>(listings: T[]) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return listings.slice(start, end);
    };

    useEffect(() => {
        if (track_id !== undefined) fetchFilteredListings(track_id);
    }, [apply, track_id, server]);

    useEffect(() => {
        if (track_id !== undefined) fetchListings(track_id);
    }, [track_id, server]);

    useEffect(() => {
        if (carId !== null && carId !== undefined) fetchCarListings(carId);
    }, [carId, server]);

    useEffect(() => {
        if (driver_id !== undefined) fetchDriverListings(driver_id);
    }, [driver_id, type, server]);

    useEffect(() => {
        if (league_id !== undefined) fetchListingsByLeagueId(league_id);
    }, [league_id, type, server]);

    const getRealPosition = (listing: ListingsI) => {
        return (
            fullListings.findIndex(
                (l) =>
                    l.username === listing.username &&
                    l.car === listing.car &&
                    l.category === listing.category &&
                    l.tyre === listing.tyre &&
                    l.weather === listing.weather &&
                    l.lap_time === listing.lap_time
            ) + 1
        );
    };

    return (
        <>
            <div className="leaderboard-settings">
                <p>Temperature Unit:</p>
                <select id="temp-unit" name="tempUnit" value={tempUnit} onChange={(e) => setTempUnit(e.target.value)}>
                    <option value="°C">°C (Celsius)</option>
                    <option value="°F">°F (Fahrenheit)</option>
                </select>
            </div>
            {type === "tracks" && (
                <div className="leaderboard-pagination">
                    <Button
                        label="<<"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        style="secondary"
                    />

                    <Button
                        label="<"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        style="primary"
                    />

                    <p>
                        Page {currentPage} of{" "}
                        {Math.ceil(
                            (league_id !== undefined ? leagueListings.length : filteredListings.length) / itemsPerPage
                        )}
                    </p>

                    <Button
                        label=">"
                        onClick={() => {
                            const totalPages = Math.ceil(
                                (league_id !== undefined ? leagueListings.length : filteredListings.length) /
                                    itemsPerPage
                            );
                            setCurrentPage((p) => Math.min(p + 1, totalPages));
                        }}
                        disabled={
                            currentPage ===
                            Math.ceil(
                                (league_id !== undefined ? leagueListings.length : filteredListings.length) /
                                    itemsPerPage
                            )
                        }
                        style="primary"
                    />

                    <Button
                        label=">>"
                        onClick={() => {
                            const totalPages = Math.ceil(
                                (league_id !== undefined ? leagueListings.length : filteredListings.length) /
                                    itemsPerPage
                            );
                            setCurrentPage(totalPages);
                        }}
                        disabled={
                            currentPage ===
                            Math.ceil(
                                (league_id !== undefined ? leagueListings.length : filteredListings.length) /
                                    itemsPerPage
                            )
                        }
                        style="secondary"
                    />
                </div>
            )}
            <div className="leaderboard-container">
                <div className="leaderboard-listings">
                    {type === "profile" ? (
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
                            type="profile"
                        />
                    ) : type === "tracks" ? (
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
                            type="tracks"
                        />
                    ) : (
                        <Listing
                            position={"Position"}
                            listing={{
                                username: "Username",
                                track: "Track",
                                category: "Category",
                                tyre: "Tyre",
                                weather: "Weather",
                                trackTemp: "Track Temperature",
                                lap_time: "Lap Time",
                            }}
                            tempUnit={tempUnit}
                            title
                            type="cars"
                        />
                    )}
                </div>
                <hr />
                <div className="leaderboard-listings">
                    {type === "tracks" && league_id == undefined ? (
                        toggleFilters ? (
                            paginate(filteredListings).map((listing, index) => (
                                <div key={index} className="leaderboard-listing">
                                    <Listing
                                        position={(currentPage - 1) * itemsPerPage + index + 1}
                                        listing={listing}
                                        tempUnit={tempUnit}
                                        type="tracks"
                                    />
                                    {index !== paginate(filteredListings).length - 1 && <hr />}
                                </div>
                            ))
                        ) : (
                            paginate(filteredListings).map((listing, index) => {
                                const realPos = getRealPosition(listing);
                                return (
                                    <div key={index} className="leaderboard-listing">
                                        <Listing
                                            position={realPos}
                                            listing={listing}
                                            tempUnit={tempUnit}
                                            type="tracks"
                                        />
                                        {index !== paginate(filteredListings).length - 1 && <hr />}
                                    </div>
                                );
                            })
                        )
                    ) : (
                        <div></div>
                    )}

                    {type === "tracks" &&
                        league_id !== undefined &&
                        paginate(leagueListings).map((listing, index) => (
                            <div key={index} className="leaderboard-listing">
                                <Listing
                                    position={(currentPage - 1) * itemsPerPage + index + 1}
                                    listing={listing}
                                    tempUnit={tempUnit}
                                    type="tracks"
                                />
                                {index !== paginate(leagueListings).length - 1 && <hr />}
                            </div>
                        ))}
                    {type === "track_detail" &&
                        fullListings.slice(0, 3).map((listing, index) => (
                            <div key={index} className="leaderboard-listing">
                                <Listing position={index + 1} listing={listing} tempUnit={tempUnit} type="tracks" />
                                {index !== fullListings.slice(0, 3).length - 1 && <hr />}
                            </div>
                        ))}

                    {type === "profile" &&
                        profileListings.map((profileListing, index) => (
                            <div key={index} className="leaderboard-listing">
                                <Listing
                                    position={index + 1}
                                    listing={profileListing}
                                    tempUnit={tempUnit}
                                    type="profile"
                                />
                                {index !== profileListings.length - 1 && <hr />}
                            </div>
                        ))}

                    {type === "cars" &&
                        carListings.slice(0, 3).map((carListing, index) => (
                            <div key={index} className="leaderboard-listing">
                                <Listing position={index + 1} listing={carListing} tempUnit={tempUnit} type="cars" />
                                {index !== carListings.slice(0, 3).length - 1 && <hr />}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default LeaderboardListings;
