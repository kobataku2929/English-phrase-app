import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FolderNameChecker from "./FolderNameChecker";

function CreateFolder() {
  const [values, setValues] = useState({
    name: "",
  });
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // ローディング状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickedUpPostIds, setPickedUpPostIds] = useState([]);
  const folderId = data.map((item) => item.id);
  const navigate = useNavigate();

  useEffect(() => {
    // サーバーからデータを取得する関数を呼び出す
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8081/createfolder")
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

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrors(FolderNameChecker(values));
    if (errors.name === "") {
      axios
        .post("http://localhost:8081/createfolder", values)
        .then((res) => {
          /*if (res.data.Status === "Success") {
          //window.alert("挿入完了");
        } else*/ if (res.data.Status === "Error") {
            console.error("エラーが発生しました:", res.data.Error);
            alert("データの挿入中にエラーが発生しました");
          }
        })
        .catch((err) => {
          console.error("ネットワークエラー:", err);
          alert("ネットワークエラーが発生しました");
        });

      axios
        .post("http://localhost:8081/createfolder/pickedUpPostIds", {
          pickedUpPostIds: pickedUpPostIds,
          folderId: folderId,
        })
        .then((res) => {
          /*if (res.data.Status === "Success") {
          //window.alert("挿入完了");
        } else*/ if (res.data.Status === "Error") {
            console.error("エラーが発生しました:", res.data.Error);
            alert("データの挿入中にエラーが発生しました");
          } else {
            setIsModalOpen(false);
            window.location.reload();
            window.location.reload();
            setPickedUpPostIds([]);
          }
        })
        .catch((err) => {
          console.error("ネットワークエラー:", err);
          alert("ネットワークエラーが発生しました");
        });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    axios
      .get("http://localhost:8081/myaccount")
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

  const handlePickUpPost = (postId) => {
    setPickedUpPostIds((prevIds) => {
      if (prevIds.includes(postId)) {
        // 既に含まれている場合は削除
        return prevIds.filter((id) => id !== postId);
      } else {
        // 含まれていない場合は追加
        return [...prevIds, postId];
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPickedUpPostIds([]);
  };

  const openFolder = (folderId) => {
    console.log(folderId);
    navigate(`/myaccount/${folderId}`);
  };

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      CreateFolder
      <button onClick={openModal}>フォルダーを作成</button>
      {isModalOpen && (
        <div>
          <form className="  p-10  " onSubmit={handleSubmit}>
            {errors.name && (
              <span className="text-red-500 text-xs">{errors.name} </span>
            )}
            <input
              className="border rounded py-1 px-2 text-sm focus:outline-none focus:border-blue-500"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="ファイル名"
            ></input>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              作成
            </button>
            <br />
            <p>ここに投稿</p>
            <ul>
              {data.map((item) => (
                <li key={item.id}>
                  <input
                    type="checkbox"
                    checked={pickedUpPostIds.includes(item.id)}
                    onChange={() => handlePickUpPost(item.id)}
                  />
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
          </form>
          <button onClick={closeModal}>閉じる</button>
        </div>
      )}
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <br />
            <button
              onClick={() => {
                openFolder(item.id);
              }}
            >
              {item.foldername}
            </button>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateFolder;
