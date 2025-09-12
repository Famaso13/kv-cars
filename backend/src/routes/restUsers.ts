import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { UserI, UserStatsI } from "../interfaces/usersI";
import { RestLaps } from "./restLaps";
import { RestTracks } from "./restTracks";
import { RestCars } from "./restCars";

export class RestUsers {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";
    private restLaps;
    private restTracks;
    private restCars;

    constructor() {
        this.database = new Database(this.DB_FILE);
        this.restLaps = new RestLaps();
        this.restTracks = new RestTracks();
        this.restCars = new RestCars();
    }

    getAllUsers(request: Request, response: Response) {
        this.getAll().then((users) => {
            response.status(200);
            response.send(JSON.stringify(users));
        });
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

    getUserById(request: Request, response: Response) {
        let user_id = request.params["user_id"];

        if (user_id !== undefined) {
            this.getById(Number(user_id)).then((user) => {
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

    userUpdate(request: Request, response: Response) {
        let userInfo = request.body as UserI;

        this.update(userInfo).then((status) => {
            if (status.inserted === true) {
                response.status(200);
                response.send(JSON.stringify(status));
            } else {
                response.status(400);
                response.send(JSON.stringify(status));
            }
        });
    }

    userUpdateImage(request: Request, response: Response) {
        const driver_id_param = request.params["driver_id"];
        let driver_id = Number(driver_id_param);
        if (!Number.isFinite(driver_id)) {
            response.status(400);
            response.send("Invalid user_id");
        }

        if (!request.file) {
            response.status(400);
            response.send("No file uploaded");
        } else {
            const imageBuffer: Buffer = request.file?.buffer;

            this.updateImage(driver_id, imageBuffer).then((status) => {
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

    getUserImageById(request: Request, response: Response) {
        const driver_id_param = request.params["driver_id"];
        let driver_id = Number(driver_id_param);
        if (!Number.isFinite(driver_id)) {
            response.status(400);
            response.send("Invalid user_id");
        } else {
            this.getImageById(driver_id).then((image) => {
                response.status(200);
                response.send(image);
            });
        }
    }

    formatLapTime(lap_time: number) {
        const minutes = Math.floor(lap_time / 60000);
        const seconds = Math.floor((lap_time % 60000) / 1000);
        const millis = lap_time % 1000;

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(
            3,
            "0"
        )}`;
    }

    async getUserStats(request: Request, response: Response) {
        response.type("application/json");

        let data = request.params["driver_id"];
        if (data != undefined) {
            const lap = await this.restLaps.getFastestByDriverId(Number(data));
            const car = await this.restCars.getMostUsedByDriverId(Number(data));

            if (!lap || !car) {
                response.status(400);
                let message = { err: "Driver doesn't have any laps" };
                response.send(JSON.stringify(message));
            }

            const track = await this.restTracks.getById(lap!.track_id);
            if (!track) {
                response.status(400);
                let message = { err: "Track not found for best lap" };
                response.send(JSON.stringify(message));
            }

            const userStats: UserStatsI = {
                best_lap: this.formatLapTime(lap!.lap_time_ms),
                best_lap_track: track!.name,
                most_used_car: `${car!.make} ${car!.model}`,
            };

            response.status(200);
            response.send(JSON.stringify(userStats));
        } else {
            response.status(400);
            let message = { err: "No driver_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    async getAll() {
        let sql = "SELECT * FROM users ;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<UserI>;
        let result = new Array<UserI>();
        for (let d of data) {
            let u: UserI = {
                user_id: d["user_id"],
                username: d["username"],
                email: d["email"],
                password: d["password"],
                date_created: d["date_created"],
                first_name: d["first_name"],
                last_name: d["last_name"],
                date_of_birth: d["date_of_birth"],
                country: d["country"],
                admin: d["admin"],
            };
            result.push(u);
        }
        return result;
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
                first_name: d["first_name"],
                last_name: d["last_name"],
                date_of_birth: d["date_of_birth"],
                country: d["country"],
                admin: d["admin"],
            };
            return u;
        }
        return null;
    }

    async register(username: string, password: string, email: string) {
        let usernames = await this.getUsernames();
        if (usernames.includes(username)) {
            return { err: "Username already exists!", inserted: false };
        }

        let emails = await this.getEmails();
        if (emails.includes(email)) {
            return { err: "Email already exists!", inserted: false };
        }

        let sql = "INSERT INTO users (username, email, password, admin) VALUES (?,?,?,?);";
        let data = await this.database.insertUpdateRows(sql, [username, email, password, 0]);
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

    async update(user: UserI) {
        let sql = `UPDATE users 
               SET  username = ?,
                  email = ?,
                  password = ?, 
                  date_created = ?, 
                  first_name = ?, 
                  last_name = ?, 
                  date_of_birth = ?, 
                  country = ?
               WHERE user_id = ?`;

        let userData = [
            user.username,
            user.email,
            user.password,
            user.date_created,
            user.first_name,
            user.last_name,
            user.date_of_birth,
            user.country,
            user.user_id,
        ];
        let data = await this.database.insertUpdateRows(sql, userData);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }

    async updateImage(user_id: number, image: Buffer) {
        let sql = `UPDATE users 
               SET  image = ?
               WHERE user_id = ?`;

        let userData = [image, user_id];
        let data = await this.database.insertUpdateRows(sql, userData);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }

    async getById(user_id: number) {
        let sql = "SELECT * FROM users WHERE user_id = ?;";
        var data = (await this.database.getDataPromise(sql, [user_id])) as Array<UserI>;
        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let u: UserI = {
                user_id: d["user_id"],
                username: d["username"],
                email: d["email"],
                password: d["password"],
                date_created: d["date_created"],
                first_name: d["first_name"],
                last_name: d["last_name"],
                date_of_birth: d["date_of_birth"],
                country: d["country"],
                admin: d["admin"],
            };
            return u;
        }
        return null;
    }

    async getImageById(user_id: number) {
        let sql = "SELECT image FROM users WHERE user_id = ?;";
        var data = (await this.database.getDataPromise(sql, [user_id])) as Array<{ image: Buffer | null }>;
        if (data.length == 1 && data[0]?.image) {
            return data[0].image as Buffer;
        }
        return null;
    }
}
