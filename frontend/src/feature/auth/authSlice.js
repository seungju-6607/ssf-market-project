import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    user: null,
    role: null
  },
  reducers: {
    login(state, action) {
        state.isLogin = true;
        const { userId } = action.payload;
        localStorage.setItem("isLogin", state.isLogin);

    },
    setUser(state, action) {
        const { authenticated, email, role } = action.payload || {};
        state.isLogin = !!authenticated;
        state.user = authenticated ? { email } : null;
        state.role = authenticated ? (role || "user") : null;
        if (authenticated) {
            localStorage.setItem("loginUser", JSON.stringify({ email, role: state.role }));
            localStorage.setItem("isLogin", "true");
        } else {
            localStorage.removeItem("loginUser");
            localStorage.setItem("isLogin", "false");
        }
    },
    logout(state) {
        state.isLogin = false;
        state.user = null;
        state.role = null;
        localStorage.removeItem("isLogin");
        localStorage.removeItem("loginUser");
    }
  }
})

// Action creators are generated for each case reducer function
export const { login, setUser, logout } = authSlice.actions

export default authSlice.reducer 