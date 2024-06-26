// postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadUserFavoriteStatus = (userId) => {
  try {
    const storedUserFavoriteStatus = localStorage.getItem(
      `favoriteStatus_${userId}`
    );
    return storedUserFavoriteStatus ? JSON.parse(storedUserFavoriteStatus) : {};
  } catch (error) {
    console.error(
      "ローカルストレージからユーザーのいいねの状態を読み込む際にエラーが発生しました:",
      error
    );
    return {};
  }
};

const postSlice = createSlice({
  name: "post",
  initialState: {
    data: [],
    error: null,
    loading: true,
    // 現在のユーザーIDを取得する方法があると仮定します
    userId: localStorage.getItem("userId"),
    favoriteStatus: loadUserFavoriteStatus(localStorage.getItem("userId")),
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
      state.error = null;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    /*editPost: (state, action) => {
      const { postId, newData } = action.payload;

      // データ編集の実装
      const editedData = state.data.map((post) =>
        post.id === postId ? { ...post, ...newData } : post
      );

      state.data = editedData;
      //console.log(action.payload);
    },*/
    /*deletePost: (state, action) => {
      const { postId } = action.payload;
      console.log(postId);

      state.data = state.data.filter((post) => post.id !== postId);
      state.error = null;
      state.loading = false;
    },*/
    setFavoriteStatus: (state, action) => {
      const { postId, isLiked } = action.payload;

      state.favoriteStatus = {
        ...state.favoriteStatus,
        [postId]: isLiked,
      };
      // ユーザーごとのいいねの状態をローカルストレージに保存
      localStorage.setItem(
        `favoriteStatus_${state.userId}`,
        JSON.stringify(state.favoriteStatus)
      );
    },
  },
});

export const { setData, setError, setFavoriteStatus } = postSlice.actions;
export default postSlice.reducer;
