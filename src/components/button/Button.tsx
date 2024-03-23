import React from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../../colors.js";
import "./Button.css";

interface buttonInterface {
  type: "main" | "selected" | "unselected";
  text: string;
}

const Button: React.FC<buttonInterface> = ({ type, text }) => {
  let navigate = useNavigate();
  const signup = () => {
    navigate("signup");
  };

  return type === "main" ? (
    <div
      className="button"
      style={{ backgroundColor: colors.main }}
      onClick={signup}
    >
      <p>{text}</p>
    </div>
  ) : type === "selected" ? (
    <div
      className="button"
      style={{
        backgroundColor: colors.selected,
      }}
    >
      <p style={{ color: colors.selected_text }}>{text}</p>
    </div>
  ) : type === "unselected" ? (
    <div
      className="button"
      style={{
        backgroundColor: colors.unselected,
      }}
    >
      <p
        style={{
          color: colors.unselected_text,
        }}
      >
        {text}
      </p>
    </div>
  ) : null;
};

export default Button;
