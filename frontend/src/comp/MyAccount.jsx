import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CreateFolder from "./CreateFolder";
import PostEditor from "./PostEditor";
import { logout, setName } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { setData, setError } from "../redux/postSlice";
import Avatar from "@mui/material/Avatar";
import { red, cyan, teal } from "@mui/material/colors";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
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
  const [foldedStates, setFoldedStates] = useState({});
  const [currentPostId, setCurrentPostId] = useState(null);
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const storedName = localStorage.getItem("name");

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
  const handleButtonClick = (postId) => {
    // 特定の投稿のisFoldedの状態を切り替える
    setFoldedStates((prevFoldedStates) => ({
      ...prevFoldedStates,
      [postId]: !prevFoldedStates[postId],
    }));
  };

  return (
    <div className="p-4 bg-gray-100 flex flex-col items-center">
      {auth ? (
        <div>
          <EditNoteRoundedIcon />
          <PushPinRoundedIcon />
          <VerifiedUserRoundedIcon />
          <h3>{storedName}としてログイン</h3>

          <button onClick={handleDelete}>Logout</button>
          <br />
          <CreateFolder />

          <ul>
            <strong>
              英語フレーズ:<Avatar sx={{ bgcolor: red[500] }}>N</Avatar>
            </strong>
            <br />
            <strong>日本語:</strong>
            <br />
            <strong>センテンス:</strong>
            <br />
            <strong>詳細:</strong>
            <br />
            {data.map((item) => (
              <li key={item.id}>
                <br />
                <span className=" hover:bg-gray-300 focus:bg-gray-300   focus:ring focus:ring-gray-400   py-0.5 rounded">
                  <MoreHorizRoundedIcon
                    onClick={() => openModal(item.id, item.phrase)}
                  />
                </span>
                {isModalOpen && (
                  <div
                    onClick={(e) => {
                      closeWithClickOutSideMethod(e, setIsModalOpen);
                    }}
                    className=" z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-5"
                  >
                    <div className="bg-white p-8 rounded relative">
                      <span
                        className="absolute top-2 left-3 close text-gray-500 hover:text-gray-700 text-2xl"
                        onClick={closeModal}
                      >
                        &times;
                      </span>

                      <p className="mt-3 text-xl">{currentPhrase}</p>

                      <div className="flex items-center pt-4">
                        <DriveFileRenameOutlineRoundedIcon
                          className="cursor-pointer"
                          onClick={() => handleEdit(currentPostId)}
                        />
                        <span
                          className="cursor-pointer ml-2"
                          onClick={() => handleEdit(currentPostId)}
                        >
                          編集
                        </span>
                      </div>

                      <div className="flex items-center">
                        <DeleteIcon
                          className="cursor-pointer"
                          onClick={() => handleRemove(currentPostId)}
                        />
                        <span
                          className="cursor-pointer ml-2"
                          onClick={() => handleRemove(currentPostId)}
                        >
                          削除
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <br />
                <div className="flex  ">
                  <span className="mt-1  ml-1">
                    <Avatar
                      sx={{
                        zIndex: 0,
                        bgcolor: red[500],
                        width: 16,
                        height: 16,
                        fontSize: 10,
                      }}
                    >
                      英
                    </Avatar>
                  </span>

                  <span className="ml-2">{item.phrase}</span>
                </div>

                <div className="flex ">
                  <span className="mt-1 ml-1 ">
                    <Avatar
                      sx={{
                        bgcolor: teal[500],
                        width: 16,
                        height: 16,
                        fontSize: 10,
                      }}
                    >
                      和
                    </Avatar>
                  </span>

                  <span className="ml-2"> {item.japanese}</span>
                </div>

                {item.sentence ? (
                  <div className="flex ">
                    <span className="mt-1 ml-1">
                      <Avatar
                        sx={{
                          bgcolor: cyan[500],
                          width: 16,
                          height: 16,
                          fontSize: 10,
                        }}
                      >
                        例
                      </Avatar>
                    </span>

                    <span className="ml-2"> {item.sentence}</span>
                  </div>
                ) : null}

                {item.details ? (
                  <div>
                    {foldedStates[item.id] ? (
                      <ExpandMoreRoundedIcon
                        className="transform rotate-180"
                        onClick={() => handleButtonClick(item.id)}
                      />
                    ) : (
                      <ExpandMoreRoundedIcon
                        onClick={() => handleButtonClick(item.id)}
                      />
                    )}
                    {foldedStates[item.id] ? (
                      <div className=" ml-1 ">{item.details}</div>
                    ) : null}
                  </div>
                ) : null}
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
