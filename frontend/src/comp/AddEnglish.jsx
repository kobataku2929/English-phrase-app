import React, { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import addEnglishChecker from "./AddEnglishChecker";

const AddEnglish = forwardRef((props, ref) => {
  const [values, setValues] = useState({
    phrase: "",
    japanese: "",
    sentence: "",
    details: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .then((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    //setErrors(addEnglishChecker(values)); これだと2回ボタンを押さないと送信されない
    const newErrors = addEnglishChecker(values);
    setErrors(newErrors);
    console.log(newErrors);

    console.log(values);
    if (newErrors.phrase === "" && newErrors.japanese === "") {
      axios
        .post("http://localhost:8081/addenglish", values)
        .then((res) => {
          if (res.data.Status === "Error") {
            console.error("エラーが発生しました:", res.data.Error);
            alert("データの挿入中にエラーが発生しました");
          } else {
            navigate("/myaccount");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error("ネットワークエラー:", err);
          alert("ネットワークエラーが発生しました");
        });
    }
  };

  return (
    <div className="flex justify-center items-center  ">
      {auth ? (
        <div className="max-w-sm w-full  bg-white  p-6 ">
          <form className="  w-4/5	relative" onSubmit={handleSubmit}>
            <button
              className="absolute top-0 right-0 bg-gray-100 hover:bg-gray-300 text-gray-700 font-bold   rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              登録
            </button>
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

              <textarea
                className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  setValues({ ...values, japanese: e.target.value })
                }
                placeholder="こんにちは"
                name="japanese"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                例文
              </label>

              <textarea
                className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  setValues({ ...values, sentence: e.target.value })
                }
                placeholder="Hello English"
                name="sentence"
                rows="4"
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
        </div>
      ) : (
        <div>
          <NavLink to="/login">Go to login</NavLink>
        </div>
      )}
    </div>
  );
});

export default AddEnglish;
