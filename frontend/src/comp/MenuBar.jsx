import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import QueueRoundedIcon from "@mui/icons-material/QueueRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AddEnglish from "./AddEnglish";
import Contact from "./Contact";
import { useSelector } from "react-redux";

// 例: import 文の確認
import { useMediaQuery } from "react-responsive";

const MenuBar = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 639 });
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const storedName = localStorage.getItem("name");

  const handleModalOpen = (modalNumber) => {
    switch (modalNumber) {
      case 1:
        setIsModalOpen1(true);
        setIsModalOpen2(false);
        break;
      case 2:
        setIsModalOpen2(true);
        setIsModalOpen1(false);
        break;
      default:
        break;
    }
  };

  /* const handleModalClose = () => {
    setIsModalOpen1(false);
    setIsModalOpen2(false);
  };
  */

  const closeWithClickOutSideMethod = (e, setter) => {
    console.log("e.target", e.target);
    console.log("e.currentTarget", e.currentTarget);
    if (e.target === e.currentTarget) {
      //メニューの外側をクリックしたときだけメニューを閉じる
      console.log("メニューの外側をクリックした");
      setter(false);
    } else {
      console.log("メニューの内側をクリックした");
    }
  };

  return (
    <div className="pt-5 fixed z-10 bg-gray-200 min-h-full w-44 ">
      <ul className="ml-3 flex   sm:flex-col ">
        <li
          className={`flex-grow-10 mb-3 mr-3 ml-1 ${
            isSmallScreen ? "flex" : ""
          }`}
        >
          <NavLink
            to="/home"
            className="flex items-center hover:bg-gray-300  focus:bg-gray-300   focus:ring focus:ring-gray-400   font-bold py-2 px- rounded w-full"
          >
            {" "}
            <HomeRoundedIcon />
            {isSmallScreen || "みんなのメモ"}
          </NavLink>
        </li>
        <li
          className={`flex-grow-10 mb-3 mr-3 ml-1 ${
            isSmallScreen ? "flex " : ""
          }`}
        >
          <NavLink
            to="/myfavorite"
            className="flex items-center hover:bg-gray-300 focus:bg-gray-300   focus:ring focus:ring-gray-400   font-bold py-2 px- rounded w-full"
          >
            {" "}
            <FavoriteRoundedIcon />
            {isSmallScreen || "お気に入りメモ"}
          </NavLink>
        </li>
        <li
          className={`flex-grow-10 mb-3 mr-3 ml-1 ${
            isSmallScreen ? "flex" : ""
          }`}
        >
          <button
            onClick={() => handleModalOpen(1)}
            className="flex items-center hover:bg-gray-300 focus:bg-gray-300   focus:ring focus:ring-gray-400   font-bold py-2 px- rounded w-full"
          >
            {" "}
            <CreateRoundedIcon />
            {isSmallScreen || "メモ"}
          </button>
        </li>
        {isModalOpen1 && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            {/* モーダルの中身やスタイルを設定 */}
            <div
              onClick={(e) => {
                closeWithClickOutSideMethod(e, setIsModalOpen1);
              }}
              className="modal-overlay absolute inset-0 bg-black opacity-50"
            ></div>
            <div className="modal z-10 bg-white p-4 w-3/5 h-5/6	overflow-y-auto rounded">
              <AddEnglish />
            </div>
          </div>
        )}
        <li
          className={`flex-grow-10 mb-3 mr-3 ml-1 ${
            isSmallScreen ? "flex" : ""
          }`}
        >
          <NavLink
            to="/myaccount"
            className="flex items-center hover:bg-gray-300 focus:bg-gray-300   focus:ring focus:ring-gray-400   font-bold py-2 px- rounded w-full"
          >
            <AccountCircleRoundedIcon />
            {isSmallScreen || <span className="truncate ">{storedName}</span>}
          </NavLink>
        </li>
        <li
          className={`flex-grow-10 mb-3 mr-3 ml-1${
            isSmallScreen ? "flex" : ""
          }`}
        >
          <button
            onClick={() => handleModalOpen(2)}
            className="flex items-center hover:bg-gray-300 focus:bg-gray-300   focus:ring focus:ring-gray-400   font-bold py-2 px- rounded w-full"
          >
            {" "}
            <SendRoundedIcon />
            {isSmallScreen || "コンタクト"}
          </button>
        </li>
        {isModalOpen2 && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            {/* モーダルの中身やスタイルを設定 */}
            <div
              onClick={(e) => {
                closeWithClickOutSideMethod(e, setIsModalOpen2);
              }}
              className="modal-overlay absolute inset-0 bg-black opacity-50"
            ></div>
            <div className=" modal z-10 bg-white p-4 rounded w-3/5 h-3/5 overflow-y-auto">
              <Contact />
            </div>
          </div>
        )}
      </ul>
    </div>
  );

  return { isModalOpen1, setIsModalOpen1, setIsModalOpen2, isModalOpen2 };
};

export default MenuBar;
