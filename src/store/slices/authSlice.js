import { createSlice } from "@reduxjs/toolkit";

const storageKey = "authUser";

const readStoredUser = () => {
  try {
    const raw = sessionStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storedUser = readStoredUser();

const initialState = {
  user: storedUser,
  isAuthenticated: Boolean(storedUser),
  pendingMobile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    otpRequested: (state, action) => {
      state.pendingMobile = action.payload;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.pendingMobile = null;

      sessionStorage.setItem(storageKey, JSON.stringify(action.payload));
    },

    clearPendingMobile: (state) => {
      state.pendingMobile = null;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.pendingMobile = null;

      sessionStorage.removeItem(storageKey);
    },
  },
});

export const { otpRequested, loginSuccess, clearPendingMobile, logout } =
  authSlice.actions;

export default authSlice.reducer;
