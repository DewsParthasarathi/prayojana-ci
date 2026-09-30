import { createSlice } from "@reduxjs/toolkit";
import adminsJson from "@/data/admins.json";

const initialState = {
  list: Array.isArray(adminsJson.admins) ? adminsJson.admins : [],
};

const adminsSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    addAdmin: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare(admin) {
        return { payload: admin };
      },
    },
    updateAdmin(state, action) {
      const { id, changes } = action.payload;
      const idx = state.list.findIndex((a) => String(a.id) === String(id));
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...changes };
      }
    },
    deleteAdmin(state, action) {
      state.list = state.list.filter((a) => String(a.id) !== String(action.payload));
    },
  },
});

export const { addAdmin, updateAdmin, deleteAdmin } = adminsSlice.actions;

export const selectAdmins = (state) => state.admins.list;
export const selectAdminById = (id) => (state) =>
  state.admins.list.find((a) => String(a.id) === String(id));

export default adminsSlice.reducer;
