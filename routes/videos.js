const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
router.use(express.json());
const videosFilePath = "./data/videos.json";

//Define function to read API data from videos.json for use in get/post requsts.
const getVideos = () => {
  return JSON.parse(fs.readFileSync(videosFilePath));
};

//Router function for get requests at /videos.
router
  .route("/")
  .get((req, res) => {
    //get videos data from videos.json
    let videos = getVideos();
    //copy the array of video objects and assign it to a new variable, then return it as response.
    const basicVideoInfo = videos.map((video) => {
      return {
        title: video.title,
        channel: video.channel,
        image: video.image,
        id: video.id,
      };
    });
    return res.status(200).send(basicVideoInfo);
  })
  .post((req, res) => {
    console.log(req.body);
    //destructure req.body into keys that will be pushed to videos.json file
    const { title, channel, description, timestamp } = req.body;
    //get current data from videos.json file before new data from req body is pushed.
    let videos = getVideos();

    //add user data to videos array
    videos.push({
      id: uuidv4(),
      image:
        "https://brainflix-project-api.herokuapp.com/images/Upload-video-preview.jpg",
      title,
      description,
      channel,
      comments: [],
      timestamp: timestamp,
      views: 0,
      likes: 0,
    });
    //persist the data with the new object to videos.json
    fs.writeFile(videosFilePath, JSON.stringify(videos), (err) => {
      if (err) console.log(err);
      fs.readFileSync(videosFilePath);
    });
    res.json(videos);
  });

//when user requests /videos/:id, respond with detailed video object (includes comments)
router.route("/:id").get((req, res) => {
  let requestedId = req.params.id;
  let videos = getVideos();
  const detailedVideoInfo = videos.find((specifiedVideo) => {
    return specifiedVideo.id === requestedId;
  });
  res.json(detailedVideoInfo);
});

// router.route("/:id/comments").post((req, res) => {
//   let requestedId = req.params.id;
//   let videos = getVideos();
//   const detailedVideoInfo = videos.find((specifiedVideo) => {
//     return specifiedVideo.id === requestedId;
//   });
//   detailedVideoInfo.comments.unshift(req.body)
//   fs.writeFile(videosFilePath, JSON.stringify(videos), (err) => {
//       fs.readFileSync(videosFilePath);
//     });
//   res.status(200).json(detailedVideoInfo);
// });


router.route("/:id/:timestamp/delete").delete((req,res) => {
  console.log(req)
  let deleteTime = req.params.timestamp;
  let requestedId = req.params.id;
   let videos = getVideos();
  const detailedVideoInfo = videos.find((specifiedVideo) => {
    return specifiedVideo.id === requestedId;
  });
  const dataAfterDelete = detailedVideoInfo.comments.filter((unwantedComment)=>{
   (unwantedComment.timestamp) !==  parseInt(deleteTime)
  })
   res.status(200).json(dataAfterDelete);
})

module.exports = router;
