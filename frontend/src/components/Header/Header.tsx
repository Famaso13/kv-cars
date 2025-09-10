import "./header.css";
import logo from "../../assets/logoBlack.svg";
import Button from "../Button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { UserI } from "../../interfaces/usersI";
import { useEffect, useState } from "react";

interface HeaderProps {
    loggedIn: boolean;
    currentPage?: "tracks" | "cars" | "leaderboard" | "leagues";
}

const Header: React.FC<HeaderProps> = ({ loggedIn, currentPage }) => {
    const location = useLocation();
    const [login, setLogin] = useState<UserI>({} as UserI);
    useEffect(() => {
        let userStorage = sessionStorage.getItem("user");
        if (userStorage !== null) {
            let user = JSON.parse(userStorage) as UserI;
            setLogin(user);
        }
    }, [location]);

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleNavigate = (link: string) => {
        if (loggedIn) navigate(`/${link}`);
        else navigate("/login");
    };

    return (
        <header>
            <div className="side">
                <Link className="logoHeader" to="/">
                    <img className="logoHeader" src={logo} />
                </Link>
            </div>
            <div className="main">
                <Button
                    style={currentPage === "tracks" ? "selected" : "navigation"}
                    label="Tracks"
                    onClick={() => handleNavigate("tracks")}
                    // width={"20%"}
                    height={"50%"}
                />
                <Button
                    style={currentPage === "cars" ? "selected" : "navigation"}
                    label="Cars"
                    onClick={() => handleNavigate("cars")}
                    // width={"20%"}
                    height={"50%"}
                />
                <Button
                    style={currentPage === "leaderboard" ? "selected" : "navigation"}
                    label="Leaderboards"
                    onClick={() => handleNavigate("leaderboard")}
                    // width={"30%"}
                    height={"50%"}
                />
                <Button
                    style={currentPage === "leagues" ? "selected" : "navigation"}
                    label="Leagues"
                    onClick={() => handleNavigate("leagues")}
                    // width={"20%"}
                    height={"50%"}
                />
            </div>
            <div className="side">
                {loggedIn ? (
                    <Button
                        style="primary"
                        label={login.username}
                        onClick={() => handleNavigate("profile")}
                        width={"80%"}
                        height={"50%"}
                    />
                ) : (
                    <Button style="primary" label="Log in" onClick={handleLogin} width={"80%"} height={"50%"} />
                )}
            </div>
        </header>
    );
};

export default Header;
