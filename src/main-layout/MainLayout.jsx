import { Suspense, useState } from "react";
import Navbar from "@/main-layout/layout-components/Navbar";
import { Outlet } from "react-router-dom";
import addIcon from "@assets/images/household-images/add-icon.png";
import Sidebar from "./layout-components/Sidebar";
import CustomImage from "@/components/image-component/CustomImage";
import ReusableSidebar from "@/components/sidebar-drawer/ReusableSidebar";
import useAddIconAction from "@/hooks/useAddIconAction";
import { useToast } from "@/hooks/useToast";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext.jsx";
import { ADD_ICON_ACTIONS } from "@/config/addIconConfig";

const MainLayout = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const { action, isDisabled, hideIcon, sidebarTitle, SidebarContent } = useAddIconAction();
  const { showToast } = useToast();
  const { currentHousehold } = useHouseholdDetailRefresh();

  const handleAddIconClick = () => {
    if (action !== ADD_ICON_ACTIONS.OPEN_SIDEBAR) return;

    if (!currentHousehold) {
      showToast({
        variant: "error",
        description: "Household details are not loaded yet.",
      });
      return;
    }

    const currentElders = Array.isArray(currentHousehold.elders)
      ? currentHousehold.elders.length
      : 0;

    if (currentElders >= 2) {
      showToast({
        variant: "error",
        description: "Only 2 members are allowed.",
      });
      return;
    }

    setIsAddSidebarOpen(true);
  };

  const handleCloseSidebar = () => setIsAddSidebarOpen(false);

  return (
    <div className="w-full bg-[var(--dashboard-bg)] h-screen">
      <div className="w-full gap-[5.7rem] h-full flex p-[2.4rem] pr-0">
        <Sidebar />
        <div className="flex-1  h-full flex flex-col">
          <Navbar />
          <div className="w-full pr-[8rem] flex-1 overflow-auto ">
            <Outlet />
            {!hideIcon && (
              <div
                onClick={handleAddIconClick}
                role="button"
                tabIndex={0}
                aria-disabled={isDisabled}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleAddIconClick();
                  }
                }}
                className={`fixed bottom-[3%] right-[5%] w-[9rem] ${
                  isDisabled ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <CustomImage src={addIcon} alt="add icon" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ReusableSidebar isOpen={isAddSidebarOpen} onClose={handleCloseSidebar} title={sidebarTitle}>
        {SidebarContent ? (
          <Suspense fallback={<div className="text-[1.4rem] text-[#666666]">Loading...</div>}>
            <SidebarContent onClose={handleCloseSidebar} />
          </Suspense>
        ) : (
          <p className="text-[1.4rem] text-[#666666]">
            No form has been configured for this section yet.
          </p>
        )}
      </ReusableSidebar>
    </div>
  );
};

export default MainLayout;
