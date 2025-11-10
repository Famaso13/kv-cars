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
import type { CarsI } from "../../interfaces/carsI";
import type { TireFilterI } from "../../interfaces/filtersI";
import type { TrackI } from "../../interfaces/tracksI";

interface ModalProps {
    setModal: (value: boolean) => void;
    track_id?: number;
    league_id?: number;
    type?:
        | "lapInsert"
        | "profile"
        | "league"
        | "cars"
        | "tracks"
        | "leaderboard"
        | "leagueDetailAdd"
        | "leagueDetailRemove"
        | "carAdd"
        | "trackAdd";
}

const Modal: React.FC<ModalProps> = ({ setModal, type, track_id, league_id }) => {
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

    const handlePictureSelect = () => {
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

    const handlePictureUpload = async (type: "profile" | "cars" | "track", id?: number) => {
        if (!selectedFile) {
            setError("No image selected yet.");
            return;
        }
        setError(null);
        setUploading(true);
        const form = new FormData();
        form.append("image", selectedFile);

        if (type === "profile") {
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
        } else if (type === "cars") {
            let response = await fetch(server + "api/cars/car/" + id + "/image", {
                method: "PUT",
                body: form,
            });
            if (response.ok) {
                setModal(false);
                window.location.reload();
            } else {
                setError("Upload failed");
            }
        } else if (type === "track") {
            let response = await fetch(server + "api/tracks/track/" + id + "/image", {
                method: "PUT",
                body: form,
            });
            if (response.ok) {
                setModal(false);
                window.location.reload();
            } else {
                setError("Upload failed");
            }
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
    const handleLapSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

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

        let lap = {
            car_id: carId,
            driver_id: user.user_id,
            lap_id: 0,
            lap_time_ms: minute * 60000 + seconds * 1000 + miliseconds,
            track_id: track_id!,
            conditions_id: 0,
            date: date,
            league_id: league_id,
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
            let data = JSON.parse(await response.text()) as {
                err: string;
                inserted: boolean;
            };
            alert(data.err);
        }
    };

    //  CREATE LEAGUE
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [privateLeague, setPrivateLeague] = useState<boolean>(true);

    const handleLeagueCreate: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

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
            let data = JSON.parse(await response.text()) as {
                err: string;
                inserted: boolean;
            };
            alert(data.err);
        }
    };

    //  ADD DRIVER TO LEAGUE
    const [dbUsers, setDbUsers] = useState<UserI[]>([]);
    const [username, setUsername] = useState<string>("");
    const [drivers, setDrivers] = useState<UserI[]>([]);
    const [addSelection, setAddSelection] = useState<UserI[]>([]);
    const [removeSelection, setRemoveSelection] = useState<UserI[]>([]);

    const handleLeagueAddUsers: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        for (const selection of addSelection) {
            let response = (await fetch(server + "api/leagues/" + league_id + "/driver/", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ user_id: selection.user_id }),
            })) as Response;

            if (response.status == 400) {
                let data = JSON.parse(await response.text()) as {
                    err: string;
                    inserted: boolean;
                };
                alert(data.err);
            }
        }

        setModal(false);
    };

    const handleLeagueRemoveUsers: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        for (const selection of removeSelection) {
            let response = (await fetch(server + "api/leagues/" + league_id + "/driver/", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "DELETE",
                body: JSON.stringify({ user_id: selection.user_id }),
            })) as Response;

            if (response.status == 400) {
                let data = JSON.parse(await response.text()) as {
                    err: string;
                    deleted: boolean;
                };
                alert(data.err);
            }
        }

        setModal(false);
    };

    const getAllUsers = async () => {
        const responseUsers = await fetch(server + "api/users");
        if (responseUsers.status === 200) {
            const users = (await responseUsers.json()) as UserI[];

            const responseLeagueUsers = await fetch(server + "api/leagues/drivers/" + league_id);
            if (responseLeagueUsers.status === 200) {
                const driverIds = (await responseLeagueUsers.json()) as Array<{
                    driver_id: number;
                }>;

                const driverIdSet = new Set(driverIds.map((d) => Number(d.driver_id)));

                const leagueDrivers = users.filter((u) => driverIdSet.has(Number(u.user_id)));
                const nonLeagueUsers = users.filter((u) => !driverIdSet.has(Number(u.user_id)));

                setDrivers(leagueDrivers);
                setDbUsers(nonLeagueUsers);
            }
        }
    };

    const toggleDriver = (driver: UserI) => {
        setAddSelection((prev) =>
            prev.some((d) => d.user_id === driver.user_id)
                ? prev.filter((d) => d.user_id !== driver.user_id)
                : [...prev, driver]
        );
    };

    const toggleRemoveDriver = (driver: UserI) => {
        setRemoveSelection((prev) =>
            prev.some((d) => d.user_id === driver.user_id)
                ? prev.filter((d) => d.user_id !== driver.user_id)
                : [...prev, driver]
        );
    };

    useEffect(() => {
        getAllUsers();
    }, [type == "leagueDetailAdd"]);

    //  CAR ADD
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [horsepower, setHorspower] = useState(100);
    const [mass, setMass] = useState(1000);
    const [selectedTires, setSelectedTires] = useState<number[]>([]);
    const [dbTires, setDbTires] = useState<TireFilterI[]>([]);

    const getAllTires = async () => {
        let response = (await fetch(server + "api/filters/tires/")) as Response;
        if (response.status === 200) {
            let data = JSON.parse(await response.text()) as TireFilterI[];
            setDbTires(data);
        }
    };

    const normalizeTireId = (t: any) => Number(t.tire_id);
    const normalizeTireLabel = (t: any) => String(t.type);

    const toggleTire = (id: number) => {
        setSelectedTires((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const selectAllTires = () => {
        const all = (dbTires ?? []).map(normalizeTireId);
        setSelectedTires(all);
    };

    const clearTires = () => setSelectedTires([]);

    const handleCarAdd: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const car = {
            make: make,
            model: model,
            category_id: categoryId,
            horsepower: horsepower,
            mass: mass,
        } as CarsI;
        let response = (await fetch(server + "api/car", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(car),
        })) as Response;
        if (response.status == 400) {
            let data = JSON.parse(await response.text()) as {
                err: string;
                inserted: boolean;
            };
            alert(data.err);
        } else {
            let data = JSON.parse(await response.text()) as {
                err: string;
                inserted: boolean;
                car_id: number;
            };

            try {
                for (let tire of selectedTires) {
                    await fetch(server + `api/cars/${data.car_id}/${tire}`, {
                        method: "POST",
                    });
                }
            } catch (e) {
                console.warn("Failed to attach tires:", e);
            }

            handlePictureUpload("cars", data.car_id);
        }
        setModal(false);
    };

    useEffect(() => {
        getAllTires();
    }, [type == "carAdd"]);

    //  TRACK ADD

    const [trackName, setTrackName] = useState("");
    const [location, setLocation] = useState("");
    const [length, setLength] = useState(1.0);
    const [corner, setCorner] = useState("");

    const handleTrackAdd: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const trackAdd = {
            name: trackName,
            location: location,
            length_km: length,
            famous_corner: corner,
        } as TrackI;

        let response = (await fetch(server + "api/track", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(trackAdd),
        })) as Response;
        if (response.status == 400) {
            let data = JSON.parse(await response.text()) as {
                err: string;
                inserted: boolean;
            };
            alert(data.err);
        } else {
            let data = JSON.parse(await response.text()) as {
                err: string;
                inserted: boolean;
                track_id: number;
            };
            handlePictureUpload("track", data.track_id);
        }
        setModal(false);
    };

    return (
        <>
            <div
                className="modal-background"
                onClick={() => {
                    if (!uploading) setModal(false);
                }}
            ></div>
            <div className="modal" style={type === "carAdd" ? { top: "10dvh" } : { top: "15dvh" }}>
                <div className="modal-exit">
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
                ) : type === "league" ? (
                    <h1>Create a League</h1>
                ) : type === "carAdd" ? (
                    <h1>Add a car</h1>
                ) : type === "trackAdd" ? (
                    <h1>Add a league</h1>
                ) : type === "leagueDetailAdd" ? (
                    <h1>Add a participant</h1>
                ) : (
                    type === "leagueDetailRemove" && <h1>Remove a participant</h1>
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
                            onClick={handlePictureSelect}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                            disabled={uploading}
                        />
                        <Button
                            label={uploading ? "Uploading..." : "Confirm selected image"}
                            onClick={() => handlePictureUpload("profile")}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                            disabled={uploading}
                        />
                    </>
                )}

                {type === "lapInsert" && (
                    <form onSubmit={handleLapSubmit}>
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
                            />
                        </div>
                        <Button
                            label="Submit Lap"
                            onClick={() => {}}
                            type="submit"
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </form>
                )}
                {type === "league" && (
                    <form onSubmit={handleLeagueCreate}>
                        <FormInput
                            label="Name"
                            type="text"
                            value={name}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setName(val.toString());
                            }}
                            required
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
                            onChangeCheckbox={(val) => {
                                setPrivateLeague(Boolean(val));
                            }}
                        />
                        <Button
                            label="Create League"
                            onClick={() => {}}
                            type="submit"
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </form>
                )}

                {type === "leagueDetailAdd" && (
                    <form onSubmit={handleLeagueAddUsers}>
                        {addSelection.length > 0 ? (
                            <p>{addSelection.map((driver) => driver.username).join(", ")}</p>
                        ) : (
                            <p>No driver selected</p>
                        )}
                        <FormInput
                            label="Driver username"
                            type="text"
                            value={username}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setUsername(val.toString());
                            }}
                        />
                        <div className="driver-add-container">
                            {dbUsers.length > 0 ? (
                                dbUsers
                                    .filter((u) => u.username.toLowerCase().includes(username.toLowerCase()))
                                    .map((driver) => {
                                        const isSelected = addSelection.some((d) => d.user_id === driver.user_id);

                                        return (
                                            <p
                                                key={driver.user_id}
                                                onClick={() => toggleDriver(driver)}
                                                className={isSelected ? "modal-driver-selected" : "modal-driver"}
                                            >
                                                {driver.username}
                                            </p>
                                        );
                                    })
                            ) : (
                                <p>No drivers</p>
                            )}
                        </div>
                        <Button
                            label="Add League Drivers"
                            onClick={() => {}}
                            type="submit"
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </form>
                )}

                {type === "leagueDetailRemove" && (
                    <form onSubmit={handleLeagueRemoveUsers}>
                        {removeSelection.length > 0 ? (
                            <p>{removeSelection.map((driver) => driver.username).join(", ")}</p>
                        ) : (
                            <p>No driver selected</p>
                        )}
                        <FormInput
                            label="Driver username"
                            type="text"
                            value={username}
                            light
                            width={"80%"}
                            onChange={(val) => {
                                setUsername(val.toString());
                            }}
                        />
                        <div className="driver-add-container">
                            {drivers.length > 0 ? (
                                drivers
                                    .filter((u) => u.username.toLowerCase().includes(username.toLowerCase()))
                                    .map((driver) => {
                                        const isSelected = removeSelection.some((d) => d.user_id === driver.user_id);

                                        return (
                                            <p
                                                key={driver.user_id}
                                                onClick={() => toggleRemoveDriver(driver)}
                                                className={isSelected ? "modal-driver-selected" : "modal-driver"}
                                            >
                                                {driver.username}
                                            </p>
                                        );
                                    })
                            ) : (
                                <p>No drivers</p>
                            )}
                        </div>
                        <Button
                            label="Remove League Drivers"
                            onClick={() => {}}
                            type="submit"
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </form>
                )}
                {type === "carAdd" && (
                    <form onSubmit={handleCarAdd}>
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
                            onClick={handlePictureSelect}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                            disabled={uploading}
                        />
                        <div className="modal-grid-3">
                            <FormInput
                                label="Make"
                                type="text"
                                value={make}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    setMake(val.toString());
                                }}
                                required
                            />
                            <FormInput
                                label="Model"
                                type="text"
                                value={model}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    setModel(val.toString());
                                }}
                                required
                            />
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
                                required
                            />
                        </div>
                        <div className="tire-picker-header">
                            <h3>Compatible Tires</h3>
                            <div className="tire-picker-actions">
                                <button className="tire-action" type="button" onClick={selectAllTires}>
                                    Select all
                                </button>
                                <button className="tire-action" type="button" onClick={clearTires}>
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="tire-picker">
                            {(dbTires ?? []).map((t: any) => {
                                const id = normalizeTireId(t);
                                const label = normalizeTireLabel(t);
                                const checked = selectedTires.includes(id);
                                return (
                                    <label key={id} className={`tire-chip ${checked ? "checked" : ""}`}>
                                        <input type="checkbox" checked={checked} onChange={() => toggleTire(id)} />
                                        <span>{label}</span>
                                    </label>
                                );
                            })}
                            {(!dbTires || dbTires.length === 0) && <p className="tire-empty">No tires available</p>}
                        </div>
                        <div className="modal-grid-2">
                            <FormInput
                                label="Horsepower"
                                type="text"
                                value={horsepower.toString()}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    if (!isNaN(Number(val))) {
                                        setHorspower(Number(val));
                                    }
                                }}
                                required
                            />
                            <FormInput
                                label="Mass"
                                type="text"
                                value={mass.toString()}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    if (!isNaN(Number(val))) {
                                        setMass(Number(val));
                                    }
                                }}
                                required
                            />
                        </div>
                        <Button
                            label="Add Car"
                            onClick={() => {}}
                            type="submit"
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </form>
                )}
                {type === "trackAdd" && (
                    <form onSubmit={handleTrackAdd}>
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
                            onClick={handlePictureSelect}
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                            disabled={uploading}
                        />
                        <div className="modal-grid-2">
                            <FormInput
                                label="Name"
                                type="text"
                                value={trackName}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    setTrackName(val.toString());
                                }}
                                required
                            />
                            <FormInput
                                label="Location"
                                type="text"
                                value={location}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    setLocation(val.toString());
                                }}
                                required
                            />
                        </div>
                        <div className="modal-grid-2">
                            <FormInput
                                label="Length (km)"
                                type="number"
                                value={length.toString()}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    if (!isNaN(Number(val))) {
                                        setLength(Number(val));
                                    }
                                }}
                                required
                            />
                            <FormInput
                                label="Famous Corner"
                                type="text"
                                value={corner}
                                light
                                width={"80%"}
                                onChange={(val) => {
                                    setCorner(val.toString());
                                }}
                                required
                            />
                        </div>
                        <Button
                            label="Add Track"
                            onClick={() => {}}
                            type="submit"
                            style="secondary"
                            width={"40%"}
                            height={"70px"}
                        />
                    </form>
                )}

                <div className="modal-space"></div>
            </div>
        </>
    );
};

export default Modal;
