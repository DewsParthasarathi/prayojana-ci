import React from "react";

const CustomImage = ({
  src,
  alt = "Image",
  className = "",
  width,
  height,
  loading = "lazy",
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={` object-cover rounded-lg transition-all duration-300 ${className}`}
      {...props}
    />
  );
};

export default CustomImage;
