import "./App.css";
//1．useStateとuseEffectをインポート
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Home from "./comp/Home";
import MyFavorite from "./comp/MyFavorite";

import AddEnglish from "./comp/AddEnglish";
import Login from "./comp/Login";
import MyAccount from "./comp/MyAccount";
import Contact from "./comp/Contact";
import SignUp from "./comp/SignUp";
import Header from "./comp/Header";
import MenuBar from "./comp/MenuBar";
import PostEditor from "./comp/PostEditor";
import CreateFolder from "./comp/CreateFolder";
import Folder from "./comp/Folder";
import Footer from "./comp/Footer";

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
  const isSmallScreen = useMediaQuery({ maxWidth: 600 });

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
                    {isSmallScreen ? (
                      // 画面が小さい場合はモバイル向けの表示
                      <div>
                        <Header />
                        <Home />
                        <div className="fixed z-50 bottom-0 left-0 w-full p-2 bg-gray-200 box-border">
                          <MenuBar />
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        {/* サイドバー */}
                        <div className="w-1/4 bg-gray-200  ">
                          {/* サイドバーのコンテンツ */}
                          <MenuBar className="sticky" />
                        </div>

                        {/* メインコンテンツ */}
                        <div className="flex-1 ">
                          <Header />
                          <Home />
                          {/* メインコンテンツのコンテンツ */}
                        </div>
                      </div>
                    )}
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
            <Route path="/myaccount" element={<MyAccount />} />
            <Route path="/createfolder" element={<CreateFolder />} />
            <Route path="/Footer" element={<Footer />} />
            <Route path="/postEditor/:postId" element={<PostEditor />} />
            <Route path="/myaccount/:folderId" element={<Folder />} />

            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Headerを含まないルート */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
