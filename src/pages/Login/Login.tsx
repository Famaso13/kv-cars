import "./login.css";
import logo from "../../assets/logoWhite.png";

const Login = () => {
    return (
        <div className="full-screen">
            <div className="half">
                <img className="full-screen" src="/login.png" alt="driver" />
            </div>
            <div className="half">
                <div className="space">
                    <img className="logo" src={logo} alt="logo" />
                </div>
                <div className="form-container"></div>
                <div className="space"></div>
            </div>
        </div>
    );
};

export default Login;
