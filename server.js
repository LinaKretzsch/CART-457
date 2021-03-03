// Created this code by following the tutorial https://www.youtube.com/watch?v=6BozpmSjk-Y

const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static"))); //whenever the path has /static inside of it, we will server the static directory

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html")); //will default to this file
});

app.listen(process.env.PORT || 5000, () => console.log("Server running..."));
