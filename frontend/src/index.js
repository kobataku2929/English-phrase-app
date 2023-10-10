import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userReducer from "./redux/userSlice";
import postReducer from "./redux/postSlice";
import thunk from "redux-thunk";
import axios from "axios";

axios.defaults.withCredentials = true;

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
  middleware: [thunk],
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

export default store;
