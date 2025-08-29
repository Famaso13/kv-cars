import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { TrackConditionI } from "../interfaces/trackConditionsI";
import { LapsI } from "../interfaces/lapsI";

export class RestLaps {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    getLapsByTrackId(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["track_id"];
        if (data != undefined) {
            this.getAllByTrackId(parseInt(data)).then((laps) => {
                response.status(200);
                console.log(laps);
                response.send(JSON.stringify(laps));
            });
        } else {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getLapById(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["lap_id"];
        if (data != undefined) {
            this.getById(parseInt(data)).then((laps) => {
                response.status(200);
                response.send(JSON.stringify(laps));
            });
        } else {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    async getAllByTrackId(track_id: number): Promise<Array<LapsI>> {
        let sql = "SELECT * FROM laps WHERE track_id=?;";
        var data = (await this.database.getDataPromise(sql, [track_id])) as Array<LapsI>;
        let result = new Array<LapsI>();
        for (let d of data) {
            let l: LapsI = {
                lap_id: d["lap_id"],
                driver_id: d["driver_id"],
                car_id: d["car_id"],
                track_id: d["track_id"],
                conditions_id: d["conditions_id"],
                lap_time_ms: d["lap_time_ms"],
                date: d["date"],
            };
            result.push(l);
        }
        return result;
    }

    async getById(id: number): Promise<LapsI | null> {
        let sql = "SELECT * FROM laps WHERE lap_id=?;";
        var data = (await this.database.getDataPromise(sql, [id])) as Array<LapsI>;

        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let l: LapsI = {
                lap_id: d["lap_id"],
                driver_id: d["driver_id"],
                car_id: d["car_id"],
                track_id: d["track_id"],
                conditions_id: d["conditions_id"],
                lap_time_ms: d["lap_time_ms"],
                date: d["date"],
            };
            return l;
        }
        return null;
    }
}
