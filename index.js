const clipboardy = require("clipboardy");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const config = require("./config.json");

let lastVideo = "";
const SLEEP_TIME = config.sleep_time;
const FOLDER = config.folder;

// Regularly Check if YouTube URL is in clipboard
setInterval(async () => {
  let content = '';
  try {
    content = clipboardy.readSync();
  } catch { }

  if (!content.startsWith("https://www.youtube.com/watch?v=")) return;
  if (content === lastVideo) return;

  lastVideo = content;

  const info = await ytdl.getInfo(content);
  const title = info.player_response.videoDetails.title.replace(/[/\\?%*:|"<>]/g, "-");
  const stream = ytdl(content);

  ffmpeg(stream)
    .audioBitrate(128)
    .save("file:" + FOLDER + title + ".mp3")
    .outputOption(['-y']);
}, SLEEP_TIME);

console.log('Waiting for YouTube Links to be copied')