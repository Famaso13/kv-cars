import React from "react";
import { colors } from "../../../colors.js";
import "./Button.css";

interface buttonInterface {
  type: "main" | "selected" | "unselected";
  text: string;
}

const Button: React.FC<buttonInterface> = ({ type, text }) => {
  return type === "main" ? (
    <div
      className="button"
      style={{ backgroundColor: colors.main, color: colors.main_text }}
    >
      <p className="text">{text}</p>
    </div>
  ) : type === "selected" ? (
    <div
      className="button"
      style={{
        backgroundColor: colors.selected,
        color: colors.selected_text,
      }}
    >
      <p className="text">{text}</p>
    </div>
  ) : type === "unselected" ? (
    <div
      className="button"
      style={{
        backgroundColor: colors.unselected,
        color: colors.unselected_text,
      }}
    >
      <p className="text">{text}</p>
    </div>
  ) : null;
};

export default Button;
