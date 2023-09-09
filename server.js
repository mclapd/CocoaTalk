import express from "express";
import http from "http";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import moment from "moment";
import { MongoClient } from "mongodb";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = new MongoClient("mongodb://127.0.0.1:27017/");
const database = client.db("cocoaTalkDB");
const cocoatalks = database.collection("cocoatalks");

async function SaveTalk(name, message, timeInfo) {
  try {
    console.log(message);
    // const database = client.db("cocoaTalkDB");
    // const cocoatalks = database.collection("cocoatalks");

    const newTalk = {
      name: name,
      message: message,
      time: timeInfo,
    };

    const options = { ordered: true };

    const result = await cocoatalks.insertOne(newTalk, options);

    console.log("document is inserted successfully");
  } catch (error) {
    console.log(error);
  }
}

io.on("connection", (socket) => {
  socket.on("chat", (data) => {
    const timeInfo = moment(new Date()).format("h:ss A");
    const { name, message } = data;
    io.emit("chat", {
      name,
      message,
      time: timeInfo,
    });

    console.log(name);
    SaveTalk(name, message, timeInfo);
  });
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

server.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

process.on("exit", (code) => {
  client.close();
  console.log(`Server stopped: ${code}`);
});
