import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../pictures/logo.EM_no_BG.png";

//import "./Header.css";

const header = () => {
  return (
    <header className="bg-orange-500">
      <div className="mx-auto container flex p-5">
        <img src={logo} alt="EMのロゴ" className="w-16 h-16" />
        <h3 className="mr-80">English Memorandum 英語メモアプリ</h3>
      </div>
    </header>
  );
};

export default header;
