import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
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

    getAllCars(request: Request, response: Response) {
        response.type("application/json");
        this.getAll().then((cars) => {
            response.status(200);
            response.send(JSON.stringify(cars));
        });
    }

    getCarById(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["car_id"];
        if (data != undefined) {
            this.getById(parseInt(data)).then((car) => {
                response.status(200);
                response.send(JSON.stringify(car));
            });
        } else {
            response.status(400);
            let message = { err: "No car_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    carUpdateImage(request: Request, response: Response) {
        const car_id_param = request.params["car_id"];
        let car_id = Number(car_id_param);
        if (!Number.isFinite(car_id)) {
            response.status(400);
            response.send("Invalid user_id");
        }

        if (!request.file) {
            response.status(400);
            response.send("No file uploaded");
        } else {
            const imageBuffer: Buffer = request.file?.buffer;

            this.updateImage(car_id, imageBuffer).then((status) => {
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

    getCarImageById(request: Request, response: Response) {
        const car_id_param = request.params["car_id"];
        let car_id = Number(car_id_param);

        if (!Number.isFinite(car_id)) {
            response.status(400);
            response.send("Invalid user_id");
        } else {
            this.getImageById(car_id).then((image) => {
                response.status(200);
                response.send(image);
            });
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

    async getAll(): Promise<Array<CarsI>> {
        let sql = "SELECT * FROM cars;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<CarsI>;
        let result = new Array<CarsI>();
        for (let d of data) {
            let c: CarsI = {
                car_id: d["car_id"],
                category_id: d["category_id"],
                horsepower: d["horsepower"],
                make: d["make"],
                mass: d["mass"],
                model: d["model"],
            };
            result.push(c);
        }
        return result;
    }

    async getById(car_id: number): Promise<CarsI | null> {
        let sql = "SELECT * FROM cars WHERE car_id = ?;";
        var data = (await this.database.getDataPromise(sql, [car_id])) as Array<CarsI>;
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

    async updateImage(user_id: number, image: Buffer) {
        let sql = `UPDATE cars 
               SET  image = ?
               WHERE car_id = ?`;

        let userData = [image, user_id];
        let data = await this.database.insertUpdateRows(sql, userData);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }

    async getImageById(car_id: number) {
        let sql = "SELECT image FROM cars WHERE car_id = ?;";
        var data = (await this.database.getDataPromise(sql, [car_id])) as Array<{ image: Buffer | null }>;
        if (data.length == 1 && data[0]?.image) {
            return data[0].image as Buffer;
        }
        return null;
    }
}
