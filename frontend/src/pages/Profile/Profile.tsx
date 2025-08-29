import "./profile.scss";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import { useState } from "react";
import ProfileModal from "../../components/ProfileModal/ProfileModal";

const Profile = () => {
    const [editInfo, setEditInfo] = useState(false);
    const [pictureModal, setPictureModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add logout logic here
        navigate("/");
    };

    return (
        <>
            {pictureModal && <ProfileModal setModal={setPictureModal} />}
            <Header loggedIn={false} />
            <div className="full-screen">
                <div className="left-profile">
                    <div className="profile-info">
                        <img className="profile-picture" src={profile} />
                        <h1>username - backend TODO</h1>
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
                                type="text"
                                value="firstname - backend TODO"
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                value="email - backend TODO"
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Username"
                                type="text"
                                value="username - backend TODO"
                                width={"80%"}
                                disabled={!editInfo}
                            />
                            <FormInput
                                label="Password"
                                type={editInfo ? "text" : "password"}
                                value="password - backend TODO"
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
