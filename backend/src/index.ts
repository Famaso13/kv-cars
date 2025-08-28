import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

    //  server.get("/", (request, response) => {
    //      response.status(200);
    //      response.type("html");
    //      console.log(__dirname() + "../../frontend/dist/index.html");
    //      response.sendFile(__dirname() + "../../frontend/dist/index.html");
    //  });

    server.get("/", (request, response) => {
        response.status(200);
        response.type("html");
        response.sendFile(indexHtml);
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
}

// function __dirname(): string {
//     return dirname(fileURLToPath(getCallerFile()));
// }

// function getCallerFile(): string {
//     const originalFunc = Error.prepareStackTrace;
//     Error.prepareStackTrace = (err: Error, stackTraces: NodeJS.CallSite[]) => stackTraces;
//     const err = new Error();
//     const stack = err.stack as unknown as NodeJS.CallSite[];
//     Error.prepareStackTrace = originalFunc;

//     let callerFile = null;
//     if (stack[2] != undefined) {
//         callerFile = stack[2].getFileName();
//     }
//     if (!callerFile) {
//         throw new Error("Nije moguće utvrditi naziv datoteke koja poziva funkciju");
//     }

//     return callerFile;
// }
