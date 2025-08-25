import "./login.css";
import logo from "../../assets/logoWhite.png";
import { useState } from "react";
import Form from "../../components/Form/Form";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

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
                <div className="form-container">
                    <Form isLogin={isLogin} setIsLogin={setIsLogin} />
                </div>
                <div className="space"></div>
            </div>
        </div>
    );
};

export default Login;
