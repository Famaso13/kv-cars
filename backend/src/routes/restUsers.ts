import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { CarFilterI, CategoryFilterI, TireFilterI, WeatherFilterI } from "../interfaces/filtersI";
import { UserI } from "../interfaces/usersI";

export class RestUsers {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    userLogin(request: Request, response: Response) {
        let username = request.query["username"];
        let password = request.query["pass"];

        if (
            username != undefined &&
            password != undefined &&
            typeof username == "string" &&
            typeof password == "string"
        ) {
            this.login(username, password).then((user) => {
                response.status(200);
                response.send(JSON.stringify(user));
            });
        } else {
            response.status(400);
            let message = { err: "No username or password provided" };
            response.send(JSON.stringify(message));
        }
    }

    async login(username: string, password: string) {
        let sql = "SELECT * FROM users WHERE username = ? AND password = ?;";
        var data = (await this.database.getDataPromise(sql, [username, password])) as Array<UserI>;
        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let u: UserI = {
                user_id: d["user_id"],
                username: d["username"],
                email: d["email"],
                password: d["password"],
                date_created: d["date_created"],
            };
            return u;
        }
        return null;
    }

    async getWeather(track_id: number): Promise<Array<WeatherFilterI>> {
        let sql = "SELECT DISTINCT weather FROM track_conditions WHERE track_id = ? ORDER BY weather;";
        var data = (await this.database.getDataPromise(sql, [track_id])) as Array<WeatherFilterI>;
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
