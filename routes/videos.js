const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
router.use(express.json());
const videosFilePath = "./data/videos.json";

const getVideos = () => {
  return JSON.parse(fs.readFileSync(videosFilePath));
};

router
  .route("/")
  .get((req, res) => {
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
  })
  .post((req, res) => {
    console.log(req.body);
    const { title, channel, description, comments, timestamp } = req.body;
    console.log(description);
    let videos = getVideos();
    videos.push({
      id: uuidv4(),
      image: "http://localhost:8080/images/Upload-video-preview.jpg",
      title,
      description,
      channel,
      comments,
      timestamp: timestamp,
      views: 0,
      likes: 0,
    });
    fs.writeFile(videosFilePath, JSON.stringify(videos), (err) => {
      if (err) console.log(err);
      fs.readFileSync(videosFilePath);
    });
    res.json(videos);
  });

router.route("/:id").get((req, res) => {
  let requestedId = req.params.id;
  let videos = getVideos();
  const detailedVideoInfo = videos.find((specifiedVideo) => {
    return specifiedVideo.id === requestedId;
  });
  res.json(detailedVideoInfo);
});

module.exports = router;
