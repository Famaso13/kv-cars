import "./button.css";

interface ButtonProps {
    style?: "primary" | "secondary" | "navigation" | "selected";
    label: string;
    onClick: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    width?: string | number;
    height?: string | number;
}

const Button: React.FC<ButtonProps> = ({
    style: style = "primary",
    label,
    onClick,
    disabled,
    type = "button",
    width,
    height,
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`button ${style}`}
            style={{ width, height }}
        >
            {label}
        </button>
    );
};

export default Button;
