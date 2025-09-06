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
        let data = request.params["league-id"];
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
}
