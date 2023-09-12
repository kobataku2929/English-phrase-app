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
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
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

/*app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ? ";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("succuess");
    } else {
      return res.json("Faile");
    }
  });
});*/

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
            const token = jwt.sign({ name }, "jwt-secret-key", {
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

app.listen(8081, () => {
  console.log("listening");
});
