// import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config.js";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");

const PORT = process.env.PORT || 5000;

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "sisrek_ban",
});

app.use(cors({ origin: "https://ban-tuin.netlify.app" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({
    mesage: "Welcome",
  });
});

//Add New Ban

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/uploads/");
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + "-" + Date.now() + path.extname);
  },
});

var upload = multer({
  storage: storage,
});

//View All Ban

app.post("/api/addban", upload.single("image"), (req, res) => {
  const id = req.body.id;
  const merk = req.body.merk_ban;
  const ukuran = req.body.ukurans;
  const harga = req.body.hargas;
  const diameter = req.body.rings;
  const profil = req.body.profils;
  const compound = req.body.compounds;
  const imgSrc =
    req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
  req.file.filename;

  console.log(req.body);

  const sqlInsert =
    "INSERT INTO spesifikasi (id, merk_ban, ukuran, profil, ring, harga, compound, image) VALUES (?,?,?,?,?,?,?,?) ";

  db.query(
    sqlInsert,
    [id, merk, ukuran, profil, diameter, harga, compound, imgSrc],
    (err, result) => {
      if (err) console.log(err);
    }
  );
});

app.get("/api/daftarban", (req, res) => {
  const getAllBan = "SELECT * FROM spesifikasi";
  db.query(getAllBan, (err, result) => {
    res.send(result);
    if (err) {
      console.log(err);
    }
  });
});

app.put("/api/editban", (req, res) => {
  const id = req.body.id;
  const merk = req.body.merk_ban;
  const ukuran = req.body.ukurans;
  const harga = req.body.hargas;
  const diameter = req.body.rings;
  const profil = req.body.profils;
  const compound = req.body.compounds;
  console.log(req.body);

  const editBan =
    "UPDATE spesifikasi SET  merk_ban = ?, ukuran = ?, profil = ?, ring = ?, harga = ?, compound = ? WHERE id = ?";
  db.query(
    editBan,
    [merk, ukuran, profil, diameter, harga, compound, id],
    (err, result) => {
      if (err) console.log(err);
    }
  );
});

app.delete("/api/deleteban/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM spesifikasi WHERE id = ?";

  db.query(sqlDelete, id, (err, result) => {
    if (err) console.log(err);
  });
});

app.get("/api/user", (req, res) => {
  const getUser = "SELECT * FROM user_data";
  db.query(getUser, (err, result) => {
    res.send(result);
    if (err) {
      console.log(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
