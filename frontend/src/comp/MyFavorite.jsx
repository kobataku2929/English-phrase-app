import axios from "axios";
import React, { useEffect, useState } from "react";

const MyFavorite = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // サーバーからデータを取得する関数を呼び出す
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8081/myfavorite")
      .then((response) => {
        console.log(response.data);
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
  /* return (
    <div>
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
    </div>
  );*/
};

export default MyFavorite;
