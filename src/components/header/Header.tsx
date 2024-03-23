import logo from "../../assets/Klogo1.svg";
import Button from "../button/Button";
import "../Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="nav" style={{ width: "15%" }}>
        <img src={logo} />
      </div>
      <div className="nav" style={{ width: "70%" }}>
        <Button type="selected" text="Track" />
        <Button type="unselected" text="Cars" />
        <Button type="unselected" text="Leaderboard" />
      </div>
      <div
        className="nav"
        style={{ display: "flex", width: "15%", justifyContent: "center" }}
      >
        <Button type="main" text="Sign up" />
      </div>
    </div>
  );
};

export default Header;
