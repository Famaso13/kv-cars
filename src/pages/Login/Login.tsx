import "./login.css";
import logo from "../../assets/logoWhite.png";
import { useState } from "react";

const Login = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="full-screen">
            <div className="half">
                <img
                    className="full-screen"
                    src={isLogin ? "/login.png" : "/signin.png"}
                    alt={isLogin ? "driverLogIn" : "driverSignIn"}
                />
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
