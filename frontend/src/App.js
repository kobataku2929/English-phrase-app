import "./App.css";
//1．useStateとuseEffectをインポート
//import { useState, useEffect } from "react";

import Home from "./comp/Home";
import MyFavorite from "./comp/MyFavorite";

import AddEnglish from "./comp/AddEnglish";
import Login from "./comp/Login";
import MyAcount from "./comp/MyAcount";
import Contuct from "./comp/Contuct";
import SignUp from "./comp/SignUp";

import WithHeaderLayout from "./comp/WithHeaderLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  //useStateの初期値（空）を設定
  /*const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);*/

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
