const express = require('express');
const ytdl = require('@microlink/youtube-dl');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const ffmpeg = require('fluent-ffmpeg');
const move = require('./middle/changefile')


const app = express();


app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/',(req,res) =>{
  // const {url} = req.body;
  let url = 'https://www.youtube.com/watch?v=KxgJdqfIk1s&list=RD9x2fSJxp2bg&index=10'
  ytdl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
    if (err) throw err;
    console.log(output.join('\n'));
  });
})



app.post('/download',(req, res)=>{
  const  {url} = req.body;
  const { filename } = req.body
  const videoDownPath = __dirname
  if(url && filename){
    return res.download(path.join(videoDownPath,filename));
  } else {
    return res.status(400).json({error: '錯誤'})
  }
})

app.post('/ytdl',(req, res) =>{
  const errors = {}
  const  {url} = req.body;
  let accessList = ['https://www.youtube.com/','https://m.youtube.com/','https://youtu.be/']
  if(url.indexOf('https://www.youtube.com/') === -1 &&
  url.indexOf('https://m.youtube.com/') === -1 &&
 url.indexOf('https://youtu.be/') === -1){
    errors.input = 'this url invalid';
    return res.status(400).json(errors)
  }
  let video = ytdl(url,
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });
  // Will be called when the download starts.
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
    ytdl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
      if (err) throw err;
      console.log(output)
      console.log(output.join('\n'));
      let oldName = info._filename
      let newName = oldName.replace(/mp4/, 'mp3');
      res.json({
        filename: newName
      })
    });
  });
  
  
})




app.listen(5311,()=>{
  console.log('port in 8000');
})