import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { TrackConditionI } from "../interfaces/trackConditionsI";
import { LapsI } from "../interfaces/lapsI";
import { CarFilterI, CategoryFilterI, TireFilterI, WeatherFilterI } from "../interfaces/filtersI";

export class RestFilters {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    getAllCategories(request: Request, response: Response) {
        response.type("application/json");
        this.getCategories().then((categories) => {
            response.status(200);
            response.send(JSON.stringify(categories));
        });
    }

    getAllCars(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["category_id"];
        if (data != undefined) {
            this.getCars(parseInt(data)).then((cars) => {
                response.status(200);
                console.log(cars);
                response.send(JSON.stringify(cars));
            });
        } else {
            response.status(400);
            let message = { err: "No category_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getAllTires(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["car_id"];
        if (data != undefined) {
            this.getTires(parseInt(data)).then((tires) => {
                response.status(200);
                console.log(tires);
                response.send(JSON.stringify(tires));
            });
        } else {
            response.status(400);
            let message = { err: "No car_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getAllWeather(request: Request, response: Response) {
        response.type("application/json");
        this.getWeather().then((weather) => {
            response.status(200);
            console.log(weather);
            response.send(JSON.stringify(weather));
        });
    }

    async getCategories(): Promise<Array<CategoryFilterI>> {
        let sql = "SELECT category_id, name FROM categories ORDER BY name;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<CategoryFilterI>;
        let result = new Array<CategoryFilterI>();
        for (let d of data) {
            let cf: CategoryFilterI = {
                category_id: d["category_id"],
                name: d["name"],
            };
            result.push(cf);
        }
        return result;
    }

    async getCars(category_id: number): Promise<Array<CarFilterI>> {
        let sql = "SELECT car_id, (make || ' ' || model) AS car FROM cars WHERE category_id = ? ORDER BY make, model;";
        var data = (await this.database.getDataPromise(sql, [category_id])) as Array<CarFilterI>;
        let result = new Array<CarFilterI>();
        for (let d of data) {
            let cf: CarFilterI = {
                car_id: d["car_id"],
                car: d["car"],
            };
            result.push(cf);
        }
        return result;
    }

    async getTires(car_id: number): Promise<Array<TireFilterI>> {
        let sql =
            "SELECT t.tire_id, t.type FROM accepts a JOIN tires t ON t.tire_id = a.tire_id WHERE a.car_id = ? ORDER BY t.type;";
        var data = (await this.database.getDataPromise(sql, [car_id])) as Array<TireFilterI>;
        let result = new Array<TireFilterI>();
        for (let d of data) {
            let tf: TireFilterI = {
                tire_id: d["tire_id"],
                type: d["type"],
            };
            result.push(tf);
        }
        return result;
    }

    async getWeather(): Promise<Array<WeatherFilterI>> {
        let sql = "SELECT DISTINCT weather FROM weathers ORDER BY weathers_id;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<WeatherFilterI>;
        let result = new Array<WeatherFilterI>();
        for (let d of data) {
            let wf: WeatherFilterI = {
                weather: d["weather"],
            };
            result.push(wf);
        }
        return result;
    }
}
