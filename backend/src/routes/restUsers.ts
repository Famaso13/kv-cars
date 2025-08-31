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
    userRegister(request: Request, response: Response) {
        let userInfo = request.body as { username: string; password: string; email: string };
        let username = userInfo.username;
        let password = userInfo.password;
        let email = userInfo.email;

        if (
            username != undefined &&
            password != undefined &&
            email != undefined &&
            typeof username == "string" &&
            typeof password == "string" &&
            typeof email == "string"
        ) {
            this.register(username, password, email).then((status) => {
                if (status.inserted === true) {
                    response.status(200);
                    response.send(JSON.stringify(status));
                } else {
                    response.status(400);
                    response.send(JSON.stringify(status));
                }
            });
        } else {
            response.status(400);
            let message = { err: "No username or password provided", inserted: false };
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

    async register(username: string, password: string, email: string) {
        // username check

        let usernames = await this.getUsernames();
        if (usernames.includes(username)) {
            return { err: "Username already exists!", inserted: false };
        }
        //   email check
        let emails = await this.getEmails();
        if (emails.includes(email)) {
            return { err: "Email already exists!", inserted: false };
        }

        let sql = "INSERT INTO users (username, email, password) VALUES (?,?,?);";
        let data = await this.database.insertUpdateRows(sql, [username, email, password]);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }

    async getUsernames() {
        let sql = "SELECT username FROM users;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<{ username: string }>;
        let usernames = new Array<string>();
        for (let d of data) {
            usernames.push(d.username);
        }
        return usernames;
    }

    async getEmails() {
        let sql = "SELECT email FROM users;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<{ email: string }>;
        let emails = new Array<string>();
        for (let d of data) {
            emails.push(d.email);
        }
        return emails;
    }
}
