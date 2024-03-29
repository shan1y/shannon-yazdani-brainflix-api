const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const videos = require("./routes/videos");

dotenv.config();
const PORT = process.env.PORT ?? 8080;

//parse incoming json request and puts parsed data in req
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//load router module in app
app.use("/videos", videos);

app.get("/", function (req, res) {
  console.log(req);
  res.send("Welcome to BrainFlix API!");
});

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
