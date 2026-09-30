import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminsReducer from "./slices/adminsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admins: adminsReducer,
  },
});
