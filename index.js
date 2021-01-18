const clipboardy = require("clipboardy");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const config = require("./config.json");

let lastVideo = "";
const SLEEP_TIME = config.sleep_time;
const FOLDER = config.folder;

// Regularly Check if YouTube URL is in clipboard
setInterval(async () => {
  const content = clipboardy.readSync();

  if (!content.startsWith("https://www.youtube.com/watch?v=")) return;
  if (content === lastVideo) return;

  lastVideo = content;

  const title = (
    await ytdl.getInfo(content)
  ).player_response.videoDetails.title.replace(/[/\\?%*:|"<>]/g, "-");
  const stream = ytdl(content);

  ffmpeg(stream)
    .audioBitrate(128)
    .save(FOLDER + title + ".mp3");
}, SLEEP_TIME);
