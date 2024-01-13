import "./App.css";
//1．useStateとuseEffectをインポート
import { useEffect } from "react";

import Home from "./comp/Home";
import MyFavorite from "./comp/MyFavorite";

import AddEnglish from "./comp/AddEnglish";
import Login from "./comp/Login";
import MyAcount from "./comp/MyAcount";
import Contact from "./comp/Contact";
import SignUp from "./comp/SignUp";
import Header from "./comp/Header";
import SecondHeader from "./comp/SecondHeader";
import PostEditor from "./comp/PostEditor";

import store from "./index";
import { setUserId, login } from "./redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

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
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  //console.log(isLoggedIn);

  /*
  


  */

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Headerを含むルート */}
          <Route
            path="/"
            element={
              <div>
                {isLoggedIn ? (
                  // ログイン済みの場合はメインコンポーネントを表示
                  <div>
                    <Header />
                    <SecondHeader />
                    <Home />
                  </div>
                ) : (
                  // 未ログインの場合はログインコンポーネントを表示
                  <Login />
                )}
              </div>
            }
          />
          <Route element={<WithHeaderLayout />}>
            <Route path="/home" element={<Home />} />

            <Route path="/myfavorite" element={<MyFavorite />} />
            <Route path="/addenglish" element={<AddEnglish />} />
            <Route path="/myacount" element={<MyAcount />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Headerを含まないルート */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/postEditor/:postId" element={<PostEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
