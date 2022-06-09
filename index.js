const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const videosFilePath = "./data/videos.json";

const getVideos = () => {
  return JSON.parse(fs.readFileSync(videosFilePath));
};

app.route("/videos").get((req, res) => {
  let videos = getVideos();
  const basicVideoInfo = videos.map((video) => {
    return {
      title: video.title,
      channel: video.channel,
      image: video.image,
      id: video.id,
    };
  });
  res.json(basicVideoInfo);
  //res.send(basicVideoInfo);
});

app.route("/videos/:id").get((req, res) => {
  let requestedId = req.params.id;
  let videos = getVideos();
  const detailedVideoInfo = videos.find((specifiedVideo) => {
    return specifiedVideo.id === requestedId;
  });
  res.json(detailedVideoInfo);
});

app.route("/videos").post((req, res) => {
  console.log(req.body);
  const { title, channel, description, comments } = req.body;
  console.log(description);
  let videos = getVideos();
  videos.push({
    id: uuidv4(),
    image: "https://i.imgur.com/l2Xfgpl.jpg",
    title,
    description,
    channel,
    comments,
    // image: "/public/images/Upload-video-preview.jpg",
  });
  fs.writeFile(videosFilePath, JSON.stringify(videos), (err) => {
    if (err) console.log(err);
    fs.readFileSync(videosFilePath);
  });
  res.json(videos);
});

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
