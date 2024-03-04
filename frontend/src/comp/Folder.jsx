import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setData, setError } from "../redux/postSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
function Folder() {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.post);
  const { folderId } = useParams();
  const numeriFolderId = parseInt(folderId);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`http://localhost:8081/myaccount/${folderId}`)
        .then((response) => {
          dispatch(setData(response.data));
        })
        .catch((error) => {
          dispatch(
            setError("An error occurred while fetching data from the server.")
          );
          console.error("Axios error:", error);
        });
    };

    // サーバーからデータを取得する関数を呼び出す

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(data);
  return (
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
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

export default Folder;
