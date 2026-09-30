import { forwardRef } from "react";

const CustomInput = forwardRef(
  (
    {
      type = "text",
      value,
      height,
      width,
      checked,
      onChange,
      label,
      placeholder,
      className = "",
      inputClassName = "",
      leftIcon,
      leftIconClassName = "",
      ...props
    },
    ref,
  ) => {
    const isCheckable = type === "checkbox" || type === "radio";

    return (
      <label
        style={{ width: width, height: height }}
        className={`flex items-center gap-2 ${
          isCheckable ? "cursor-pointer" : ""
        } ${leftIcon ? "relative" : ""} ${className}`}
      >
        {leftIcon && !isCheckable && (
          <span
            className={`pointer-events-none absolute left-[2rem] top-1/2 -translate-y-1/2 w-[1.8rem] h-[1.8rem] ${leftIconClassName}`}
          >
            <img src={leftIcon} alt="" className="w-full h-full object-contain" />
          </span>
        )}

        <input
          ref={ref}
          type={type}
          value={value}
          checked={checked}
          onChange={onChange}
          placeholder={placeholder}
          className={
            isCheckable
              ? inputClassName
              : `w-full rounded-md  px-3 py-2 outline-none  focus:border-blue-500 ${
                  leftIcon ? "!pl-[5rem]" : ""
                } ${inputClassName}`
          }
          {...props}
        />

        {label && isCheckable && <span>{label}</span>}
      </label>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
