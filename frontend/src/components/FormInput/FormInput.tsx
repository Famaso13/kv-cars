import type { CarFilterI, CategoryFilterI, TireFilterI, WeatherFilterI } from "../../interfaces/filtersI";
import "./formInput.scss";

interface InputProps {
    label: string;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean;
    type: string;
    width?: string | number;
    height?: string | number;
    value?: string;
    array?: Array<CategoryFilterI> | Array<CarFilterI> | Array<TireFilterI> | Array<WeatherFilterI>;
    light?: boolean;
    checked?: boolean;
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
    checked,
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
                            value={value ?? ""}
                            onChange={(e) => onChange?.(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            {array?.map((item, i) => {
                                const val =
                                    (item as any).category_id?.toString() ??
                                    (item as any).car_id?.toString() ??
                                    (item as any).tire_id?.toString() ??
                                    (item as any).weather ??
                                    (item as any).type ??
                                    "some_value";
                                const label =
                                    (item as any).name ??
                                    (item as any).car ??
                                    (item as any).type ??
                                    (item as any).weather ??
                                    val;

                                return (
                                    <option key={val + i} value={val}>
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                </>
            ) : type === "checkbox" ? (
                <div className="input-checkbox" style={{ width, height }}>
                    <input
                        value={value}
                        id={label}
                        disabled={disabled}
                        placeholder={placeholder}
                        checked={checked}
                        type={type}
                        required={required}
                        // onChange={(e) => onChange?.(e.target.checked)}
                    />
                    <label htmlFor={label} className={light ? "label light" : "label"}>
                        {label}
                    </label>
                </div>
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
