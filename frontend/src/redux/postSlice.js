// postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadFavoriteStatus = () => {
  try {
    const storedFavoriteStatus = localStorage.getItem("favoriteStatus");
    return storedFavoriteStatus ? JSON.parse(storedFavoriteStatus) : {};
  } catch (error) {
    console.error("Error loading favorite status from localStorage:", error);
    return {};
  }
};

const postSlice = createSlice({
  name: "post",
  initialState: {
    data: [],
    error: null,
    loading: true,
    favoriteStatus: loadFavoriteStatus(),
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
    setFavoriteStatus: (state, action) => {
      const { postId, isLiked } = action.payload;
      state.favoriteStatus = {
        ...state.favoriteStatus,
        [postId]: isLiked,
      };
      // ローカルストレージにいいねの状態を保存
      localStorage.setItem(
        "favoriteStatus",
        JSON.stringify(state.favoriteStatus)
      );
    },
  },
});

export const { setData, setError, setFavoriteStatus } = postSlice.actions;
export default postSlice.reducer;
