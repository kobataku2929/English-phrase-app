import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CreateFolder from "./CreateFolder";
import { logout, setName } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { setData, setError } from "../redux/postSlice";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

const MyAcount = () => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  //const [name, setName] = useState("");
  // const [userPosts, setUserPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState([]);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true); // ローディング状態

  const userId = useSelector((state) => state.user.userId);
  const name = useSelector((state) => state.user.name);
  const navigate = useNavigate();

  const { data, error, loading } = useSelector((state) => state.post);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const storedName = localStorage.getItem("name");

  //console.log(userId);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8081/myaccount")
        .then((response) => {
          dispatch(setData(response.data));
          //store.dispatch(setUserId(userId));
        })
        .catch((error) => {
          dispatch(
            setError("An error occurred while fetching data from the server.")
          );
          console.error("Axios error:", error);
          //setLoading(false); // データの取得が失敗したらローディングを終了
        });
    };

    // サーバーからデータを取得する関数を呼び出す

    fetchData();
  }, [dispatch, userId]);

  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          //setName(res.data.name);

          //dispatch(setName(res.data.name));

          console.log(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .then((err) => console.log(err));
  }, [setAuth, setName, setMessage]);

  const handleDelete = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        localStorage.removeItem("userId");
        localStorage.removeItem("name");

        dispatch(logout({ userId }));
        navigate("/");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  /*useEffect(() => {
    // サーバーからデータを取得する関数を呼び出す
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8081/myacount")
      .then((response) => {
        setData(response.data);
        setError(null);
        setLoading(false); // データの取得が成功したらローディングを終了
      })
      .catch((error) => {
        setError("An error occurred while fetching data from the server.");
        console.error("Axios error:", error);
        setLoading(false); // データの取得が失敗したらローディングを終了
      });
  };*/

  const handleRemove = (postId) => {
    console.log(postId);
    const askDelete = window.confirm("本当に消しますか？");
    if (askDelete) {
      axios
        .post("http://localhost:8081/myaccount", { postId })
        .then((res) => {
          if (res.data.Status === "Success") {
            window.location.reload();
          } else if (res.data.Status === "Error") {
            //window.alert("そのメールアドレスは既に登録されています");
          } else {
            //alert("エラーが発生しました");
          }
        })
        .catch((err) => {
          console.error(err);
          //alert("エラーが発生しました");
        });
    }
  };

  const handleEdit = (postId) => {
    navigate(`/postEditor/${postId}`);
  };

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const openModal = (postId, phrase) => {
    setIsModalOpen(true);
    setCurrentPostId(postId);
    setCurrentPhrase(phrase);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPostId(null);
    setCurrentPhrase(null);
  };
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
    <div className="p-4 bg-gray-100 flex flex-col items-center">
      {auth ? (
        <div>
          <h3>{storedName}としてログイン</h3>

          <button onClick={handleDelete}>Logout</button>
          <br />
          <CreateFolder />

          <ul>
            {data.map((item) => (
              <li key={item.id}>
                <br />
                <MoreHorizRoundedIcon
                  onClick={() => openModal(item.id, item.phrase)}
                />
                {isModalOpen && (
                  <div
                    onClick={(e) => {
                      closeWithClickOutSideMethod(e, setIsModalOpen);
                    }}
                    className="  fixed inset-0 flex items-center justify-center bg-black bg-opacity-10"
                  >
                    <div className="bg-white p-8 rounded">
                      <span
                        className="close text-gray-500 hover:text-gray-700 text-2xl"
                        onClick={closeModal}
                      >
                        &times;
                      </span>
                      <br />
                      <p>フレーズ: {currentPhrase}</p>

                      <button onClick={() => handleEdit(currentPostId)}>
                        Edit
                      </button>
                      <br />

                      <button onClick={() => handleRemove(currentPostId)}>
                        削除
                      </button>
                    </div>
                  </div>
                )}
                <br />
                <strong>フレーズ:</strong> {item.phrase}
                <br />
                <strong>センテンス:</strong> {item.sentence}
                <br />
                <strong>日本語:</strong> {item.japanese}
                <br />
                <strong>詳細:</strong> {item.details}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>

          <NavLink to="/login">Go to login</NavLink>
        </div>
      )}
    </div>
  );
};

export default MyAcount;