import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { TrackConditionI } from "../interfaces/trackConditionsI";
import { LapsI } from "../interfaces/lapsI";
import { ListingsI } from "../interfaces/listings";

export class RestListings {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    getListingsByTrackId(request: Request, response: Response) {
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

    //  getLapById(request: Request, response: Response) {
    //      response.type("application/json");
    //      let data = request.params["lap_id"];
    //      if (data != undefined) {
    //          this.getById(parseInt(data)).then((laps) => {
    //              response.status(200);
    //              response.send(JSON.stringify(laps));
    //          });
    //      } else {
    //          response.status(400);
    //          let message = { err: "No track_id provided" };
    //          response.send(JSON.stringify(message));
    //      }
    //  }

    async getAllByTrackId(track_id: number): Promise<Array<ListingsI>> {
        let sql = `SELECT
                     u.username                                     AS username,
                     (c.make || ' ' || c.model)                     AS car,
                     cat.name                                       AS category,
                     t.type                                         AS tyre,
                     tc.weather                                     AS weather,
                     tc.track_temperature                           AS trackTemp,
                     printf('%02d:%02d.%03d',
                            l.lap_time_ms/60000,
                            (l.lap_time_ms/1000) % 60,
                            l.lap_time_ms % 1000)                   AS lap_time
                     FROM laps l
                     JOIN users u            ON u.user_id = l.driver_id
                     JOIN cars  c            ON c.car_id  = l.car_id
                     LEFT JOIN categories cat ON cat.category_id = c.category_id
                     LEFT JOIN track_conditions tc ON tc.conditions_id = l.conditions_id
                     LEFT JOIN tires t            ON t.tire_id      = tc.tire_id
                     WHERE l.track_id = ?
                     ORDER BY l.lap_time_ms ASC;`;
        var data = (await this.database.getDataPromise(sql, [track_id])) as Array<ListingsI>;
        let result = new Array<ListingsI>();
        for (let d of data) {
            let l: ListingsI = {
                username: d["username"],
                car: d["car"],
                category: d["category"],
                tyre: d["tyre"],
                weather: d["weather"],
                trackTemp: d["trackTemp"],
                lap_time: d["lap_time"],
            };
            result.push(l);
        }
        return result;
    }

    //  async getById(id: number): Promise<LapsI | null> {
    //      let sql = "SELECT * FROM laps WHERE lap_id=?;";
    //      var data = (await this.database.getDataPromise(sql, [id])) as Array<LapsI>;

    //      if (data.length == 1 && data[0] != undefined) {
    //          let d = data[0];
    //          let l: LapsI = {
    //              lap_id: d["lap_id"],
    //              driver_id: d["driver_id"],
    //              car_id: d["car_id"],
    //              track_id: d["track_id"],
    //              conditions_id: d["conditions_id"],
    //              lap_time_ms: d["lap_time_ms"],
    //              date: d["date"],
    //          };
    //          return l;
    //      }
    //      return null;
    //  }
}
