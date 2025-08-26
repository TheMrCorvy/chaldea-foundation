import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { roomHandler } from "./rooms";
import { helloWorld } from "@repo/type-definitions";

console.log(helloWorld);

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello there!");
});

io.on("connection", (socket) => {
    console.log("a user connected");

    roomHandler(socket);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
