import React from "react";
import Post from "./Post";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleLoginIconClick = () => {
    navigate("/login");
  };
  return (
    <div>
      {isLoggedIn ? (
        // ログイン済みの場合はメインコンポーネントを表示

        <Post />
      ) : (
        <div>
          <h3>あなたは認証されていません</h3>
          <div onClick={handleLoginIconClick}>
            <LoginRoundedIcon />
            <span>ログイン</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
