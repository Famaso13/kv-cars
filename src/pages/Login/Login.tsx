import "./login.css";
import logo from "../../assets/logoWhite.png";
import { useState } from "react";
import Button from "../../components/Button/Button";
import FormInput from "../../components/FormInput/FormInput";

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
                    <FormInput label="First Name" type="text" placeholder="John" width="50%" />
                    {isLogin ? (
                        <Button primary={true} label="Log In" onClick={() => setIsLogin(false)} width="50%" />
                    ) : (
                        <Button primary={true} label="Sign In" onClick={() => setIsLogin(true)} width="50%" />
                    )}
                </div>
                <div className="space"></div>
            </div>
        </div>
    );
};

export default Login;
