import "./formInput.scss";

// TODO - change array type to coresponding select tipes {car, category...}
interface InputProps {
    label: string;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean;
    type: string;
    width?: string | number;
    height?: string | number;
    value?: string;
    array?: Array<string>;
    light?: boolean;
    onChange?: (value: string) => void;
}

const FormInput: React.FC<InputProps> = ({
    label,
    disabled,
    placeholder,
    type,
    width,
    height,
    required,
    value,
    array,
    light,
    onChange,
}) => {
    return (
        <>
            {type === "select" ? (
                <>
                    <label htmlFor={label} className={light ? "label light" : "label"} style={{ width, height }}>
                        {label}
                        <br />
                        <select
                            id={label}
                            name={label}
                            style={{ width: "100%" }}
                            onChange={(e) => onChange?.(e.target.value)}
                        >
                            {array !== undefined &&
                                array.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                        </select>
                    </label>
                </>
            ) : (
                <label htmlFor={label} className={light ? "label light" : "label"} style={{ width, height }}>
                    {label}
                    <input
                        value={value}
                        className="input"
                        id={label}
                        disabled={disabled}
                        placeholder={placeholder}
                        type={type}
                        required={required}
                        onChange={(e) => onChange?.(e.target.value)}
                    />
                </label>
            )}
        </>
    );
};

export default FormInput;
