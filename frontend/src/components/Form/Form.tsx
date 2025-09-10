import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import "./form.css";
import "../../App.css";
import React, { useState } from "react";
import type { UserI } from "../../interfaces/usersI";
import { useNavigate } from "react-router-dom";

interface FormProps {
	isLogin: boolean;
	setIsLogin: (isLogin: boolean) => void;
}

const Form: React.FC<FormProps> = ({ isLogin, setIsLogin }) => {
	const server = import.meta.env.VITE_BACKEND;
	let navigate = useNavigate();

	const [warning, setWarning] = useState("");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const clearFields = () => {
		setWarning("");
		setUsername("");
		setPassword("");
		setEmail("");
	};

	const handleLogin = async () => {
		let response = (await fetch(
			server + "api/user/login/?username=" + username + "&pass=" + password
		)) as Response;
		if (response.status == 200) {
			let data = JSON.parse(await response.text()) as Array<UserI>;
			if (data !== null) {
				sessionStorage.setItem("user", JSON.stringify(data));
				navigate("/");
			} else {
				clearFields();
				setWarning("Incorrect username or password!");
			}
		}
	};

	const handleRegister = async () => {
		let response = (await fetch(server + "api/user/register/", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({ username, password, email }),
		})) as Response;
		console.log(response);
		if (response.status == 200) {
			clearFields();
			setIsLogin(true);
		} else if (response.status == 400) {
			let data = JSON.parse(await response.text()) as {
				err: string;
				inserted: boolean;
			};
			clearFields();
			setWarning(data.err);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isLogin) {
			handleLogin();
		} else {
			handleRegister();
		}
	};
	return (
		<form className="form" onSubmit={handleSubmit}>
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
							value={username}
							onChange={setUsername}
						/>
						<FormInput
							label="Password"
							type="password"
							placeholder="Enter your password"
							width="80%"
							required
							value={password}
							onChange={setPassword}
						/>
					</>
				) : (
					<>
						<FormInput
							label="Email"
							type="email"
							placeholder="Enter your email"
							width="80%"
							required
							value={email}
							onChange={setEmail}
						/>
						<FormInput
							label="Username"
							type="text"
							placeholder="Enter your username"
							width="80%"
							required
							value={username}
							onChange={setUsername}
						/>
						<FormInput
							label="Password"
							type="password"
							placeholder="Enter your password"
							width="80%"
							required
							value={password}
							onChange={setPassword}
						/>
					</>
				)}
				<div>
					<p className="warning-text">{warning}</p>
				</div>
			</div>
			{isLogin ? (
				<Button
					style={"primary"}
					type="submit"
					label="Log In"
					onClick={() => {}}
					width="50%"
				/>
			) : (
				<Button
					style={"primary"}
					type="submit"
					label="Sign Up"
					onClick={() => {}}
					width="50%"
				/>
			)}
			{isLogin ? (
				<p className="helping-text">
					Think you can handle the speed?
					<br />{" "}
					<span
						onClick={() => {
							clearFields();
							setIsLogin(false);
						}}
					>
						Sing up
					</span>
					&nbsp;and start your journey today.
				</p>
			) : (
				<p className="helping-text">
					Already accepted the challenge?
					<br />{" "}
					<span
						onClick={() => {
							clearFields();
							setIsLogin(true);
						}}
					>
						Log in
					</span>
					&nbsp;and embrace the speed.
				</p>
			)}
		</form>
	);
};

export default Form;
