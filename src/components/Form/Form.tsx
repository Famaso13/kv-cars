import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import "./form.css";
import "../../App.css";

interface FormProps {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
}

const Form: React.FC<FormProps> = ({ isLogin, setIsLogin }) => {
    return (
        <form className="form">
            {isLogin ? (
                <h2 className="heading">
                    Already accepted the challenge?
                    <br />
                    Log in and embrace the speed.
                </h2>
            ) : (
                <h2 className="heading">
                    Think you can handle the speed?
                    <br />
                    Sing up and start your journey today.
                </h2>
            )}
            <div className="inputs">
                {isLogin ? (
                    <>
                        <FormInput
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            width="80%"
                            required
                        />
                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            width="80%"
                            required
                        />
                    </>
                ) : (
                    <>
                        <FormInput label="Email" type="email" placeholder="Enter your email" width="80%" required />
                        <FormInput
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            width="80%"
                            required
                        />
                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            width="80%"
                            required
                        />
                    </>
                )}
            </div>
            {isLogin ? (
                <Button
                    style={"primary"}
                    type="submit"
                    label="Log In"
                    onClick={() => console.log("login")}
                    width="50%"
                />
            ) : (
                <Button
                    style={"primary"}
                    type="submit"
                    label="Sign Up"
                    onClick={() => console.log("signup")}
                    width="50%"
                />
            )}
            {isLogin ? (
                <p className="helping-text">
                    Think you can handle the speed?
                    <br /> <span onClick={() => setIsLogin(false)}>Sing up</span>
                    &nbsp;and start your journey today.
                </p>
            ) : (
                <p className="helping-text">
                    Already accepted the challenge?
                    <br /> <span onClick={() => setIsLogin(true)}>Log in</span>
                    &nbsp;and embrace the speed.
                </p>
            )}
        </form>
    );
};

export default Form;
