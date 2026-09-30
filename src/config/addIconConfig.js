import { ROUTES } from "@/routes/routes";
import { lazy } from "react";
import { matchPath } from "react-router-dom";

export const ADD_ICON_ACTIONS = {
  DISABLED: "disabled",
  OPEN_SIDEBAR: "openSidebar",
};

const AddMemberForm = lazy(
  () => import("@/pages/household-page/household-detailspage/details-component/AddMemberForm"),
);

export const addIconConfig = {
  [ROUTES.HOUSEHOLD]: {
    action: ADD_ICON_ACTIONS.DISABLED,
    hideIcon: true,
  },
  [ROUTES.SOLO]: {
    action: ADD_ICON_ACTIONS.DISABLED,
    hideIcon: true,
  },
  [ROUTES.USERDATA]: {
    action: ADD_ICON_ACTIONS.DISABLED,
    hideIcon: true,
  },
  [ROUTES.USERDATAFORM]: {
    action: ADD_ICON_ACTIONS.DISABLED,
    hideIcon: true,
  },
  [ROUTES.USERDATAEDITFORM]: {
    action: ADD_ICON_ACTIONS.DISABLED,
    hideIcon: true,
  },
  [ROUTES.DETAILS]: {
    action: ADD_ICON_ACTIONS.OPEN_SIDEBAR,
    sidebarTitle: "Create Member",
    SidebarContent: AddMemberForm,
  },
  [ROUTES.MEMBERDETAILS]: {
    action: ADD_ICON_ACTIONS.DISABLED,
    hideIcon: true,
  },
};

export const defaultAddIconConfig = {
  action: ADD_ICON_ACTIONS.DISABLED,
};

export const getAddIconConfig = (pathname) => {
  const matchedPattern = Object.keys(addIconConfig).find((pattern) =>
    matchPath({ path: pattern, end: true }, pathname),
  );

  return matchedPattern ? addIconConfig[matchedPattern] : defaultAddIconConfig;
};
