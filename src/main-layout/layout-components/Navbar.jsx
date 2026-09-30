import CustomImage from "@/components/image-component/CustomImage";
import CustomInput from "@/components/input-component/CustomInput";
import React, { useEffect, useRef, useState } from "react";
import settingsLogo from "@assets/images/logos/settings.png";
import themeLogo from "@assets/images/logos/theme.png";
import notificationLogo from "@assets/images/logos/notification.png";
import useFetch from "@/hooks/useFetch";
import anjali from "@assets/images/profile-images/anjali.png";
import durga from "@assets/images/profile-images/durga.png";
import sreeleela from "@assets/images/profile-images/sreeleela.png";
import downArrow from "@assets/images/profile-images/dropdownarrow.png";
import searchIcon from "@assets/images/detailspage-img/search-icon.svg";
import memberDetailsHamburger from "@assets/images/detailspage-img/member-details-hamburger.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalSearch } from "@/hooks/globalSearchContext.jsx";
import { ROUTES } from "@/routes/routes";
import DarkMode from "@/components/theme-component/DarkMode";

const Navbar = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [validUser, setValidUser] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useGlobalSearch();
  const isMemberDetailsPage = location.pathname === ROUTES.MEMBERDETAILS;
  const isHouseholdDetailsPage = location.pathname === ROUTES.HOUSEHOLD;
  const profileRef = useRef(null);
  const handleLogoutPopup = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };
  const handleLogout = () => {
    sessionStorage.removeItem("authUser");
    window.location.reload();
    navigate("/login");
  };
  const { data = [], error } = useFetch("http://localhost:4000/admins");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("authUser"));

    if (user) {
      setActiveUser(user);
    }
  }, []);

  useEffect(() => {
    if (!activeUser || !Array.isArray(data) || data.length === 0) return;

    const validUser = data.find((admin) => admin.mobile === activeUser.mobile);
    setValidUser(validUser);
    console.log("Valid User:", validUser);
  }, [activeUser, data]);

  useEffect(() => {
    if (!showLogoutPopup) return undefined;

    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowLogoutPopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showLogoutPopup]);

  return (
    <div className="w-full h-auto flex items-center justify-between gap-[1.6rem]">
      {isHouseholdDetailsPage ? (
        ""
      ) : (
        <button
          type="button"
          aria-label="Member details menu"
          className="member-details-hamburger w-[4.8rem] h-[4.5rem] shrink-0 flex items-center justify-center mb-[10px] "
        >
          <CustomImage
            src={memberDetailsHamburger}
            alt="Member details menu"
            className="w-full h-full rounded-none"
          />
        </button>
      )}

      <div className="search-bar-container w-[57%] h-full">
        <CustomInput
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search Households...."
          leftIcon={searchIcon}
          leftIconClassName="filter-[filter:var(--icon-filter)]"
          inputClassName="bg-(--nav-color) text-[1.6rem] text-(--black) px-[2.2rem] py-[1.5rem] !rounded-[1.6rem]"
        />
      </div>

      <div className="nav-bar-actions flex-1 h-full flex items-center justify-end gap-[5.2rem] pr-[8rem]">
        <div className="w-auto h-full flex items-center justify-between gap-[5.2rem]">
          <div className="settings-wrapper w-[2.8rem] h-auto transition filter-[filter:var(--icon-filter)]">
            <CustomImage src={settingsLogo} />
          </div>
          <div className="theme-wrapper  h-[100%] my-auto transition">
            {/* <CustomImage src={themeLogo} /> */}
            <DarkMode />
          </div>
          <div className="notifications-wrapper w-[2.8rem] h-auto transition filter-[filter:var(--icon-filter)]">
            <CustomImage src={notificationLogo} />
          </div>
        </div>
        <div
          ref={profileRef}
          className="profile w-auto h-full flex items-center justify-center gap-[1rem] cursor-pointer relative"
        >
          <div className="profile-img w-[4.6rem] h-[4.6rem]">
            {validUser?.img ? (
              <CustomImage
                src={
                  validUser.name === "Anjali"
                    ? anjali
                    : validUser.name === "Durga"
                      ? durga
                      : sreeleela
                }
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[4.6rem] h-[4.6rem] rounded-full bg-blue-500 text-white flex items-center justify-center text-[2rem] font-semibold text-lg">
                {validUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="">
            <div onClick={handleLogoutPopup} className="flex items-center gap-[2rem]">
              <div className="text-[14px] text-[var(--color-liteGray)] font-semibold">
                <b>{validUser?.name || "User"}</b>
                <p className="text-[11px] text-[#A4A4A4]">{validUser?.role || "Role"}</p>
              </div>

              <div className="w-[1.5rem]">
                <CustomImage src={downArrow} alt="down Arrow" />
              </div>
            </div>

            <div
              onClick={handleLogout}
              className={`absolute w-full text-center right-0 top-[7rem]  shadow-xl rounded-lg px-6 bg-[#fff] py-6 cursor-pointer text-[1.4rem] font-semibold ${
                showLogoutPopup ? "block" : "hidden"
              }`}
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
