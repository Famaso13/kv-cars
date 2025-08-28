import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { TrackConditionI } from "../interfaces/trackConditionsI";

export class RestTrackConditions {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    getConditionsByTrackId(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["track_id"];
        if (data != undefined) {
            this.getAllByTrackId(parseInt(data)).then((track_condition) => {
                response.status(200);
                response.send(JSON.stringify(track_condition));
            });
        } else {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getConditionById(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["condition_id"];
        if (data != undefined) {
            this.getById(parseInt(data)).then((track_condition) => {
                response.status(200);
                response.send(JSON.stringify(track_condition));
            });
        } else {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    async getAllByTrackId(track_id: number): Promise<Array<TrackConditionI>> {
        let sql = "SELECT * FROM track_conditions WHERE track_id=?;";
        var data = (await this.database.getDataPromise(sql, [track_id])) as Array<TrackConditionI>;
        let result = new Array<TrackConditionI>();
        for (let d of data) {
            let tc: TrackConditionI = {
                conditions_id: d["conditions_id"],
                track_id: d["track_id"],
                time: d["time"],
                weather: d["weather"],
                track_temperature: d["track_temperature"],
                tire_id: d["tire_id"],
            };
            result.push(tc);
        }
        return result;
    }

    async getById(id: number): Promise<TrackConditionI | null> {
        let sql = "SELECT * FROM track_conditions WHERE conditions_id=?;";
        var data = (await this.database.getDataPromise(sql, [id])) as Array<TrackConditionI>;

        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let tc: TrackConditionI = {
                conditions_id: d["conditions_id"],
                track_id: d["track_id"],
                time: d["time"],
                weather: d["weather"],
                track_temperature: d["track_temperature"],
                tire_id: d["tire_id"],
            };
            return tc;
        }

        return null;
    }
}
