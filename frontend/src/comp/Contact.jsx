// src/App.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import contactChecker from "./ContactChecker";

function Contuct() {
  //送信ボタン押したら”送信が完了しました戸出るようにする”
  // お問い合わせフォームの送信ボタンがクリックされたときの処理

  const [values, setValues] = useState({
    name: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // console.log(values);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = contactChecker(values);
    setErrors(newErrors);
    if (newErrors.name === "" && newErrors.message === "") {
      axios
        .post("http://localhost:8081/contact", values)
        .then((res) => {
          if (res.data.Status === "Error") {
            console.error("エラーが発生しました:", res.data.Error);
            alert("データの挿入中にエラーが発生しました");
          } else {
            navigate("/");
            window.location.reload();
            window.alert("お問い合わせ完了しました");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("エラーが発生しました");
        });
    }
  };

  return (
    <div className="flex flex-col items-center container mx-auto mt-10  ">
      <h1 className="text-3xl font-bold mb-6">お問い合わせ・ご意見フォーム</h1>
      <form onSubmit={handleSubmit} className="w-3/5">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            お名前
          </label>
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name} </span>
          )}
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 p-2 border rounded-md w-full"
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            お問い合わせ内容
          </label>
          {errors.message && (
            <span className="text-red-500 text-xs">{errors.message} </span>
          )}
          <textarea
            id="message"
            name="message"
            rows="5"
            className="mt-1 p-2 border rounded-md w-full"
            onChange={(e) => setValues({ ...values, message: e.target.value })}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          送信する
        </button>
      </form>
    </div>
  );
}

export default Contuct;
