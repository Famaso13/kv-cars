import "./login.css";
import "../../App.css";
import logo from "../../assets/logoWhite.png";
import { useState } from "react";
import Form from "../../components/Form/Form";
import { Link } from "react-router-dom";

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
                    <Link className="logoLogin" to={"/"}>
                        <img className="logoLogin" src={logo} alt="logo" />
                    </Link>
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
