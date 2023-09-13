import React, { useState } from "react";
import axios from "axios";

const AddEnglish = () => {
  const [values, setValues] = useState({
    phrase: "",
    japanese: "",
    sentence: "",
    details: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    axios
      .post("http://localhost:8081/addenglish", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          window.alert("挿入完了");
        } else if (res.data.Status === "Error") {
          console.error("エラーが発生しました:", res.data.Error);
          alert("データの挿入中にエラーが発生しました");
        } else {
          alert("投稿完了だぜ");
        }
      })
      .catch((err) => {
        console.error("ネットワークエラー:", err);
        alert("ネットワークエラーが発生しました");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <div className="max-w-sm w-full  bg-white  p-6 rounded-lg shadow-md">
        <h2 className="  text-2xl font-semibold mb-4">フレーズ登録</h2>
        <form className="  p-10  " onSubmit={handleSubmit}>
          <div className="mb-4">
            <strong>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                フレーズ
              </label>
            </strong>

            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              onChange={(e) => setValues({ ...values, phrase: e.target.value })}
              placeholder="hello"
              name="phrase"
            />
          </div>
          <div className="mb-4">
            <strong>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                和訳
              </label>
            </strong>

            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="tetx"
              onChange={(e) =>
                setValues({ ...values, japanese: e.target.value })
              }
              placeholder="こんにちは"
              name="japanese"
            />
          </div>
          <div className="mb-4">
            <strong>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                例文
              </label>
            </strong>

            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              onChange={(e) =>
                setValues({ ...values, sentence: e.target.value })
              }
              placeholder="Hello English"
              name="sentence"
            />
          </div>
          <div className="mb-4">
            <strong>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                メモ
              </label>
            </strong>

            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              onChange={(e) =>
                setValues({ ...values, details: e.target.value })
              }
              placeholder="挨拶するときによく使う。人を選ばず誰にでも使う"
              name="details"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEnglish;
