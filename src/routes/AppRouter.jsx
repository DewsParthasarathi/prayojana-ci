import { createBrowserRouter, Navigate } from "react-router-dom";

import { ROUTES } from "./routes";
import RequireAuth from "./RequireAuth";
import OtpGuard from "./OtpGuard";
import NotFoundPage from "@/pages/not-found-page/NotFoundPage";
import MainLayout from "@/main-layout/MainLayout";
import LoginPage from "@/pages/login-page/LoginPage";
import OtpVerificationPage from "@/pages/login-page/otp-page/OtpVerificationPage";
import Household from "@/pages/household-page/Household";
import Application from "@/pages/applications-page/Application";
import CalenderPage from "@/pages/calender-page/CalenderPage";
import Message from "@/pages/message-page/Message";
import ChecklistPage from "@/pages/checklist-page/ChecklistPage";
import FilePage from "@/pages/file-page/FilePage";
import UserPage from "@/pages/user-page/UserPage";
import HouseHoldDetail from "@/pages/household-page/household-detailspage/HouseHoldDetail";
import MembersDetailsPage from "@/pages/household-page/members-details-page/MembersDetailsPage";
import UserDetailsPage from "@/pages/user-page/UserDetailsPage";
import AddUserForm from "@/pages/user-page/AddUserForm";
import EditUsersForm from "@/pages/user-page/EditUsersForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={ROUTES.HOUSEHOLD} replace />,
    errorElement: <NotFoundPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    element: <OtpGuard />,
    children: [{ path: ROUTES.OTP_VERIFICATION, element: <OtpVerificationPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.HOUSEHOLD, element: <Household /> },
          { path: ROUTES.APPLICATIONS, element: <Application /> },
          { path: ROUTES.CALENDAR, element: <CalenderPage /> },
          { path: ROUTES.MESSAGES, element: <Message /> },
          { path: ROUTES.CHECKLIST, element: <ChecklistPage /> },
          { path: ROUTES.SOLO, element: <UserPage /> },
          { path: ROUTES.FILES, element: <FilePage /> },
          { path: ROUTES.DETAILS, element: <HouseHoldDetail /> },
          { path: ROUTES.MEMBERDETAILS, element: <MembersDetailsPage /> },
          { path: ROUTES.USERDATA, element: <UserDetailsPage /> },
          { path: ROUTES.USERDATAFORM, element: <AddUserForm /> },
          { path: ROUTES.USERDATAEDITFORM, element: <EditUsersForm /> },
        ],
      },
    ],
  },
]);
