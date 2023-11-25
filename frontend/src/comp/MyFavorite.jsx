import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData, setError } from "../redux/postSlice";
import { useNavigate } from "react-router-dom";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

//メモにバックアップ保存
const MyFavorite = () => {
  /* const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);*/
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId); // 仮のユーザーID。実際のコードではReduxから取得するか、適切な方法で取得してください。

  const { data, error, loading, favoriteStatus } = useSelector(
    (state) => state.post
  );
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // お気に入りステータスがtrueになっている投稿IDの配列を作成
        const favoritePostIds = Object.entries(favoriteStatus)
          .filter(([postId, isLiked]) => isLiked)
          .map(([postId]) => postId);

        //  console.log(favoritePostIds);

        // favoritePostIdsが空であれば何もしない
        if (favoritePostIds.length === 0) {
          //いいねのイントロダクション作る
          navigate("/");
        }

        // サーバーにリクエストを送る際にお気に入りの投稿IDをクエリパラメータとして追加
        const response = await axios.get("http://localhost:8081/myfavorite", {
          params: {
            userId,
            favoritePostIds: favoritePostIds.join(","),
          },
        });
        //console.log(response);

        dispatch(setData(response.data));
        dispatch(setError(null));
      } catch (error) {
        dispatch(
          setError("An error occurred while fetching data from the server.")
        );
      }
    };

    // fetchDataを呼び出す
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId, favoriteStatus]);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleLoginIconClick = () => {
    navigate("/login");
  };

  return (
    <div>
      {isLoggedIn ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
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

export default MyFavorite;
