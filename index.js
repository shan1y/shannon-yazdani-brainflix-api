const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");

const videos = require("./routes/videos");

//parse incoming json request and puts parsed data in req
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//load router module in app
app.use("/videos", videos);

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
