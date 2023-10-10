import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import validation from "./LoginValidation";
import axios from "axios";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { login } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  //axios.defaults.withCredentials = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validation(values));
    if (errors.email === "" && errors.password === "") {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => {
          if (res.data.Status === "Success") {
            const userId = res.data.userId;
            dispatch(login({ userId }));
            //console.log("userId before localStorage.setItem:", userId);
            localStorage.setItem("userId", userId);

            navigate("/");
          } else {
            alert(res.data.Error);
          }
        })
        .then((err) => console.log(err));
    }
  };

  return (
    <div>
      <div className="max-w-sm mx-auto mt-8 p-6 border rounded-lg">
        <NavLink to="/">
          <HomeRoundedIcon className="mb-4" fontSize="large" color="primary" />
        </NavLink>
        <h2 className="text-2xl font-semibold">sign in</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              メールアドレス
            </label>

            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email} </span>
            )}
            <input
              id="email"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              name="email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              パスワード
            </label>

            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password} </span>
            )}

            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              name="password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            log in
          </button>
          <NavLink
            to="/SignUp"
            button="true"
            className="mt-4 block text-sm text-blue-500 hover:text-blue-700"
          >
            新規登録・アカウントを作る
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;
