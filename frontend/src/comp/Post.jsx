import React, { useEffect } from "react";
import axios from "axios";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useDispatch, useSelector } from "react-redux";
import { setData, setError, setFavoriteStatus } from "../redux/postSlice";

function Post() {
  const dispatch = useDispatch();
  const { data, error, loading, favoriteStatus } = useSelector(
    (state) => state.post
  );
  /*const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態
  const [favoriteStatus, setFavoriteStatus] = useState({}); // 各投稿ごとにお気に入りのステータスを持つステートを初期化
*/

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8081/post")
        .then((response) => {
          //投稿の各オブジェクトのユーザーidを確かめる
          /*response.data.forEach((item) => {
            const userId = item.userid;
            console.log(userId);
          });*/

          dispatch(setData(response.data));
        })
        .catch((error) => {
          dispatch(
            setError("An error occurred while fetching data from the server.")
          );
          console.error("Axios error:", error);
          //setLoading(false); // データの取得が失敗したらローディングを終了
        });
    };

    // サーバーからデータを取得する関数を呼び出す

    fetchData();
  }, [dispatch]);

  const calculateTimeAgo = (timestamp) => {
    //console.log("タイムスタンプ:", timestamp);
    const now = new Date(); // 現在の時刻
    const postTime = new Date(timestamp); // タイムスタンプをDateオブジェクトに変換

    // 現在の時刻とタイムスタンプの差分（ミリ秒単位）
    const timeDifference = now - postTime;

    // 差分を分単位で計算
    const minutesDifference = Math.floor(timeDifference / 60000);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(daysDifference / 365);

    if (yearsDifference > 0) {
      return `${yearsDifference}年前`; // 1年以上の場合
    } else if (monthsDifference > 0) {
      return `${monthsDifference}ヶ月前`; // 1ヶ月以上の場合
    } else if (daysDifference > 0) {
      return `${daysDifference}日前`; // 1日以上の場合
    } else if (hoursDifference > 0) {
      return `${hoursDifference}時間前`; // 1時間以上の場合
    } else if (minutesDifference > 0) {
      return `${minutesDifference}分前`; // 1分以上の場合
    } else {
      return "1分以内"; // 1分未満の場合
    }
  };

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLike = (postId) => {
    // サーバーにいいねの情報を送信
    console.log(data);
    axios
      .post(
        "http://localhost:8081/post",
        { PostId: postId, isLiked: !favoriteStatus[postId] },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then((response) => {
        dispatch(
          setFavoriteStatus({ postId, isLiked: !favoriteStatus[postId] })
        );
        //alert(response.data);
        // サーバーからのレスポンスに基づいてクライアント側の状態を更新
        /*setFavoriteStatus((prevStatus) => ({
          ...prevStatus,
          [postId]: !prevStatus[postId], //response.data.liked, サーバーからのレスポンスの情報を使用してトグル
        }));*/
      })
      .catch((error) => {
        console.error("Axios error:", error);
      });
  };

  return (
    <div className="p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">みんなのフレーズだお</h1>
      <ul className="text-center ">
        {data.map((item) => (
          <li className="mb-4 text-left " key={item.id}>
            <br />
            <span className="pl-20 text-gray-500 text-sm">
              {calculateTimeAgo(item.timestamp)}
            </span>
            <br />
            <button
              className="mb-3 rounded-full bg-blue-500 text-white"
              onClick={() => handleLike(item.id)} // 特定の投稿に対してクリックハンドラを設定
            >
              {favoriteStatus[item.id] ? (
                <FavoriteRoundedIcon style={{ color: "#FF1493" }} />
              ) : (
                <FavoriteBorderRoundedIcon />
              )}
            </button>
            <br />
            <strong className="text-lg">フレーズ:</strong> {item.phrase}
            <br />
            <strong className="text-lg">センテンス:</strong> {item.sentence}
            <br />
            <strong className="text-lg">日本語:</strong> {item.japanese}
            <br />
            <strong className="text-lg">詳細:</strong> {item.details}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Post;
/*{
          headers: {
            accessToken: document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              .split("=")[1],
          },
        }*/
