import { useRef } from "react";
import CustomImage from "./CustomImage";
import editImg from "@assets/images/create-image/edit-img.png";
import imgPrev from "@assets/images/create-image/img-prev.png";

const ImageUploadField = ({ value, onChange, fallbackLetter = "?", label = "", error }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onChange?.(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-[2rem]">
      {label ? (
        <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">{label}</label>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative w-[26.8rem] h-[26.8rem] rounded-[8px]   bg-[#EEEEEE]  overflow-hidden"
        aria-label="Upload photo"
      >
        {value ? (
          <img src={value || imgPrev} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className=" rounded-full w-[15rem] h-[15rem] m-auto  flex items-center justify-center text-white text-[4rem] font-bold">
            {fallbackLetter == "?" ? (
              <img src={imgPrev} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <img src={imgPrev} alt="Preview" className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <span className="absolute bottom-0 right-0 w-[3rem] h-[3rem] rounded-full bg-[#8A8A8A] flex items-center justify-center">
          <CustomImage src={editImg} alt="edit" />
        </span>
      </button>

      {error ? <p className="text-red-500 text-[1.2rem] mt-[0.5rem]">{error}</p> : null}
    </div>
  );
};

export default ImageUploadField;
