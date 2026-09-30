import React from "react";

const ButtonComponent = ({
  children,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  icon,
  iconPosition = "left",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
};

export default ButtonComponent;
