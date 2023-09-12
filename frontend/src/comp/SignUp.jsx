import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import validation from "./SignUpValidation";
import axios from "axios";

const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  /*const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validation(values));
    if (errors.name === "" && errors.email === "" && errors.password === "") {
      axios
      .post("http://localhost:8081/SignUp", values)
      .then((res) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
    }
  };*/

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validation(values));

    /*if (res.data.Status === "Error") {
      window.alert("そのメールアドレスは既に登録されています");
    } else if (
      errors.name === "" &&
      errors.email === "" &&
      errors.password === ""
    ) {
      axios
        .post("http://localhost:8081/signup", values)
        .then((res) => {
          if (res.data.Status === "Success") {
            navigate("/login");
          } else {
            alert("erro");
          }
        })
        .catch((err) => console.log(err));
    }*/

    if (errors.name === "" && errors.email === "" && errors.password === "") {
      axios
        .post("http://localhost:8081/signup", values)
        .then((res) => {
          if (res.data.Status === "Success") {
            navigate("/login");
          } else if (res.data.Status === "Error") {
            window.alert("そのメールアドレスは既に登録されています");
          } else {
            alert("エラーが発生しました");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("エラーが発生しました");
        });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <div className="max-w-sm w-full  bg-orange-500 p-6 rounded-lg shadow-md">
        <h2 className=" bg-orange-500 text-2xl font-semibold mb-4">sign up</h2>
        <form
          className=" bg-orange-500 p-10 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <strong>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                名前
              </label>
            </strong>
            {errors.name && (
              <span className="text-red-500 text-xs">{errors.name} </span>
            )}

            <input
              id="name"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              //onChange={handleInput}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              type="text"
              placeholder="Enter Name"
              name="name"
            />
          </div>
          <div className="mb-4">
            <strong>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                メールアドレス
              </label>
            </strong>
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email} </span>
            )}

            <input
              id="email"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              type="email"
              placeholder="Enter Email"
              name="email"
            />
          </div>
          <div className="mb-4">
            <strong>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                パスワード
              </label>
            </strong>
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password} </span>
            )}

            <input
              id="password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              type="password"
              placeholder="Enter Password"
              name="password"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            sign up
          </button>
          <NavLink
            button="true"
            to="/Login"
            className="mt-4 block text-sm text-blue-500 hover:text-blue-700"
          >
            ログイン
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
