import Button from "../Button/Button";
import "./modal.scss";
import profilePic from "../../assets/profile.png";
import type { UserI } from "../../interfaces/usersI";
import FormInput from "../FormInput/FormInput";
import { useFilters } from "../../hooks/useFilters";
import { useEffect, useState } from "react";
import type { TrackConditionI } from "../../interfaces/trackConditionsI";
import type { LapsI } from "../../interfaces/lapsI";
import type { LeaguesI } from "../../interfaces/leaguesI";

interface ModalProps {
    setModal: (value: boolean) => void;
    track_id?: number;
    type?: "lapInsert" | "profile" | "league" | "cars" | "tracks" | "leaderboard";
}

const Modal: React.FC<ModalProps> = ({ setModal, type, track_id }) => {
    const server = import.meta.env.VITE_BACKEND;

    // CHANGE PROFILE PICTURE
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userStorage = sessionStorage.getItem("user");
    let user = {} as UserI;
    if (userStorage) {
        user = JSON.parse(userStorage);
    }

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleProfilePictureSelect = () => {
        setError(null);
        const input = document.getElementById("fileInput") as HTMLInputElement | null;
        input?.click();
    };

    const MAX_MB = 5;

    const handleFilePicked: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            e.target.value = "";
            return;
        }
        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`Image too large. Max ${MAX_MB} MB.`);
            e.target.value = "";
            return;
        }

        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleProfilePictureUpload = async () => {
        if (!selectedFile) {
            setError("No image selected yet.");
            return;
        }
        setError(null);
        setUploading(true);
        const form = new FormData();
        form.append("image", selectedFile);

        let response = await fetch(server + "api/users/user/" + user.user_id + "/image", {
            method: "PUT",
            body: form,
        });
        if (response.ok) {
            setModal(false);
            window.location.reload();
        } else {
            setError("Upload failed");
        }

        setUploading(false);
        const input = document.getElementById("fileInput") as HTMLInputElement | null;
        if (input) input.value = "";
    };

    //  LAP INSERT
    const [tireId, setTireId] = useState<number | null>(null);
    const [weather, setWeather] = useState<string | null>(null);
    const [date, setDate] = useState<string>("");
    const [trackTemperature, setTrackTemperature] = useState<number>(30);
    const [minute, setMinute] = useState<number>(1);
    const [seconds, setSeconds] = useState<number>(1);
    const [miliseconds, setMiliseconds] = useState<number>(1);

    const { categories, cars, tires, weatherList, categoryId, setCategoryId, carId, setCarId } = useFilters();
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
            weather_id: weather,
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

    //  CREATE LEAGUE
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [privateLeague, setPrivateLeague] = useState<boolean>(true);

    const handleLeagueCreate = async () => {
        let league = {
            name: name,
            description: description,
            private: privateLeague,
            owner_id: user.user_id,
        } as LeaguesI;

        let response = (await fetch(server + "api/leagues/", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(league),
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
            <div
                className="modal-background"
                onClick={() => {
                    if (!uploading) setModal(false);
                }}
            ></div>
            <div className="modal">
                <div>
                    <p
                        onClick={() => {
                            if (!uploading) setModal(false);
                        }}
                    >
                        X
                    </p>
                </div>
                {type === "profile" ? (
                    <h1>Change your profile picture</h1>
                ) : type === "lapInsert" ? (
                    <h1>Submit your lap</h1>
                ) : (
                    type === "league" && <h1>Create a League</h1>
                )}
                {type === "profile" && (
                    <>
                        <img src={previewUrl ? previewUrl : profilePic} alt="profilePic preview" />
                        {error && <p style={{ color: "white", marginTop: 12 }}>{error}</p>}
                        <input
                            id="fileInput"
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFilePicked}
                        />
                        <Button
                            label="Select new picture"
                            onClick={handleProfilePictureSelect}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                            disabled={uploading}
                        />
                        <Button
                            label={uploading ? "Uploading..." : "Confirm selected image"}
                            onClick={handleProfilePictureUpload}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                            disabled={uploading}
                        />
                    </>
                )}

                {type === "lapInsert" && (
                    <>
                        <div className="modal-lap">
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
                                    setWeather(val.toString() === "" ? null : val.toString());
                                }}
                            />
                            <FormInput
                                label="Date"
                                type="date"
                                value={date?.toString() ?? ""}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    setDate(val.toString());
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
                        </div>
                        <div className="modal-lap-time">
                            <FormInput
                                label="Lap Time"
                                type="text"
                                value={minute.toString()}
                                light
                                width={"25%"}
                                onChange={(val) => {
                                    if (!isNaN(Number(val))) {
                                        setMinute(Number(val));
                                    }
                                }}
                            />
                            <p>:</p>
                            <FormInput
                                label=""
                                type="text"
                                value={seconds.toString()}
                                light
                                width={"25%"}
                                onChange={(val) => {
                                    if (!isNaN(Number(val))) {
                                        setSeconds(Number(val));
                                    }
                                }}
                            />
                            <p>.</p>
                            <FormInput
                                label=""
                                type="text"
                                value={miliseconds.toString()}
                                light
                                width={"25%"}
                                onChange={(val) => {
                                    if (!isNaN(Number(val))) {
                                        setMiliseconds(Number(val));
                                    }
                                }}
                            />
                        </div>
                        <Button
                            label="Submit Lap"
                            onClick={handleLapSubmit}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </>
                )}
                {type === "league" && (
                    <>
                        <FormInput
                            label="Name"
                            type="text"
                            value={name}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setName(val.toString());
                            }}
                        />
                        <FormInput
                            label="Description"
                            type="text"
                            value={description}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setDescription(val.toString());
                            }}
                        />
                        <FormInput
                            label="Private"
                            type="checkbox"
                            checked={privateLeague}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setPrivateLeague(Boolean(val));
                            }}
                        />
                        <Button
                            label="Create League"
                            onClick={handleLeagueCreate}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </>
                )}

                <div className="modal-space"></div>
            </div>
        </>
    );
};

export default Modal;
