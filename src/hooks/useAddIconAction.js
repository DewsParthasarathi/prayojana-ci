import { useLocation } from "react-router-dom";
import { ADD_ICON_ACTIONS, getAddIconConfig } from "@/config/addIconConfig";

const useAddIconAction = () => {
  const { pathname } = useLocation();
  const config = getAddIconConfig(pathname);

  return {
    action: config.action,
    isDisabled: config.action !== ADD_ICON_ACTIONS.OPEN_SIDEBAR,
    hideIcon: Boolean(config.hideIcon),
    sidebarTitle: config.sidebarTitle ?? "Add New",
    SidebarContent: config.SidebarContent ?? null,
  };
};

export default useAddIconAction;
