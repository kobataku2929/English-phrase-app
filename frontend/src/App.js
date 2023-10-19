import "./App.css";
//1．useStateとuseEffectをインポート
import { useEffect } from "react";

import Home from "./comp/Home";
import MyFavorite from "./comp/MyFavorite";

import AddEnglish from "./comp/AddEnglish";
import Login from "./comp/Login";
import MyAcount from "./comp/MyAcount";
import Contuct from "./comp/Contuct";
import SignUp from "./comp/SignUp";
import store from "./index";
import { setUserId, login } from "./redux/userSlice";
import { useDispatch } from "react-redux";

import WithHeaderLayout from "./comp/WithHeaderLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("http://localhost:8081").then((response) => {
      const userId = response.data.id;
      store.dispatch(setUserId(userId));
      // localStorage.setItem("userId", userId);
      //console.log(userId);
    });
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    //console.log(storedUserId);

    if (storedUserId) {
      dispatch(login(storedUserId));
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Headerを含むルート */}
          <Route element={<WithHeaderLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/myfavorite" element={<MyFavorite />} />
            <Route path="/addenglish" element={<AddEnglish />} />
            <Route path="/myacount" element={<MyAcount />} />
            <Route path="/contuct" element={<Contuct />} />
          </Route>

          {/* Headerを含まないルート */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>

    /*<div className="App">
      <h1>フロントエンド</h1>

      <p>{message}</p>
    </div>*/
  );
}

export default App;
