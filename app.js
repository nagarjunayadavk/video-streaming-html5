/* 
   @author - Nagarjuna Yadav K
*/
var express = require( 'express');
var bodyParser = require('body-parser')
var app = express();
var fs = require('fs');
// create application/json parser
var jsonParser = bodyParser.json();
app.use(express.static(__dirname));
//=== Get port from environment and store in Express.
var port  = process.env.PORT || 900;
app.listen(port, function () {
   console.log("Server Stated ======= in Port",port);
});

//======== Cors Orgin Request Set ========//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token,authKey, userid");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    next();
});

//========== REST Api's  =============//
app.get('/video', function(req, res) {
  const path = 'video/test.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});