import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { LapsI } from "../interfaces/lapsI";
import { CarsI } from "../interfaces/carsI";

export class RestCars {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    getMostUsedCarByDriverId(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["driver_id"];
        if (data != undefined) {
            this.getMostUsedByDriverId(parseInt(data)).then((car) => {
                response.status(200);
                response.send(JSON.stringify(car));
            });
        } else {
            response.status(400);
            let message = { err: "No driver_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    async getMostUsedByDriverId(driver_id: number): Promise<CarsI | null> {
        let sql = `
                  SELECT c.car_id, c.model, c.make, c.category_id, c.horsepower, c.mass
                  FROM laps l
                  JOIN cars c ON l.car_id = c.car_id
                  WHERE l.driver_id = ?
                  GROUP BY c.car_id
                  ORDER BY COUNT(*) DESC
                  LIMIT 1;
                  `;
        var data = (await this.database.getDataPromise(sql, [driver_id])) as Array<CarsI>;

        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let c: CarsI = {
                car_id: d["car_id"],
                model: d["model"],
                make: d["make"],
                category_id: d["category_id"],
                horsepower: d["horsepower"],
                mass: d["mass"],
            };
            return c;
        }
        return null;
    }
}
