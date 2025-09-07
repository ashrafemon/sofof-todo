import { createSlice } from '@reduxjs/toolkit';

type User = {
  id: string;
  name: string;
  email: string;
};

type State = {
  token: string | null;
  isAuthenticate: boolean;
  currentUser: User | null;
};

const initialState: State = {
  token: null,
  isAuthenticate: false,
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
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
