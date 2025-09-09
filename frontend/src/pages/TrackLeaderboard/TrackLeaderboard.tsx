import Header from "../../components/Header/Header";
import "./trackLeaderboard.scss";
import { useParams } from "react-router-dom";
import LeaderboardListings from "../../components/LeaderboardListings/LeaderboardListings";
import FormInput from "../../components/FormInput/FormInput";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import type { TrackI } from "../../interfaces/tracksI";
import Modal from "../../components/Modal/Modal";
import { useFilters } from "../../hooks/useFilters";

const TrackLeaderboard = () => {
    const server = import.meta.env.VITE_BACKEND;
    const { track_id } = useParams<{ track_id: string }>();
    const { league_id } = useParams<{ league_id: string }>();
    const trackIdNum = track_id ? Number(track_id) : undefined;
    const leagueIdNum = league_id ? Number(league_id) : undefined;
    const [track, setTrack] = useState<TrackI>({} as TrackI);
    const [apply, setApply] = useState(0);
    const [toggleFilters, setToggleFilters] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchTrackById = async (id: number) => {
            let response = (await fetch(server + "api/tracks/" + id)) as Response;
            if (response.status == 200) {
                setTrack(JSON.parse(await response.text()) as TrackI);
            }
        };

        if (trackIdNum !== undefined) fetchTrackById(trackIdNum);
    }, [trackIdNum, server]);

    useEffect(() => {
        const fetchTrackById = async (id: number) => {
            let response = (await fetch(server + "api/tracks/" + id)) as Response;
            if (response.status == 200) {
                setTrack(JSON.parse(await response.text()) as TrackI);
            }
        };

        if (trackIdNum !== undefined) fetchTrackById(trackIdNum);
    }, [trackIdNum, server]);

    const [tireId, setTireId] = useState<number | null>(null);
    const [weather, setWeather] = useState<string | null>(null);
    const [dateISO, setDateISO] = useState<string | null>(null);

    const { categories, cars, tires, weatherList, categoryId, setCategoryId, carId, setCarId } = useFilters();

    const onChangeCategory = (val: string) => setCategoryId(val ? Number(val) : null);
    const onChangeCar = (val: string) => setCarId(val ? Number(val) : null);
    const onChangeTire = (val: string) => setTireId(val ? Number(val) : null);
    const onChangeWeather = (val: string) => setWeather(val || null);
    const onChangeDate = (val: string) => setDateISO(val || null);

    const onClear = () => {
        setCategoryId(null);
        setCarId(null);
        setTireId(null);
        setWeather(null);
        applyFilters();
    };

    const applyFilters = () => {
        setApply((t) => t + 1);
    };

    const changeToggleFilters = () => {
        setToggleFilters(!toggleFilters);
    };

    return (
        <div>
            <Header loggedIn={true} currentPage={leagueIdNum ? "leagues" : "leaderboard"} />
            <div className="full-screen">
                <div className="leaderboard-filters">
                    <h2>Data filters</h2>
                    <div className="leaderboard-data-filters">
                        <h2>Real position:</h2>
                        <Button label={toggleFilters ? "Off" : "On"} onClick={changeToggleFilters} style="secondary" />
                    </div>
                    <FormInput
                        label="Category"
                        array={categories}
                        type="select"
                        width={"80%"}
                        value={categoryId?.toString() ?? ""}
                        light
                        onChange={onChangeCategory}
                    />
                    <FormInput
                        label="Cars"
                        array={cars}
                        type="select"
                        value={carId?.toString() ?? ""}
                        light
                        width={"80%"}
                        onChange={onChangeCar}
                    />
                    <FormInput
                        label="Tires"
                        array={tires}
                        type="select"
                        value={tireId?.toString() ?? ""}
                        light
                        width={"80%"}
                        onChange={onChangeTire}
                    />
                    <FormInput
                        label="Weather"
                        array={weatherList}
                        type="select"
                        light
                        width={"80%"}
                        onChange={onChangeWeather}
                    />
                    <FormInput label="Date" type="date" light width={"80%"} onChange={onChangeDate} />
                    <Button label="Apply Filters" onClick={applyFilters} style="secondary" width="80%" />
                    <Button label="Clear Filters" onClick={onClear} style="secondary" width="80%" />
                </div>
                <div className="leaderboard-data">
                    <h1>Leaderboard for {track.name}</h1>
                    <div className="leaderboard">
                        <div className="leaderboard-entries">
                            <LeaderboardListings
                                track_id={Number(trackIdNum)}
                                categoryId={categoryId}
                                carId={carId}
                                tireId={tireId}
                                weather={weather}
                                dateISO={dateISO}
                                apply={apply}
                                type="tracks"
                                toggleFilters={toggleFilters}
                                league_id={leagueIdNum}
                            />
                            <Button
                                label="Add Lap"
                                style="primary"
                                onClick={() => {
                                    setShowModal(true);
                                }}
                            />
                        </div>
                    </div>
                    {showModal && <Modal setModal={setShowModal} type="lapInsert" track_id={trackIdNum} />}
                </div>
            </div>
        </div>
    );
};

export default TrackLeaderboard;
