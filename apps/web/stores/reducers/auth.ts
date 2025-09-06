import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isAuthenticate: false,
    currentUser: null,
  },
  reducers: {
    setAuthentication: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticate = action.payload.isAuthenticate;
      state.currentUser = action.payload.user;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload.currentUser;
    },
    logout: (state) => {
      state.isAuthenticate = false;
      state.token = null;
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, setAuthentication, logout } = authSlice.actions;
export default authSlice.reducer;
