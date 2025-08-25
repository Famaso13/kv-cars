import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import "./form.css";

interface FormProps {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
}

const Form: React.FC<FormProps> = ({ isLogin, setIsLogin }) => {
    return (
        <form className="form">
            {isLogin ? (
                <h1>
                    Already accepted the challenge?
                    <br />
                    Log in and embrace the speed.
                </h1>
            ) : (
                <h1>
                    Think you can handle the speed?
                    <br />
                    Sing up and start your journey today.
                </h1>
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
                <Button primary={true} type="submit" label="Log In" onClick={() => console.log("login")} width="50%" />
            ) : (
                <Button
                    primary={true}
                    type="submit"
                    label="Sign Up"
                    onClick={() => console.log("signup")}
                    width="50%"
                />
            )}
            {isLogin ? (
                <p>
                    Think you can handle the speed?
                    <br /> <span onClick={() => setIsLogin(false)}>Sing up</span>
                    &nbsp;and start your journey today.
                </p>
            ) : (
                <p>
                    Already accepted the challenge?
                    <br /> <span onClick={() => setIsLogin(true)}>Log in</span>
                    &nbsp;and embrace the speed.
                </p>
            )}
        </form>
    );
};

export default Form;
