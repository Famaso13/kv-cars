import Button from "../Button/Button";
import "./modal.scss";
import profilePic from "../../assets/profile.png";
import type { UserI } from "../../interfaces/usersI";
import FormInput from "../FormInput/FormInput";
// import type { CarFilterI, CategoryFilterI, TireFilterI, WeatherFilterI } from "../../interfaces/filtersI";
// import { useState } from "react";
import { useFilters } from "../../hooks/useFilters";
import { useState } from "react";
import type { TrackConditionI } from "../../interfaces/trackConditionsI";
import type { LapsI } from "../../interfaces/lapsI";

interface ModalProps {
    setModal: (value: boolean) => void;
    profile?: boolean;
    lapInsert?: boolean;
    track_id?: number;
    //  categories?: Array<CategoryFilterI>;
    //  cars?: Array<CarFilterI>;
    //  tires?: Array<TireFilterI>;
    //  weatherList?: Array<WeatherFilterI>;
}

const Modal: React.FC<ModalProps> = ({
    setModal,
    profile,
    lapInsert,
    track_id,
}: //  categories,
//  cars,
//  tires,
//  weatherList,
ModalProps) => {
    const server = import.meta.env.VITE_BACKEND;

    // CHANGE PROFILE PICTURE
    const handleProfilePictureSubmit = () => {
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
            fileInput.click();
        }
        // TODO add upload logic
    };

    //  LAP INSERT
    const [tireId, setTireId] = useState<number | null>(null);
    const [weather, setWeather] = useState<string | null>(null);
    const [date, setDate] = useState<string>("");
    const [trackTemperature, setTrackTemperature] = useState<number>(30);
    const [minute, setMinute] = useState<number>(1);
    const [seconds, setSeconds] = useState<number>(1);
    const [miliseconds, setMiliseconds] = useState<number>(1);

    const { categories, cars, tires, weatherList, categoryId, setCategoryId, carId, setCarId } = useFilters(track_id);
    const handleLapSubmit = async () => {
        let userString = sessionStorage.getItem("user");
        let user = {} as UserI;
        if (userString !== null) user = JSON.parse(userString);

        let trackCondition = {
            conditions_id: 0,
            track_id: track_id!,
            time: Date.now().toString(),
            tire_id: tireId,
            track_temperature: Number(trackTemperature),
            weather: weather,
        } as TrackConditionI;
        console.log(trackCondition);

        let lap = {
            car_id: carId,
            driver_id: user.user_id,
            lap_id: 0,
            lap_time_ms: minute * 60000 + seconds * 1000 + miliseconds,
            track_id: track_id!,
            conditions_id: 0,
            date: date,
        } as LapsI;

        let response = (await fetch(server + "api/lap/", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ lap, trackCondition }),
        })) as Response;
        if (response.status == 200) {
            setModal(false);
            window.location.reload();
        } else if (response.status == 400) {
            let data = JSON.parse(await response.text()) as { err: string; inserted: boolean };
            alert(data.err);
        }
    };
    return (
        <>
            {profile && (
                <>
                    <div className="modal-background" onClick={() => setModal(false)}></div>
                    <div className="modal">
                        <div>
                            <p onClick={() => setModal(false)}>X</p>
                        </div>
                        <h1>Change your profile picture</h1>
                        <img src={profilePic} alt="todo change with backed" />
                        <input id="fileInput" type="file" style={{ display: "none" }} />
                        <Button
                            label="Upload new picture"
                            onClick={handleProfilePictureSubmit}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                        <div className="modal-space"></div>
                    </div>
                </>
            )}
            {lapInsert && (
                <>
                    <div className="modal-background" onClick={() => setModal(false)}></div>
                    <div className="modal">
                        <div>
                            <p onClick={() => setModal(false)}>X</p>
                        </div>
                        <h1>Submit your lap</h1>
                        <FormInput
                            label="Category"
                            array={categories}
                            type="select"
                            width={"80%"}
                            value={categoryId?.toString() ?? ""}
                            light
                            onChange={(val) => {
                                setCategoryId(val === "" ? null : Number(val));
                            }}
                        />
                        <FormInput
                            label="Cars"
                            array={cars}
                            type="select"
                            value={carId?.toString() ?? ""}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setCarId(val === "" ? null : Number(val));
                            }}
                        />
                        <FormInput
                            label="Tires"
                            array={tires}
                            type="select"
                            value={tireId?.toString() ?? ""}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setTireId(val === "" ? null : Number(val));
                            }}
                        />
                        <FormInput
                            label="Weather"
                            array={weatherList}
                            type="select"
                            value={weather ?? ""}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setWeather(val === "" ? null : val);
                            }}
                        />
                        <FormInput
                            label="Date"
                            type="date"
                            value={date?.toString() ?? ""}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setDate(val);
                            }}
                        />
                        <FormInput
                            label="Track Temperature (°C)"
                            type="text"
                            value={trackTemperature.toString()}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                if (!isNaN(Number(val))) {
                                    setTrackTemperature(Number(val));
                                }
                            }}
                        />
                        <FormInput
                            label=""
                            type="text"
                            value={minute.toString()}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                if (!isNaN(Number(val))) {
                                    setMinute(Number(val));
                                }
                            }}
                        />
                        <FormInput
                            label=""
                            type="text"
                            value={seconds.toString()}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                if (!isNaN(Number(val))) {
                                    setSeconds(Number(val));
                                }
                            }}
                        />
                        <FormInput
                            label=""
                            type="text"
                            value={miliseconds.toString()}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                if (!isNaN(Number(val))) {
                                    setMiliseconds(Number(val));
                                }
                            }}
                        />
                        <Button
                            label="Submit Lap"
                            onClick={handleLapSubmit}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                        <div className="modal-space"></div>
                    </div>
                </>
            )}
        </>
    );
};

export default Modal;
