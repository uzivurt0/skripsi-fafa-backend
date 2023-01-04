// import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config.js";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const PORT = process.env.PORT || 5000;

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "sisrek_ban",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    mesage: "Welcome",
  });
});

//Add New Ban

app.post("/api/banbaru", (req, res) => {
  const merk = req.body.merk;
  const size = req.body.size;
  const ring = req.body.ring;
  const harga = req.body.harga;
  const peruntukan = req.body.peruntukan;

  const sqlInsert =
    "INSERT INTO spesifikasi (merk, size, ring, harga) VALUE (?, ?, ?, ?);";
  db.query(sqlInsert, [merk, size, ring, harga, peruntukan], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.sendStatus(200);
  });
});

//Post Jawaban
app.post("/api/jawab", (req, res) => {
  const id = "a";
  const diameter = req.body.diameter;
  const harga = req.body.harga;
  const kategori = req.body.kategori;

  const sqlInsert =
    "INSERT INTO jawaban (id,diameter,harga,kategori) VALUES (?,?,?);";
  db.query(sqlInsert, [id, diameter, harga, kategori], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.sendStatus(200);
  });
});

//Delete Jawaban

app.delete("/api/deletejwb", (res) => {
  const sqlDelete = "DELETE FROM jawab WHERE id = 'a'";

  db.query(sqlDelete, (err, result) => {
    if (err) {
      res.json({
        message: err.message,
      });
      console.log(err);
    }
  });
});

//View All Ban

app.post("/api/addban", (req, res) => {
  const id = req.body.id;
  const merk = req.body.merk_ban;
  const ukuran = req.body.ukurans;
  const harga = req.body.hargas;
  const diameter = req.body.rings;
  const profil = req.body.profils;
  const compound = req.body.compounds;

  console.log(req.body);

  const sqlInsert =
    "INSERT INTO spesifikasi (id, merk_ban, ukuran, profil, ring, harga, compound) VALUES (?,?,?,?,?,?,?) ";

  db.query(
    sqlInsert,
    [id, merk, ukuran, profil, diameter, harga, compound],
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
  const getUser = "SELECT * FROM user";
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
