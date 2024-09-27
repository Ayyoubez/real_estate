import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  currentuser: null,
  error: null,
  loading: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      (state.currentuser = action.payload),
        (state.error = null),
        (state.loading = false);
    },
    signInFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
  },
});
export const {signInFailure, signInStart, signInSuccess} = userSlice.actions;
export default userSlice.reducer
