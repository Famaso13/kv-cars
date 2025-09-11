import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { RestTracks } from "./routes/restTracks";
import { RestTrackConditions } from "./routes/restTrackConditions";
import { RestLaps } from "./routes/restLaps";
import { RestListings } from "./routes/restListings";
import { RestFilters } from "./routes/restFilters";
import { RestUsers } from "./routes/restUsers";
import { RestCars } from "./routes/restCars";
import { uploadImage } from "./helpers/fileUploadHelper";
import { RestLeagues } from "./routes/restLeagues";

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
    let restTracks = new RestTracks();
    server.get("/api/tracks", restTracks.getTracks.bind(restTracks));
    server.get("/api/tracks/:id", restTracks.getTrackById.bind(restTracks));
    server.put("/api/tracks/track/:track_id/image", uploadImage, restTracks.trackUpdateImage.bind(restTracks));
    server.get("/api/tracks/:track_id/image", restTracks.getTrackImageById.bind(restTracks));
    server.post("/api/track", restTracks.insertTrack.bind(restTracks));

    let restTrackConditions = new RestTrackConditions();
    server.get("/api/conditions/:track_id", restTrackConditions.getConditionsByTrackId.bind(restTrackConditions));
    server.get("/api/condition/:condition_id", restTrackConditions.getConditionById.bind(restTrackConditions));

    let restLaps = new RestLaps();
    server.get("/api/laps/:track_id", restLaps.getLapsByTrackId.bind(restLaps));
    server.get("/api/lap/:lap_id", restLaps.getLapByTrackId.bind(restLaps));
    server.get("/api/laps/driver/:driver_id", restLaps.getLapsByDriverId.bind(restLaps));
    server.get("/api/lap/driver/:driver_id", restLaps.getFastestLapByDriverId.bind(restLaps));
    server.post("/api/lap", restLaps.submitLap.bind(restLaps));

    let restListings = new RestListings();
    server.get("/api/listings/:track_id", restListings.getListingsByTrackId.bind(restListings));
    server.get("/api/listings/driver/:driver_id", restListings.getListingsByDriverId.bind(restListings));
    server.get("/api/listings/car/:car_id", restListings.getListingsByCarId.bind(restListings));
    server.get("/api/listings/:league_id/:track_id", restListings.getListingsByTrackIdAndLeagueId.bind(restListings));

    let restFilters = new RestFilters();
    server.get("/api/filters/categories", restFilters.getAllCategories.bind(restFilters));
    server.get("/api/filters/cars/:category_id", restFilters.getAllCars.bind(restFilters));
    server.get("/api/filters/tires/:car_id", restFilters.getAllTiresByCarId.bind(restFilters));
    server.get("/api/filters/tires", restFilters.getAllTires.bind(restFilters));

    server.get("/api/filters/weather", restFilters.getAllWeather.bind(restFilters));

    let restUsers = new RestUsers();
    server.get("/api/users/", restUsers.getAllUsers.bind(restUsers));
    server.get("/api/user/login", restUsers.userLogin.bind(restUsers));
    server.get("/api/user/:user_id", restUsers.getUserById.bind(restUsers));
    server.get("/api/user/stats/:driver_id", restUsers.getUserStats.bind(restUsers));
    server.post("/api/user/register", restUsers.userRegister.bind(restUsers));
    server.put("/api/user/update", restUsers.userUpdate.bind(restUsers));
    server.get("/api/user/:driver_id/image", restUsers.getUserImageById.bind(restUsers));
    server.put("/api/users/user/:driver_id/image", uploadImage, restUsers.userUpdateImage.bind(restUsers));

    let restCars = new RestCars();
    server.get("/api/cars", restCars.getAllCars.bind(restCars));
    server.get("/api/car/:car_id", restCars.getCarById.bind(restCars));
    server.post("/api/car", restCars.insertCar.bind(restCars));
    server.put("/api/cars/car/:car_id/image", uploadImage, restCars.carUpdateImage.bind(restCars));
    server.get("/api/cars/:car_id/image", restCars.getCarImageById.bind(restCars));
    server.post("/api/cars/:car_id/:tire_id", restCars.insertCarTires.bind(restCars));
    server.get("/api/tires/:car_id/image", restCars.getCarImageById.bind(restCars));

    let restLeagues = new RestLeagues();
    server.get("/api/leagues", restLeagues.getLeagues.bind(restLeagues));
    server.get("/api/leagues/drivers/:league_id", restLeagues.getAllLeagueParticipants.bind(restLeagues));
    server.post("/api/leagues", restLeagues.createLeague.bind(restLeagues));
    server.post("/api/leagues/:league_id/driver", restLeagues.addLeagueParticipant.bind(restLeagues));
    server.delete("/api/leagues/:league_id/driver", restLeagues.removeLeagueParticipant.bind(restLeagues));
    server.get("/api/leagues/:league_id", restLeagues.getLeagueById.bind(restLeagues));
}
