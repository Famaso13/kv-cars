import logo from "../../assets/Klogo1.svg";
import "../Header.css";
import Button from "../button/Button";

const Header = () => {
  return (
    <div className="header">
      <div style={{ width: "15%" }}>
        <img src={logo} />
      </div>
      <div style={{ width: "75%" }}></div>
      <div style={{ width: "10%" }}>
        <Button type="main" text="Sign in" />
      </div>
    </div>
  );
};

export default Header;
