import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { CarsListingsI, ListingsI, ProfileListingsI } from "../interfaces/listings";

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
            this.getAllByTrackId(parseInt(track_id), categoryIdNum, carIdNum, tireIdNum, weatherStr, dateStr).then(
                (laps) => {
                    response.status(200);
                    response.send(JSON.stringify(laps));
                }
            );
        } else {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getListingsByDriverId(request: Request, response: Response) {
        response.type("application/json");
        let driver_id = request.params["driver_id"];
        if (driver_id != undefined) {
            this.getAllByDriverId(parseInt(driver_id)).then((listings) => {
                response.status(200);
                response.send(JSON.stringify(listings));
            });
        } else {
            response.status(400);
            let message = { err: "No driver_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getListingsByCarId(request: Request, response: Response) {
        response.type("application/json");
        let car_id = request.params["car_id"];
        if (car_id != undefined) {
            this.getAllByCarId(parseInt(car_id)).then((listings) => {
                response.status(200);
                response.send(JSON.stringify(listings));
            });
        } else {
            response.status(400);
            let message = { err: "No car_id provided" };
            response.send(JSON.stringify(message));
        }
    }

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
    w.weather AS weather,  
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
LEFT JOIN weathers w           ON w.weathers_id  = tc.weather_id  
WHERE l.track_id = ?
  AND (? = -1 OR c.category_id = ?)
  AND (? = -1 OR c.car_id      = ?)
  AND (? = -1 OR t.tire_id     = ?)
  AND (? = '' OR w.weather     = ?)  
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

    async getAllByDriverId(driver_id: number): Promise<ProfileListingsI[]> {
        const sql = `
   SELECT
    tr.name AS track,
    (c.make || ' ' || c.model) AS car,
    cat.name AS category,
    t.type AS tyre,
    w.weather AS weather,   
    tc.track_temperature AS trackTemp,
    printf('%02d:%02d.%03d',
      l.lap_time_ms/60000,
      (l.lap_time_ms/1000) % 60,
      l.lap_time_ms % 1000) AS lap_time
FROM laps l
JOIN tracks tr              ON tr.track_id = l.track_id
JOIN cars   c               ON c.car_id    = l.car_id
LEFT JOIN categories   cat  ON cat.category_id = c.category_id
LEFT JOIN track_conditions tc ON tc.conditions_id = l.conditions_id
LEFT JOIN tires t              ON t.tire_id      = tc.tire_id
LEFT JOIN weathers w           ON w.weathers_id  = tc.weather_id   
WHERE l.driver_id = ?
ORDER BY l.lap_time_ms ASC;
  `;

        const data = (await this.database.getDataPromise(sql, [driver_id])) as Array<any>;

        return data.map((d) => ({
            track: d["track"],
            car: d["car"],
            category: d["category"],
            tyre: d["tyre"],
            weather: d["weather"],
            trackTemp: d["trackTemp"],
            lap_time: d["lap_time"],
        }));
    }

    async getAllByCarId(car_id: number): Promise<CarsListingsI[]> {
        const sql = `
                     SELECT
    tr.name AS track,
    u.username AS username,
    cat.name AS category,
    t.type AS tyre,
    w.weather AS weather,   
    tc.track_temperature AS trackTemp,
    printf('%02d:%02d.%03d',
      l.lap_time_ms/60000,
      (l.lap_time_ms/1000) % 60,
      l.lap_time_ms % 1000) AS lap_time
FROM laps l
JOIN tracks tr              ON tr.track_id = l.track_id
JOIN users  u               ON u.user_id   = l.driver_id
JOIN cars   c               ON c.car_id    = l.car_id
LEFT JOIN categories   cat  ON cat.category_id = c.category_id
LEFT JOIN track_conditions tc ON tc.conditions_id = l.conditions_id
LEFT JOIN tires t              ON t.tire_id      = tc.tire_id
LEFT JOIN weathers w           ON w.weathers_id  = tc.weather_id   
WHERE l.car_id = ?
ORDER BY l.lap_time_ms ASC;
                  `;

        const data = (await this.database.getDataPromise(sql, [car_id])) as Array<CarsListingsI>;

        return data.map((d) => ({
            track: d["track"],
            username: d["username"],
            category: d["category"],
            tyre: d["tyre"],
            weather: d["weather"],
            trackTemp: d["trackTemp"],
            lap_time: d["lap_time"],
        }));
    }
}
