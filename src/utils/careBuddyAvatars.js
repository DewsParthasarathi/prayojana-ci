import anjali from "@assets/images/profile-images/anjali.png";
import durga from "@assets/images/profile-images/durga.png";
import sreeleela from "@assets/images/profile-images/sreeleela.png";

const AVATAR_MAP = {
  anjali,
  durga,
  sreeleela,
};

export const getCareBuddyAvatar = (name) => AVATAR_MAP[(name || "").trim().toLowerCase()] || null;
