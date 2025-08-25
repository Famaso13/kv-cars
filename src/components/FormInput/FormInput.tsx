import "./formInput.css";

interface InputProps {
    label: string;
    disabled?: boolean;
    placeholder?: string;
    type: string;
    width?: string | number;
    height?: string | number;
}

const FormInput: React.FC<InputProps> = ({ label, disabled, placeholder, type, width, height }) => {
    return (
        <label htmlFor="input" className="label" style={{ width, height }}>
            {label}
            <input className="input" id="input" disabled={disabled} placeholder={placeholder} type={type} />
        </label>
    );
};

export default FormInput;
