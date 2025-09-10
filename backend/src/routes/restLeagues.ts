import { Request, Response } from "express";
import { TrackI } from "../interfaces/tracksI";
import Database from "../helpers/sqliteHelper";
import { LeaguesI } from "../interfaces/leaguesI";

export class RestLeagues {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    constructor() {
        this.database = new Database(this.DB_FILE);
    }

    getLeagues(request: Request, response: Response) {
        response.type("application/json");
        this.getAll().then((leagues) => {
            response.status(200);
            response.send(JSON.stringify(leagues));
        });
    }

    getLeagueById(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["league_id"];
        if (data != undefined) {
            this.getById(parseInt(data)).then((league) => {
                response.status(200);
                response.send(JSON.stringify(league));
            });
        } else {
            response.status(400);
            let message = { err: "No league_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    createLeague(request: Request, response: Response) {
        let league = request.body as LeaguesI;

        if (league !== undefined) {
            this.create(league).then((status) => {
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

    getAllLeagueParticipants(request: Request, response: Response) {
        let league = request.params["league_id"];

        if (league !== undefined) {
            response.type("application/json");
            this.getParticipants(Number(league)).then((drivers) => {
                response.status(200);
                response.send(JSON.stringify(drivers));
            });
        } else {
            response.status(400);
            let message = { err: "No league_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    addLeagueParticipant(request: Request, response: Response) {
        let league = request.params["league_id"];
        const userLeague = request.body as { user_id: number };
        const user = Number(userLeague.user_id);

        if (league !== undefined) {
            this.addUser(user, Number(league)).then((status) => {
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

    removeLeagueParticipant(request: Request, response: Response) {
        let league = request.params["league_id"];
        const userLeague = request.body as { user_id: number };
        const user = Number(userLeague.user_id);

        if (league !== undefined) {
            this.removeUser(user, Number(league)).then((status) => {
                if (status.removed === true) {
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

    async getAll(): Promise<Array<LeaguesI>> {
        let sql = "SELECT * FROM leagues;";
        var data = (await this.database.getDataPromise(sql, [])) as Array<LeaguesI>;
        let result = new Array<LeaguesI>();
        for (let d of data) {
            let l: LeaguesI = {
                league_id: d["league_id"],
                name: d["name"],
                owner_id: d["owner_id"],
                private: d["private"],
                description: d["description"],
            };
            result.push(l);
        }
        return result;
    }

    async getParticipants(league_id: number): Promise<Array<{ driver_id: number }>> {
        let sql = "SELECT driver_id FROM competes WHERE league_id = ?;";
        var data = (await this.database.getDataPromise(sql, [league_id])) as Array<{ driver_id: number }>;
        return data;
    }

    async getById(league_id: number): Promise<LeaguesI | null> {
        let sql = "SELECT * FROM leagues WHERE league_id=?;";
        var data = (await this.database.getDataPromise(sql, [league_id])) as Array<LeaguesI>;

        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let l: LeaguesI = {
                league_id: d["league_id"],
                name: d["name"],
                owner_id: d["owner_id"],
                private: d["private"],
                description: d["description"],
            };
            return l;
        }

        return null;
    }

    async create(league: LeaguesI) {
        let sql = "INSERT INTO leagues (name, description, private, owner_id) VALUES (?,?,?,?);";
        const leagueInsert = [
            league.name ?? null,
            league.description ?? null,
            Number(league.private),
            league.owner_id ?? null,
        ];
        let data = await this.database.insertUpdateRows(sql, leagueInsert);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }

    async addUser(user_id: number, league_id: number) {
        let sql = "INSERT INTO competes (driver_id, league_id) VALUES (?,?);";
        let data = await this.database.insertUpdateRows(sql, [user_id, league_id]);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }

    async removeUser(user_id: number, league_id: number) {
        let sql = "DELETE FROM competes WHERE driver_id = ? AND league_id = ?;";
        let data = await this.database.insertUpdateRows(sql, [user_id, league_id]);
        if (data.error === null) return { err: "", removed: true };
        else return { err: "Error during row deletion. Please try again.", removed: false };
    }
}
