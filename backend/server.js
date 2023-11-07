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
        req.email = decoded.email;
        req.password = decoded.password;

        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({
    Status: "Success",
    name: req.name,
    id: req.id,
    email: req.email,
    password: req.password,
  });
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
            const email = data[0].email;
            const password = data[0].password;

            const payload = { name, id, email, password };
            //console.log(email);

            const token = jwt.sign(payload, "jwt-secret-key", {
              expiresIn: 120 * 24 * 60 * 60,
            });
            res.cookie("token", token);

            return res.json({
              Status: "Success",
              id: id,
              email: email,
              password: password,
            });
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
  db.query(
    "SELECT * FROM `posts` ORDER BY `timestamp` DESC",
    (err, results) => {
      if (err) {
        console.error("MySQL query error:", err);
        res.status(500).json({
          error: "An error occurred while fetching data from the database.",
        });
      } else {
        // クエリの結果をクライアントに送信
        res.json(results);
      }
    }
  );
});

//いいね機能
app.post("/post", verifyUser, (req, res) => {
  const userId = req.id; // ログインユーザーのID
  const postId = req.body.PostId; // クライアントから送られてきた投稿のID

  // console.log(postId);

  // ここでデータベースにいいねの情報を挿入するロジックを実装
  const sqlInsertLike = "INSERT INTO likes (userid, post) VALUES (?, ?)";
  db.query(sqlInsertLike, [userId, postId], (err, result) => {
    if (err) {
      console.error("Error inserting like:", err);
      return res.json({ Status: "Error" });
    }

    // いいねが成功したら、該当の投稿のいいね数を更新する
    let sqlUpdateLikesCount;
    //let sqlLikeDelete;

    // 仮の条件：いいねボタンが押された場合 修正必要
    const isLiked = req.body.isLiked;
    // あなたの実際の条件に合わせて変更

    if (isLiked) {
      // いいねボタンが押された場合のSQL文
      sqlUpdateLikesCount =
        "UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?";
    } else {
      // いいねボタンが押されていない場合のSQL文
      sqlUpdateLikesCount =
        "UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?";
      //sqlLikeDelete = "DELETE FROM likes WHERE id = ?";
    }

    db.query(sqlUpdateLikesCount, [postId], (err, updateResult) => {
      if (err) {
        console.error("Error updating likes count:", err);
        return res.json({ Status: "Error" });
      }

      return res.json({ Status: "Success" });
    });
  });
});

app.get("/myacount", verifyUser, (req, res) => {
  const id = req.id;
  const sql =
    "SELECT * FROM `posts` WHERE userid = ? ORDER BY `timestamp` DESC;";

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
app.get("/myfavorite", verifyUser, (req, res) => {
  //const id = req.id;
  const favoritePostIds = req.query.favoritePostIds.split(",");

  console.log(favoritePostIds);
  const sql = "SELECT * FROM `posts` WHERE id IN (?)";
  // "SELECT * FROM `posts` JOIN likes ON posts.id = likes.post WHERE likes.userid = '?'";
  //"SELECT * FROM `posts` WHERE userid = ? ORDER BY `timestamp` DESC;";

  db.query(sql, [favoritePostIds], (err, results) => {
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

/*app.post("/contuct", verifyUser, async (req, res) => {
  const { name, message } = req.body;
  const email = req.email;
  const password = req.password;
  //bcrypt.compare(req.body.password.toString(), data[0].password);
  console.log(password);

  // nodemailerの設定
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email, // 送信元のメールアドレス
      pass: password, // 送信元のメールアドレスのパスワード
    },
  });

  // メールの内容
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "お問い合わせがありました",
    text: `お名前: ${name}\nメールアドレス: ${email}\n\n${message}`,
  };

  try {
    // メール送信
    await transporter.sendMail(mailOptions);
    res.status(200).send("メールが送信されました");
  } catch (error) {
    console.error(error);
    res.status(500).send("メールの送信に失敗しました");
  }
});

*/
app.post("/contuct", verifyUser, (req, res) => {
  const values = [req.email, req.body.name, req.body.message];

  console.log(values);

  const sql = "INSERT INTO contuct (`email`, `name`, `message`) VALUES (?)";
  db.query(sql, [values], (err, result) => {
    console.log(err);
    if (err) {
      return res.json({ Status: "Error" });
    }

    return res.json({ Status: "Success " });
  });
});

app.listen(8081, () => {
  console.log("listening");
});

//select*from posts inner join login on posts.userid = login.name;
//SELECT*FROM posts LEFT JOIN login ON posts.userid = login.name;
