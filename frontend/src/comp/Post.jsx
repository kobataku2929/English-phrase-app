import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

function Post() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // サーバーからデータを取得する関数を呼び出す
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8081/post")
      .then((response) => {
        setData(response.data);
        setError(null);
        setLoading(false); // データの取得が成功したらローディングを終了
      })
      .catch((error) => {
        setError("An error occurred while fetching data from the server.");
        console.error("Axios error:", error);
        setLoading(false); // データの取得が失敗したらローディングを終了
      });
  };

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  return (
    <div>
      <h1>みんなのフレーズだお</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <button onClick={toggleFavorite}>
              {isFavorite ? (
                <FavoriteRoundedIcon style={{ color: "#FF1493" }} />
              ) : (
                <FavoriteBorderRoundedIcon />
              )}
            </button>
            <br />
            <strong>フレーズ:</strong> {item.phrase}
            <br />
            <strong>センテンス:</strong> {item.sentence}
            <br />
            <strong>日本語:</strong> {item.japanese}
            <br />
            <strong>詳細:</strong> {item.details}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Post;
