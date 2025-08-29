import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { ListingsI } from "../interfaces/listings";

export class RestListings {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }
    toNumOrNull = (v: unknown): number | null => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    getListingsByTrackId(request: Request, response: Response) {
        response.type("application/json");
        let track_id = request.params["track_id"];
        const categoryIdNum = this.toNumOrNull(request.query["category_id"]);
        const carIdNum = this.toNumOrNull(request.query["car_id"]);
        const tireIdNum = this.toNumOrNull(request.query["tire_id"]);
        const weatherStr =
            typeof request.query["weather"] === "string" && request.query["weather"] !== ""
                ? String(request.query["weather"])
                : null;
        const dateStr =
            typeof request.query["date"] === "string" && request.query["date"] !== ""
                ? String(request.query["date"])
                : null;
        if (track_id != undefined) {
            // const categoryIdNum =
            //     category_id !== undefined && category_id !== "" ? parseInt(category_id as string) : null;
            // const carIdNum = car_id !== undefined && car_id !== "" ? parseInt(car_id as string) : null;
            // const tireIdNum = tire_id !== undefined && tire_id !== "" ? parseInt(tire_id as string) : null;
            // const weatherStr = typeof weather === "string" && weather !== "" ? weather : null;
            // const dateStr = typeof date === "string" && date !== "" ? date : null;
            this.getAllByTrackId(parseInt(track_id), categoryIdNum, carIdNum, tireIdNum, weatherStr, dateStr).then(
                (laps) => {
                    response.status(200);
                    console.log(laps);
                    response.send(JSON.stringify(laps));
                }
            );
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

    async getAllByTrackId(
        track_id: number,
        category_id: number | null,
        car_id: number | null,
        tire_id: number | null,
        weather: string | null,
        date: string | null
    ): Promise<Array<ListingsI>> {
        const sql = `
    SELECT
      u.username AS username,
      (c.make || ' ' || c.model) AS car,
      cat.name AS category,
      t.type AS tyre,
      tc.weather AS weather,
      tc.track_temperature AS trackTemp,
      printf('%02d:%02d.%03d',
        l.lap_time_ms/60000,
        (l.lap_time_ms/1000) % 60,
        l.lap_time_ms % 1000) AS lap_time
    FROM laps l
    JOIN users u              ON u.user_id = l.driver_id
    JOIN cars  c              ON c.car_id  = l.car_id
    LEFT JOIN categories cat  ON cat.category_id = c.category_id
    LEFT JOIN track_conditions tc ON tc.conditions_id = l.conditions_id
    LEFT JOIN tires t              ON t.tire_id      = tc.tire_id
    WHERE l.track_id = ?
      AND (? = -1 OR c.category_id = ?)
      AND (? = -1 OR c.car_id      = ?)
      AND (? = -1 OR t.tire_id     = ?)
      AND (? = '' OR tc.weather    = ?)
      AND (? = '' OR date(l.date)  = date(?))
    ORDER BY l.lap_time_ms ASC;
  `;

        const params = [
            track_id,
            category_id ?? -1,
            category_id ?? -1,
            car_id ?? -1,
            car_id ?? -1,
            tire_id ?? -1,
            tire_id ?? -1,
            weather ?? "",
            weather ?? "",
            date ?? "",
            date ?? "",
        ];

        console.log(params);

        const data = (await this.database.getDataPromise(sql, params)) as Array<ListingsI>;
        return data.map((d) => ({
            username: d["username"],
            car: d["car"],
            category: d["category"],
            tyre: d["tyre"],
            weather: d["weather"],
            trackTemp: d["trackTemp"],
            lap_time: d["lap_time"],
        }));
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
