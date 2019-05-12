const express = require('express');
const ytdl = require('@microlink/youtube-dl');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req, res)=>{
  console.log(__dirname);
  res.send('succ')
})


app.post('/download',(req, res)=>{
  const { fileName } = req.body
  const videoDownPath = path.resolve(__dirname, './public')
  res.download(path.join(videoDownPath,info._filename),fileName);
})

app.post('/ytdl',(req, res) =>{
  const  {url} = req.body;
  const videoDownPath = path.resolve(__dirname, './public')  
  let  video = ytdl(url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.  
    { cwd: videoDownPath });
  // Will be called when the download starts.
    video.on('info', function(info) {
      console.log('Download started');
      console.log('filename: ' + info._filename);
      console.log('size: ' + info.size);
    let videodl = video.pipe(fs.createWriteStream(path.join(videoDownPath,info._filename)));
    videodl.on('finish',(data)=>{
      console.log('path.join(videoDownPath,info._filename)',path.join(videoDownPath,info._filename))      
      res.download(path.join(videoDownPath,info._filename),info._filename);
    })
  })  
})




app.listen(8000,()=>{
  console.log('port in 8000');
})