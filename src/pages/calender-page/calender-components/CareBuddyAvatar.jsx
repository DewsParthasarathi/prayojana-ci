import CustomImage from "@/components/image-component/CustomImage";
import { getCareBuddyAvatar } from "../../../utils/careBuddyAvatars";

const CareBuddyAvatar = ({ name, size = "2.6rem", className = "", ringed = false }) => {
  const avatarSrc = getCareBuddyAvatar(name);

  return (
    <div
      title={name}
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden shrink-0 ${
        ringed ? "ring-2 ring-white" : ""
      } ${className}`}
    >
      {avatarSrc ? (
        <CustomImage
          src={avatarSrc}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-[#1287E3] flex items-center justify-center text-white font-semibold text-[1.1rem]">
          {(name || "?").charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default CareBuddyAvatar;
