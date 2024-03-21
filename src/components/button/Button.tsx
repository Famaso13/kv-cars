import React from "react";
import { colors } from "../../../colors.js";

interface buttonInterface {
  type: "main" | "secondary";
  text: string;
}

const Button: React.FC<buttonInterface> = ({ type, text }) => {
  return type === "main" ? (
    <div className="button" style={{ backgroundColor: colors.main }}>
      {text}
    </div>
  ) : type === "secondary" ? (
    <div className="button">{text}</div>
  ) : null;
};

export default Button;
