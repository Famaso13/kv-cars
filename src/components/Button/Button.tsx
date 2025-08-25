import "./button.css";

interface ButtonProps {
    primary?: boolean;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    width?: string | number;
    height?: string | number;
}

const Button: React.FC<ButtonProps> = ({
    primary = true,
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
            className={primary ? "primary button" : "secondary button"}
            style={{ width, height }}
        >
            {label}
        </button>
    );
};

export default Button;
