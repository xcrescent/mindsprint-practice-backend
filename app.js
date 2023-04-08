const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

__dirname = path.resolve();   
app.use(express.json());   
app.use("/public",express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "editor")));
app.use("/node_modules",express.static(path.join(__dirname, "node_modules")));
// Serve the index.html file
app.set("view engine", "ejs");
app.get("/", (req, res) => { 
  res.sendFile(__dirname + "/editor/index.html");
});
  
// Serve the index.html file 
app.get('/editor', function (req, res) {
  res.sendFile(path.join(__dirname, 'editor/index.html'));
}); 

app.get('/level1', function (req, res) {
  res.render('pages/level1');
});
function copyAllFiles(sourceFolder, destinationFolder) {
  // Create destination folder
  try {
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder);
    }
  } catch (err) {
    console.error(err);
  }
  const isFile = (fileName) => {
    console.log(fileName);
    console.log(path.join(sourceFolder, fileName));
    return fs.lstatSync(path.join(sourceFolder, fileName)).isFile();
  };
  const isFolder = (fileName) => {
    console.log(fileName);
    console.log(path.join(sourceFolder, fileName));
    return !fs.lstatSync(path.join(sourceFolder, fileName)).isFile();
  };

  // Copy files from source folder to destination folder
  fileObjs = fs.readdirSync(sourceFolder, { withFileTypes: true });
  // filter out folders that
  fileObjsFolders = fileObjs
    .map((fileName) => {
      console.log(fileName.name);
      return fileName.name;
    })
    .filter(isFolder);
  // console.log(fileObjs);
  fileObjsFiles = fileObjs
    .map((fileName) => {
      console.log(fileName.name);
      return fileName.name;
    })
    .filter(isFile);
  console.log(fileObjsFolders);
  fileObjsFiles.forEach((file) => {
    const sourcePath = path.join(sourceFolder, file);
    const destinationPath = destinationFolder + "/" + file;
    console.log(sourcePath, destinationPath);
    fs.copyFileSync(sourcePath, destinationPath);
  });
  fileObjsFolders.forEach((folder) => {
    copyAllFiles(
      path.join(sourceFolder, folder),
      path.join(destinationFolder, folder)
    ); 
  });
  console.log(`Files copied from ${sourceFolder} to ${destinationFolder}`);
}
app.post("/setup", (req, res) => {
  const username = req.body.username;
  const sourceFolder = __dirname + "/public/default";
  const destinationFolder = __dirname + `/public/${username}`;
  copyAllFiles(sourceFolder, destinationFolder);
});

// Listen for a connection event from the client
io.on("connection", (socket) => {
  console.log("User connected");
  // Listen for a file request event from the client
  socket.on("request-file", (filename) => {
    console.log(`File ${filename} requested`);
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        socket.emit("file-error", err.message);
      } else {
        socket.emit("file-content", data);
      }
    });
  });

  // Listen for a file save event from the client
  socket.on("save-file", (data) => {
    console.log(`File ${data.filename} saved`);
    fs.writeFile(data.filename, data.content, "utf8", (err) => {
      if (err) {
        console.error(err);
        socket.emit("file-error", err.message);
      } else {
        socket.emit("file-saved");
      }
    });
  });

  // Listen for a disconnection event from the client
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
