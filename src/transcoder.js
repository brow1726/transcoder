let ffmpeg = require('fluent-ffmpeg'),
    ffprobe = require('node-ffprobe'),
    request = require('request-promise'),
    Promise = require('bluebird'),
    fs = require('fs'),
    path = require('path');
os = require('os');

let cpu = os.cpus().length;

console.log('******************** cpu ********************');
console.log(cpu);
console.log('************************************************');

let videoPath = path.join(__dirname, 'video');


function getVideoInformation(url) {
  console.log('******************** "getting video" ********************');
  console.log("getting video");
  console.log('************************************************');
  let reqOptions = {
    uri: url,
    method: 'GET',
    encoding: 'binary'
  };
  return request(reqOptions)
      .then((response) => {
        console.log('******************** "got response" ********************');
        console.log("got response");
        console.log('************************************************');
        return new Promise((res, rej) => {
          let writeStream = fs.createWriteStream(`${videoPath}/asdf.mp4`);
          writeStream.write(response, 'binary');
          writeStream.on('finish', () => {
            console.log('******************** "done" ********************');
            console.log("done");
            console.log('************************************************');
            res(`${videoPath}/asdf.mp4`);
          });
          writeStream.end();
        })
      })
      .catch((err) => {
        console.log('******************** err ********************');
        console.log(err);
        console.log('************************************************');
      })
}

function getVideoInfo(videoPath) {
  console.log('******************** "get video info" ********************');
  console.log("get video info");
  console.log('************************************************');
  return new Promise((res, rej) => {
    res({videoPath: videoPath});
  })
}

function startTranscode(data) {
  let videoSize = [
    '256x144',
    '426x240',
    '640x360',
    '854x480',
    '1280x720',
    '1920x1080'
  ];
  console.log('******************** data ********************');
  console.log(data);
  console.log('************************************************');
  return new Promise.map(videoSize, (size) => {
    let qualityControl = '-b:v 0';
    if(size.indexOf('144') > -1) {
      console.log('******************** size ********************');
      console.log(size);
      console.log('************************************************');
      qualityControl = '-b:v 200k'
    }
    let webm = data.videoPath.split('.')[0] + size;
    new ffmpeg({source: `${data.videoPath}`})
        .format('webm')
        .videoCodec('libvpx-vp9')
        .inputOption('-threads 8')
        .outputOption(
            qualityControl
        )
        .size(size)
        .on('progress', (data) => {
          console.log('******************** size + " : " + data.percent ********************');
          console.log(size + " : " + data.percent);
          console.log('************************************************');
        })
        .on('end', () => {
          console.log('******************** size + " has completed" ********************');
          console.log(size + " has completed");
          console.log('************************************************');
        })
        .save(`${webm}.webm`)
  });
}



function promiseChain() {
  Promise.resolve("https://cdn.airvuz.com/drone-video/5cfc524407b29f41ed1ddc1eb9f9c3cf/5cfc524407b29f41ed1ddc1eb9f9c3cf-1080p.mp4")
      .then(getVideoInformation)
      .then(getVideoInfo)
      .then(startTranscode)
      .then((response) => {
        console.log('******************** response ********************');
        console.log(response);
        console.log('************************************************');
      })
}

promiseChain();




