import "./header.css";
import logo from "../../assets/logoBlack.svg";
import Button from "../Button/Button";

interface HeaderProps {
    loggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ loggedIn }) => {
    return (
        <header>
            <div className="side">
                <img className="logo" src={logo} />
            </div>
            <div className="main">
                <Button
                    style={"navigation"}
                    label="Track"
                    onClick={() => console.log("link na track")}
                    width={"20%"}
                    height={"50%"}
                />
                <Button
                    style={"navigation"}
                    label="Cars"
                    onClick={() => console.log("link na Cars")}
                    width={"20%"}
                    height={"50%"}
                />
                <Button
                    style={"navigation"}
                    label="Leaderboard"
                    onClick={() => console.log("link na Leaderboard")}
                    width={"20%"}
                    height={"50%"}
                />
            </div>
            <div className="side">
                {loggedIn ? (
                    <Button
                        style="primary"
                        label="Profile name"
                        onClick={() => console.log("link na profile")}
                        width={"80%"}
                        height={"50%"}
                    />
                ) : (
                    <Button
                        style="primary"
                        label="Log in"
                        onClick={() => console.log("link na login")}
                        width={"80%"}
                        height={"50%"}
                    />
                )}
            </div>
        </header>
    );
};

export default Header;
