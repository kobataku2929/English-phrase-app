import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { setData, setError, editPost } from "../redux/postSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const PostEditor = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const numericPostId = parseInt(postId);
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.post);
  const filteredData = data.filter((item) => item.id === numericPostId);
  const phrases = filteredData.map((item) => item.phrase);
  const japanese = filteredData.map((item) => item.japanese);
  const sentence = filteredData.map((item) => item.sentence);
  const details = filteredData.map((item) => item.details);
  const [values, setValues] = useState({
    phrase: phrases,
    japanese: japanese,
    sentence: sentence,
    details: details,
  });
  //console.log(values);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8081/myacount")
        .then((response) => {
          dispatch(setData(response.data));

          //store.dispatch(setUserId(userId));
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

  //console.log(postId);

  const handleEditDone = () => {
    const newData = {
      phrase: values.phrase,
      japanese: values.japanese,
      sentence: values.sentence,
      details: values.details,
    };

    // console.log(numericPostId);

    axios
      .post(`http://localhost:8081/postEditor/${postId}`, newData)
      .then((res) => {
        if (res.data.Status === "Error") {
          console.error("エラーが発生しました:", res.data.Error);
          alert("投稿編集エラー");
        } else {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("ネットワークエラー:", err);
        alert("ネットワークエラーが発生しました");
      });

    //dispatch(editPost({ postId, newData }));

    navigate("/myacount");
  };

  return (
    <div>
      {data
        .filter((item) => item.id === numericPostId) // 特定の postId に一致するアイテムだけをフィルタリング
        .map((item) => (
          <form
            key={item.id}
            className="  p-10  "
            onSubmit={(e) => {
              e.preventDefault();
              handleEditDone(item.id);
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                フレーズ
              </label>
              {errors.phrase && (
                <span className="text-red-500 text-xs">{errors.phrase} </span>
              )}

              <textarea
                className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  setValues({ ...values, phrase: e.target.value })
                }
                defaultValue={item.phrase}
                placeholder="hello"
                name="phrase"
                rows="4" // ここで行数を指定します
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                和訳
              </label>
              {errors.japanese && (
                <span className="text-red-500 text-xs">{errors.japanese} </span>
              )}

              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="tetx"
                onChange={(e) =>
                  setValues({ ...values, japanese: e.target.value })
                }
                defaultValue={item.japanese}
                placeholder="こんにちは"
                name="japanese"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                例文
              </label>

              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                onChange={(e) =>
                  setValues({ ...values, sentence: e.target.value })
                }
                defaultValue={item.sentence}
                placeholder="Hello English"
                name="sentence"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                詳細
              </label>
              <textarea
                className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  setValues({ ...values, details: e.target.value })
                }
                defaultValue={item.details}
                placeholder="挨拶するときによく使う。人を選ばず誰にでも使う"
                name="details"
                rows="4" // ここで行数を指定します
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              登録
            </button>
          </form>
        ))}

      <ul>
        {data
          .filter((item) => item.id === numericPostId) // 特定の postId に一致するアイテムだけをフィルタリング
          .map((item) => (
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
  );
};

export default PostEditor;
