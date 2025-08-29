import "./profile.scss";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import { useEffect, useState } from "react";
import ProfileModal from "../../components/ProfileModal/ProfileModal";
import type { UserI } from "../../interfaces/usersI";

const Profile = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [editInfo, setEditInfo] = useState(false);
    const [pictureModal, setPictureModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const [login, setLogin] = useState<UserI>({} as UserI);
    useEffect(() => {
        let userStorage = sessionStorage.getItem("user");
        if (userStorage !== null) {
            let user = JSON.parse(userStorage) as UserI;
            setLogin(user);
            setLoggedIn(true);
        }
    }, [location]);

    return (
        <>
            {pictureModal && <ProfileModal setModal={setPictureModal} />}
            <Header loggedIn={loggedIn} />
            <div className="full-screen">
                <div className="left-profile">
                    <div className="profile-info">
                        <img className="profile-picture" src={profile} />
                        <h1>{login.username}</h1>
                        <p onClick={() => setPictureModal(true)}>Change profile picture</p>
                    </div>
                    <div className="profile-details">
                        <p>Best lap time: backend TODO</p>
                        <p>Best car: backend TODO</p>
                        <p>Place on Leaderboard: backend TODO</p>
                    </div>
                    <Button label="Log out" onClick={handleLogout} style="secondary" width={"50%"} height={"70px"} />
                </div>
                <div className="right-profile">
                    <h1>Your racing info</h1>
                    <form>
                        <div className="column-profile">
                            <FormInput
                                label="First Name"
                                value="firstname - backend TODO"
                                type="text"
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                value={login.email}
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Username"
                                type="text"
                                value={login.username}
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Password"
                                type={editInfo ? "text" : "password"}
                                value={login.password}
                                width={"80%"}
                                disabled={!editInfo}
                            />
                        </div>
                        <div className="column-profile">
                            <FormInput
                                label="Last Name"
                                type="text"
                                value="lastname - backend TODO"
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Date of birth"
                                type="date"
                                value="dateofbirth - backend TODO"
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Country"
                                type="text"
                                value="country - backend TODO"
                                width={"80%"}
                                disabled={!editInfo}
                            />

                            {editInfo ? (
                                <Button
                                    label="Save changes"
                                    onClick={() => {
                                        setEditInfo(false); /* TODO Add save logic here */
                                    }}
                                    style="primary"
                                    width={"80%"}
                                    height={"80px"}
                                />
                            ) : (
                                <Button
                                    label="Edit info"
                                    onClick={() => setEditInfo(true)}
                                    style="primary"
                                    width={"80%"}
                                    height={"80px"}
                                />
                            )}
                        </div>
                    </form>
                    <div>
                        <h2>Be the best on track!</h2>
                        <p>Your information will be used do display on leaderboards.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
