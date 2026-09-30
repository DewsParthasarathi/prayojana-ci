import React from "react";

const CustomDropdown = ({
  label,
  name,
  value,
  options = [],
  onChange,
  placeholder = "Select",
  disabled = false,
  required = false,
  className = "",
  selectClassName = "",
  error = "",
  width,
}) => {
  return (
    <div style={{ width: width }} className={`flex-1 flex-col gap-2 `}>
      {label && (
        <label htmlFor={name} className={` font-medium ${className}`}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClassName}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default CustomDropdown;
