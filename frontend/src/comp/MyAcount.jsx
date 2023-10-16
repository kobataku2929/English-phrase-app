import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const MyAcount = () => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  // const [userPosts, setUserPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = useSelector((state) => state.user.userId);

  //console.log(userId);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .then((err) => console.log(err));
  }, []);

  const handleDelete = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        localStorage.removeItem("userId");

        dispatch(logout({ userId }));
        //navigate("/home");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // サーバーからデータを取得する関数を呼び出す
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8081/myacount")
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
      {auth ? (
        <div>
          <h3>{name}としてログイン</h3>

          <button onClick={handleDelete}>Logout</button>

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
      ) : (
        <div>
          <h3>{message}</h3>

          <NavLink to="/login">Go to login</NavLink>
        </div>
      )}
    </div>
  );
};

export default MyAcount;
