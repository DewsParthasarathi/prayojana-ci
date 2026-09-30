import React, { useState } from "react";
import logo from "@assets/images/logos/prayojana-logo.png";
import CustomImage from "@/components/image-component/CustomImage";
import Applogo from "@assets/images/logos/applications.png";
import activeApplogo from "@assets/images/logos/application-active.svg";
import calenderlogo from "@assets/images/logos/calender.png";
import activeCalenderlogo from "@assets/images/logos/active-calender.svg";
import messagelogo from "@assets/images/logos/message.png";
import activeMessagelogo from "@assets/images/logos/active-message.svg";
import houseHoldLogo from "@assets/images/logos/group-icon.svg";
import activeHouseHoldLogo from "@assets/images/logos/active-group.png";
import checkListLogo from "@assets/images/logos/checklists.png";
import activeCheckListLogo from "@assets/images/logos/active-checklist.svg";
import solologo from "@assets/images/logos/solo-user.png";
import activeSolologo from "@assets/images/logos/active-solo.svg";
import filelogo from "@assets/images/logos/file-pie-chart.png";
import activeFilelogo from "@assets/images/logos/active-file.svg";
import { Link, useNavigate } from "react-router-dom";
const Sidebar = () => {
  const [active, setActive] = useState("household");
  const navigate = useNavigate();

  const handletab = (tab) => {
    setActive(tab);
    navigate(`/${tab}`);
  };

  const menuItems = [
    {
      title: "applications",
      logo: Applogo,
      activeLogo: activeApplogo,
      link: "/applications",
    },
    {
      title: "calendar",
      logo: calenderlogo,
      activeLogo: activeCalenderlogo,
      link: "/calendar",
    },
    {
      title: "messages",
      logo: messagelogo,
      activeLogo: activeMessagelogo,
      link: "/messages",
    },
    {
      title: "household",
      logo: houseHoldLogo,
      activeLogo: activeHouseHoldLogo,
      link: "/household",
    },
    {
      title: "checklist",
      logo: checkListLogo,
      activeLogo: activeCheckListLogo,
      link: "/checklist",
    },
    {
      title: "solo",
      logo: solologo,
      activeLogo: activeSolologo,
      link: "/solo",
    },
    {
      title: "files",
      logo: filelogo,
      activeLogo: activeFilelogo,
      link: "/files",
    },
  ];

  return (
    <div className="sidebar w-auto h-full px-[2.4rem] py-[2rem] bg-[linear-gradient(104.56deg,_#006BBF_0%,_#0F85E2_100%)] rounded-[1.8rem] overflow-hidden">
      <div className="h-full flex flex-col items-center justify-between gap-[5rem]">
        <div className="w-[5.2rem] h-auto">
          <Link to={"/"}>
            <CustomImage src={logo} />
          </Link>
        </div>
        <ul className="w-full flex-1 overflow-auto flex flex-col items-center gap-[5rem]">
          {menuItems.map((item) => (
            <li key={item.title} onClick={() => handletab(item.title)}>
              <div
                className={`cursor-pointer w-[3rem] h-auto  ${
                  active === item.title
                    ? "bg-[#F5F5F5] rounded-[1.1rem] w-[5.5rem] h-[5.5rem] p-[1rem] flex items-center justify-center"
                    : ""
                }`}
              >
                <CustomImage src={active === item.title ? item.activeLogo : item.logo} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
