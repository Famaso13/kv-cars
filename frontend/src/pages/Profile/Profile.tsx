import "./profile.scss";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import type { UserI, UserStatsI } from "../../interfaces/usersI";
import LeaderboardListings from "../../components/LeaderboardListings/LeaderboardListings";

const Profile = () => {
    const server = import.meta.env.VITE_BACKEND;
    const [warning, setWarning] = useState("");

    const [bestLap, setBestLap] = useState("");
    const [bestCar, setBestCar] = useState("");
    const [login, setLogin] = useState<UserI>({} as UserI);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [country, setCountry] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const getUserFromStorage = () => {
        let userStorage = sessionStorage.getItem("user");
        if (userStorage !== null) {
            let user = JSON.parse(userStorage) as UserI;
            setLogin(user);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
            setUsername(user.username);
            setPassword(user.password);
            setDateOfBirth(user.date_of_birth);
            setCountry(user.country);
            setLoggedIn(true);
            setProfilePicture(`${server}api/user/${user.user_id}/image`);
        }
    };

    useEffect(() => {
        getUserFromStorage();
    }, []);

    useEffect(() => {
        if (login.user_id !== undefined) {
            const fetchStats = async (driver_id: number | null) => {
                let response = (await fetch(server + "api/user/stats/" + driver_id)) as Response;
                if (response.status == 200) {
                    let data = JSON.parse(await response.text()) as UserStatsI;
                    setBestLap(`${data.best_lap}, ${data.best_lap_track}`);
                    setBestCar(data.most_used_car);
                }
            };
            fetchStats(login.user_id);
        }
    }, [login.user_id, server]);

    const [loggedIn, setLoggedIn] = useState(false);
    const [editInfo, setEditInfo] = useState(false);
    const [pictureModal, setPictureModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const handleEdit = async () => {
        let user: UserI = {
            user_id: login.user_id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            date_of_birth: dateOfBirth,
            username: username,
            country: country,
            password: password,
            date_created: login.date_created,
            admin: login.admin,
        };
        let response = (await fetch(server + "api/user/update/", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(user),
        })) as Response;
        if (response.status == 200) {
            setEditInfo(false);
            sessionStorage.clear();
            sessionStorage.setItem("user", JSON.stringify(user));
        } else if (response.status == 400) {
            let data = JSON.parse(await response.text()) as { err: string; inserted: boolean };
            setWarning(data.err);
        }
    };

    return (
        <>
            {pictureModal && <Modal setModal={setPictureModal} type="profile" />}
            <Header loggedIn={loggedIn} />
            <div className="full-screen">
                <div className="left-profile">
                    <div className="profile-info">
                        <img className="profile-picture" src={profilePicture === "" ? profile : profilePicture} />
                        <h1>{login.username}</h1>
                        <p onClick={() => setPictureModal(true)}>Change profile picture</p>
                    </div>
                    <div className="profile-details">
                        <p>
                            Best lap time:
                            <br /> {bestLap}
                        </p>
                        <p>
                            Most used car:
                            <br /> {bestCar}
                        </p>
                    </div>
                    <Button label="Log out" onClick={handleLogout} style="secondary" width={"50%"} height={"70px"} />
                </div>
                <div className="right-profile">
                    <h1>Your racing info</h1>
                    <div className="profile-content-scroll">
                        <p className="warning-text" style={warning === "" ? { display: "none" } : { display: "block" }}>
                            {warning}
                        </p>
                        <form>
                            <div className="column-profile">
                                <FormInput
                                    label="First Name"
                                    value={firstName}
                                    onChange={setFirstName}
                                    type="text"
                                    width={"80%"}
                                    disabled={!editInfo}
                                />
                                <FormInput
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    width={"80%"}
                                    disabled={!editInfo}
                                />
                                <FormInput
                                    label="Username"
                                    type="text"
                                    value={username}
                                    onChange={setUsername}
                                    width={"80%"}
                                    disabled={!editInfo}
                                />
                                <FormInput
                                    label="Password"
                                    type={editInfo ? "text" : "password"}
                                    value={password}
                                    onChange={setPassword}
                                    width={"80%"}
                                    disabled={!editInfo}
                                />
                            </div>
                            <div className="column-profile">
                                <FormInput
                                    label="Last Name"
                                    type="text"
                                    value={lastName}
                                    onChange={setLastName}
                                    width={"80%"}
                                    disabled={!editInfo}
                                />
                                <FormInput
                                    label="Date of birth"
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    width={"80%"}
                                    disabled={!editInfo}
                                />
                                <FormInput
                                    label="Country"
                                    type="text"
                                    value={country}
                                    onChange={setCountry}
                                    width={"80%"}
                                    disabled={!editInfo}
                                />

                                {editInfo ? (
                                    <Button
                                        label="Save changes"
                                        onClick={() => {
                                            handleEdit();
                                        }}
                                        style="primary"
                                        width={"80%"}
                                        height={"70px"}
                                    />
                                ) : (
                                    <Button
                                        label="Edit info"
                                        onClick={() => setEditInfo(true)}
                                        style="primary"
                                        width={"80%"}
                                        height={"70px"}
                                    />
                                )}
                            </div>
                        </form>
                        <div className="profile-leaderboard">
                            <LeaderboardListings driver_id={login.user_id} type="profile" />
                        </div>
                        <div>
                            <h2>Be the best on track!</h2>
                            <p>Your information will be used do display on leaderboards.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
