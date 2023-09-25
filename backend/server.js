const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt = 10;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "signup",

  port: 3305,
});
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ Error: "あなたは認証されていません " });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "トークンが一致しません " });
      } else {
        req.name = decoded.name;
        req.id = decoded.id;

        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name, id: req.id });
});

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const checkEmailQuery = "SELECT * FROM login WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      return res.json({ Error: "Database error" });
    }

    if (result.length > 0) {
      // メールアドレスが既に存在する場合、エラーレスポンスを返す
      return res.json({ Status: "Error" });
    }

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
      if (err) return res.json({ Error: "Erro for hassing password" });
      const values = [req.body.name, req.body.email, hash];

      db.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "inserting error" });

        return res.json({ Status: "Success" });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = `SELECT * FROM login WHERE email = ?`;
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "login error in server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "password erro" });
          if (response) {
            const name = data[0].name;
            const id = data[0].id;

            const payload = { name, id };

            const token = jwt.sign(payload, "jwt-secret-key", {
              expiresIn: 120 * 24 * 60 * 60,
            });
            res.cookie("token", token);

            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "パスワードが一致しません" });
          }
        }
      );
    } else {
      return res.json({ Error: "このメールアドレスは存在しません" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.post("/addenglish", verifyUser, (req, res) => {
  const values = [
    req.id,
    req.body.phrase,
    req.body.japanese,
    req.body.sentence,
    req.body.details,
  ];

  console.log(values);

  const sql =
    "INSERT INTO posts (`userid`, `phrase`, `japanese`, `sentence`, `details`) VALUES (?)";
  db.query(sql, [values], (err, result) => {
    if (err) {
      return res.json({ Status: "Error" });
    }

    return res.json({ Status: "Success " });
  });
});

app.get("/post", (req, res) => {
  // MySQL クエリを実行してデータを取得
  db.query("SELECT * FROM posts", (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).json({
        error: "An error occurred while fetching data from the database.",
      });
    } else {
      // クエリの結果をクライアントに送信
      res.json(results);
    }
  });
});

// クライアントからのリクエストを受け取り、ログインユーザーのIDを確認
/*app.get("/myacount", verifyUser, (req, res) => {
  const userId = req.userId; // verifyUser ミドルウェアで設定されたユーザーID

  // ユーザーIDに関連する投稿を取得するクエリを実行
  const sql = "SELECT * FROM login WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      return res.status(500).json({
        error: "An error occurred while fetching data from the database.",
      });
    } else {
      // 取得したデータをクライアントに送信
      res.json(data);
    }
  });
});*/

app.get("/myacount", verifyUser, (req, res) => {
  const id = req.id;
  const sql = "SELECT * FROM `posts` WHERE userid = ?;";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).json({
        error: "An error occurred while fetching data from the database.",
      });
    } else {
      // クエリの結果をクライアントに送信
      res.json(results);
    }
  });
});

app.listen(8081, () => {
  console.log("listening");
});

//select*from posts inner join login on posts.userid = login.name;
//SELECT*FROM posts LEFT JOIN login ON posts.userid = login.name;
