import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { RestTracks } from "./routes/restTracks";

dotenv.config();

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors({ origin: "http://localhost:5173", credentials: true }));
const port = Number(process.env.PORT) || 5000;

const BUILD_DIR = path.join(__dirname, "../../frontend/dist");

const indexHtml = path.join(BUILD_DIR, "index.html");
console.log("Looking for frontend at:", BUILD_DIR);
console.log("Index exists:", fs.existsSync(indexHtml));

runServer();

function runServer() {
    loadPaths();

    server.use(express.static(BUILD_DIR));

    server.get("/", (request, response) => {
        response.status(200);
        response.type("html");
        response.sendFile(indexHtml);
    });

    server.get(/.*/, (_req, res) => {
        res.sendFile(path.join(BUILD_DIR, "index.html"));
    });

    server.use((request, response) => {
        response.status(404);
        var message = { message: "resource not found" };
        response.send(JSON.stringify(message));
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function loadPaths() {
    // TODO - make paths for the classes after creating classes and methods
    let restTracks = new RestTracks();
    server.get("/api/tracks", restTracks.getTracks.bind(restTracks));
    server.get("/api/tracks/:id", restTracks.getTrackById.bind(restTracks));
}
