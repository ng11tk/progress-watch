import express from "express";
import { MongoClient } from "mongodb";

const PORT = process.env.PORT || 3000;
const app = express();

// database setup
let db;
MongoClient.connect("mongodb://localhost:27017/users", (err, client) => {
  if (err) throw err;

  db = client.db("users");

  console.log("Connected to Database");
});

app.get("/", (req, res) => {
  db.collection("users")
    .find()
    .toArray((err, results) => {
      if (err) {
        res.send("Hello World!");
      } else {
        res.json(results);
      }
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// O78vKQYdptXV1AlB 