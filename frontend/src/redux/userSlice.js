// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    // 他のユーザー情報も必要に応じてここに含める
  },
  reducers: {
    login: (state, action) => {
      const { userId } = action.payload;
      state.isLoggedIn = true;
      state.userId = userId;
      // ローカルストレージからユーザーごとのいいねの状態を読み込む
      const userData = localStorage.getItem(userId);
      if (userData) {
        state.favoriteStatus = JSON.parse(userData).favoriteStatus;
      }
      // ...
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userId = null; // ユーザーIDのクリア
      // ログアウト時にローカルストレージの情報もクリアする場合
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
