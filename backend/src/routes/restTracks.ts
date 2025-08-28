import { Request, Response } from "express";
import { TrackI } from "../interfaces/tracksI";
import Database from "../helpers/sqliteHelper";
import dotenv from "dotenv";

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
}
