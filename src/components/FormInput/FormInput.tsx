import "./formInput.css";

interface InputProps {
    label: string;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean;
    type: string;
    width?: string | number;
    height?: string | number;
    value?: string;
}

const FormInput: React.FC<InputProps> = ({ label, disabled, placeholder, type, width, height, required, value }) => {
    return (
        <label htmlFor="input" className="label" style={{ width, height }}>
            {label}
            <input
                value={value}
                className="input"
                id="input"
                disabled={disabled}
                placeholder={placeholder}
                type={type}
                required={required}
            />
        </label>
    );
};

export default FormInput;
