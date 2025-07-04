// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { jwtDecode } from "jwt-decode";
// import { User } from "@/types/user";
// import { JwtPayload } from "@/types/jwt";
// import { authApi } from "@/services/authApi";

// interface AuthState {
//   token: string | null;
//   user: User | null;
// }

// const initialState: AuthState = {
//   token: null,
//   user: null,
// };

// // Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout(state) {
//       state.token = null;
//       state.user = null;
//       // optional: localStorage.removeItem('token');
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addMatcher(
//       authApi.endpoints.login.matchFulfilled,
//       (state, { payload }: PayloadAction<{ token: string }>) => {
//         state.token = payload.token;
//         const decoded = jwtDecode<JwtPayload>(payload.token);
//         state.user = {
//           id: decoded.id,
//           email: decoded.email,
//           role: decoded.role,
//         };
//         // optional: localStorage.setItem('token', payload.token);
//       }
//     );
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
