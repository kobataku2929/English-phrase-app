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
    setErrors(contactChecker(values));
    if (errors.name === "" && errors.message === "") {
      axios
        .post("http://localhost:8081/contact", values)
        .then((res) => {
          if (res.data.Status === "Error") {
            console.error("エラーが発生しました:", res.data.Error);
            alert("データの挿入中にエラーが発生しました");
          } else {
            window.alert("お問い合わせ完了しました");
            navigate("/");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("エラーが発生しました");
        });
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">お問い合わせ・意見フォーム</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
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
            rows="4"
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
