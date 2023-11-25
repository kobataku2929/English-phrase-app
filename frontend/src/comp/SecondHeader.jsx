import React from "react";
import { NavLink } from "react-router-dom";

const SecondHeader = () => {
  return (
    <div>
      <nav className="bg-orange-100">
        <ul className="flex p-5 items-center justify-center">
          <li className="mr-20">
            <NavLink to="/home">みんなのmemo</NavLink>
          </li>
          <li className="mr-20">
            <NavLink to="/myfavorite">お気に入りのフレーズ</NavLink>
          </li>
          <li className="mr-20">
            <NavLink to="/addenglish">フレーズmemo</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SecondHeader;
