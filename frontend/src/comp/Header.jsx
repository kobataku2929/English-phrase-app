import React from "react";
import { NavLink } from "react-router-dom";

//import "./Header.css";

const header = () => {
  return (
    <header className="bg-orange-500">
      <div className="mx-auto container flex p-5">
        <h3 className="mr-80">みんなの英語</h3>
        <nav>
          <ul className="mx-auto container flex flex-col md:flex-row ">
            <li className="mr-20">
              <NavLink to="/login">Login</NavLink>
            </li>
            <li className="mr-20">
              <NavLink to="/myacount">MyAcount</NavLink>
            </li>
            <li className="mr-20">
              <NavLink to="/contuct">Contuct</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default header;
