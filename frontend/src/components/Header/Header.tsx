import "./header.css";
import logo from "../../assets/logoBlack.svg";
import Button from "../Button/Button";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
    loggedIn: boolean;
    currentPage?: "track" | "cars" | "leaderboard";
}

const Header: React.FC<HeaderProps> = ({ loggedIn = false, currentPage }) => {
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
                    style={currentPage === "track" ? "selected" : "navigation"}
                    label="Track"
                    onClick={() => handleNavigate("track")}
                    width={"20%"}
                    height={"50%"}
                />
                <Button
                    style={currentPage === "cars" ? "selected" : "navigation"}
                    label="Cars"
                    onClick={() => handleNavigate("cars")}
                    width={"20%"}
                    height={"50%"}
                />
                <Button
                    style={currentPage === "leaderboard" ? "selected" : "navigation"}
                    label="Leaderboard"
                    onClick={() => handleNavigate("leaderboard")}
                    width={"20%"}
                    height={"50%"}
                />
            </div>
            <div className="side">
                {loggedIn ? (
                    <Button
                        style="primary"
                        label="Profile name"
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
