import { Request, Response } from "express";
import { TrackI } from "../interfaces/tracksI";
import Database from "../helpers/sqliteHelper";

export class RestTracks {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    getTracks(request: Request, response: Response) {
        response.type("application/json");
        this.getAll().then((tracks) => {
            response.status(200);
            response.send(JSON.stringify(tracks));
        });
    }

    getTrackById(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["id"];
        if (data != undefined) {
            this.getById(parseInt(data)).then((track) => {
                response.status(200);
                response.send(JSON.stringify(track));
            });
        } else {
            response.status(400);
            let message = { err: "No id provided" };
            response.send(JSON.stringify(message));
        }
    }

    trackUpdateImage(request: Request, response: Response) {
        const track_id_param = request.params["track_id"];
        let track_id = Number(track_id_param);
        if (!Number.isFinite(track_id)) {
            response.status(400);
            response.send("Invalid user_id");
        }

        if (!request.file) {
            response.status(400);
            response.send("No file uploaded");
        } else {
            const imageBuffer: Buffer = request.file?.buffer;

            this.updateImage(track_id, imageBuffer).then((status) => {
                if (status.inserted === true) {
                    response.status(200);
                    response.send(JSON.stringify(status));
                } else {
                    response.status(400);
                    response.send(JSON.stringify(status));
                }
            });
        }
    }

    getTrackImageById(request: Request, response: Response) {
        const track_id_param = request.params["track_id"];
        let track_id = Number(track_id_param);
        if (!Number.isFinite(track_id)) {
            response.status(400);
            response.send("Invalid user_id");
        } else {
            this.getImageById(track_id).then((image) => {
                response.status(200);
                response.send(image);
            });
        }
    }

    async getAll(): Promise<Array<TrackI>> {
        let sql = "SELECT * FROM tracks;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<TrackI>;
        let result = new Array<TrackI>();
        for (let d of data) {
            let t: TrackI = {
                track_id: d["track_id"],
                name: d["name"],
                location: d["location"],
                length_km: d["length_km"],
                famous_corner: d["famous_corner"],
            };
            result.push(t);
        }
        return result;
    }

    async getById(id: number): Promise<TrackI | null> {
        let sql = "SELECT * FROM tracks WHERE track_id=?;";
        var data = (await this.database.getDataPromise(sql, [id])) as Array<TrackI>;

        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let t: TrackI = {
                track_id: d["track_id"],
                name: d["name"],
                location: d["location"],
                length_km: d["length_km"],
                famous_corner: d["famous_corner"],
            };
            return t;
        }

        return null;
    }

    async updateImage(track_id: number, image: Buffer) {
        let sql = `UPDATE tracks 
               SET  image = ?
               WHERE track_id = ?`;

        let userData = [image, track_id];
        let data = await this.database.insertUpdateRows(sql, userData);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }

    async getImageById(track_id: number) {
        let sql = "SELECT image FROM tracks WHERE track_id = ?;";
        var data = (await this.database.getDataPromise(sql, [track_id])) as Array<{ image: Buffer | null }>;
        if (data.length == 1 && data[0]?.image) {
            return data[0].image as Buffer;
        }
        return null;
    }
}
