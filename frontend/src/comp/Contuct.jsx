// src/App.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Contuct() {
  //送信ボタン押したら”送信が完了しました戸出るようにする”
  // お問い合わせフォームの送信ボタンがクリックされたときの処理

  const [values, setValues] = useState({
    name: "",
    message: "",
  });
  const navigate = useNavigate();
  // console.log(values);

  const handleSubmit = (event) => {
    event.preventDefault();

    /*const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;*/

    /* try {
      const response = await fetch("http://localhost:3001/Contuct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.text();
      alert(result); // メール送信の結果をアラートで表示
    } catch (error) {
      console.error(error);
    }*/
    axios
      .post("http://localhost:8081/contuct", values)
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
