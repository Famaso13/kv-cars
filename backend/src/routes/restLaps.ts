import { Request, Response } from "express";
import Database from "../helpers/sqliteHelper";
import { LapsI } from "../interfaces/lapsI";
import { TrackConditionI } from "../interfaces/trackConditionsI";
import { RestTrackConditions } from "./restTrackConditions";

export class RestLaps {
    private database: Database;
    private DB_FILE = process.env.DB_FILE ?? "data/db/racingdb.sqlite";

    private restTrackConditions;

    constructor() {
        this.database = new Database(this.DB_FILE);
        this.restTrackConditions = new RestTrackConditions();
    }

    getLapsByTrackId(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["track_id"];
        if (data != undefined) {
            this.getAllByTrackId(parseInt(data)).then((laps) => {
                response.status(200);
                response.send(JSON.stringify(laps));
            });
        } else {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getLeagueLapsByTrackId(request: Request, response: Response) {
        response.type("application/json");
        let trackData = request.params["track_id"];
        let leagueData = request.params["league_id"];
        if (trackData == undefined) {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        } else if (leagueData == undefined) {
            response.status(400);
            let message = { err: "No league_id provided" };
            response.send(JSON.stringify(message));
        } else {
            this.getAllByTrackAndLeagueId(parseInt(trackData), parseInt(leagueData)).then((laps) => {
                response.status(200);
                response.send(JSON.stringify(laps));
            });
        }
    }

    getLapByTrackId(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["lap_id"];
        if (data != undefined) {
            this.getByTrackId(parseInt(data)).then((laps) => {
                response.status(200);
                response.send(JSON.stringify(laps));
            });
        } else {
            response.status(400);
            let message = { err: "No track_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getLapsByDriverId(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["driver_id"];
        if (data != undefined) {
            this.getByDriverId(parseInt(data)).then((laps) => {
                response.status(200);
                response.send(JSON.stringify(laps));
            });
        } else {
            response.status(400);
            let message = { err: "No driver_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    getFastestLapByDriverId(request: Request, response: Response) {
        response.type("application/json");
        let data = request.params["driver_id"];
        if (data != undefined) {
            this.getFastestByDriverId(parseInt(data)).then((laps) => {
                response.status(200);
                response.send(JSON.stringify(laps));
            });
        } else {
            response.status(400);
            let message = { err: "No driver_id provided" };
            response.send(JSON.stringify(message));
        }
    }

    formatDateTime(ms: number): string {
        const date = new Date(ms);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
            date.getMinutes()
        )}:${pad(date.getSeconds())}`;
    }
    async submitLap(request: Request, response: Response) {
        let lapInfo = request.body as { lap: LapsI; trackCondition: TrackConditionI };
        let lap = lapInfo.lap;
        let trackCondition = lapInfo.trackCondition;
        let conditionTime = trackCondition.time;
        trackCondition.time = this.formatDateTime(Number(conditionTime));

        if (trackCondition !== undefined) {
            let trackConditionStatus = await this.restTrackConditions.insertCondition(trackCondition);

            if (trackConditionStatus.inserted == false) {
                response.status(400);
                let message = "Track conditions not inserted";
                response.send(JSON.stringify(message));
            }

            let latestTrackCondition = await this.restTrackConditions.getLatest();

            if (!latestTrackCondition) {
                response.status(400);
                let message = "Couldn't get track condition id";
                response.send(JSON.stringify(message));
            }

            lap.conditions_id = latestTrackCondition?.conditions_id;
            let lapStatus = await this.insertLap(lap);

            if (lapStatus.inserted === true) {
                response.status(200);
                response.send(JSON.stringify(lapStatus));
            } else {
                response.status(400);
                response.send(JSON.stringify(lapStatus));
            }
        }
    }

    async getAllByTrackId(track_id: number): Promise<Array<LapsI>> {
        let sql = "SELECT * FROM laps WHERE track_id=?;";
        var data = (await this.database.getDataPromise(sql, [track_id])) as Array<LapsI>;
        let result = new Array<LapsI>();
        for (let d of data) {
            let l: LapsI = {
                lap_id: d["lap_id"],
                driver_id: d["driver_id"],
                car_id: d["car_id"],
                track_id: d["track_id"],
                conditions_id: d["conditions_id"],
                lap_time_ms: d["lap_time_ms"],
                date: d["date"],
                league_id: d["league_id"],
            };
            result.push(l);
        }
        return result;
    }

    async getAllByTrackAndLeagueId(track_id: number, league_id: number): Promise<Array<LapsI>> {
        let sql = "SELECT * FROM laps WHERE track_id=? AND league_id=?;";
        var data = (await this.database.getDataPromise(sql, [track_id, league_id])) as Array<LapsI>;
        let result = new Array<LapsI>();
        for (let d of data) {
            let l: LapsI = {
                lap_id: d["lap_id"],
                driver_id: d["driver_id"],
                car_id: d["car_id"],
                track_id: d["track_id"],
                conditions_id: d["conditions_id"],
                lap_time_ms: d["lap_time_ms"],
                date: d["date"],
                league_id: d["league_id"],
            };
            result.push(l);
        }
        return result;
    }

    async getByTrackId(id: number): Promise<LapsI | null> {
        let sql = "SELECT * FROM laps WHERE lap_id=?;";
        var data = (await this.database.getDataPromise(sql, [id])) as Array<LapsI>;

        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let l: LapsI = {
                lap_id: d["lap_id"],
                driver_id: d["driver_id"],
                car_id: d["car_id"],
                track_id: d["track_id"],
                conditions_id: d["conditions_id"],
                lap_time_ms: d["lap_time_ms"],
                date: d["date"],
                league_id: d["league_id"],
            };
            return l;
        }
        return null;
    }

    async getByDriverId(driver_id: number): Promise<Array<LapsI | null>> {
        let sql = "SELECT * FROM laps WHERE driver_id=?;";
        var data = (await this.database.getDataPromise(sql, [driver_id])) as Array<LapsI>;
        let result = new Array<LapsI>();
        for (let d of data) {
            let l: LapsI = {
                lap_id: d["lap_id"],
                driver_id: d["driver_id"],
                car_id: d["car_id"],
                track_id: d["track_id"],
                conditions_id: d["conditions_id"],
                lap_time_ms: d["lap_time_ms"],
                date: d["date"],
                league_id: d["league_id"],
            };
            result.push(l);
        }
        return result;
    }

    async getFastestByDriverId(driver_id: number): Promise<LapsI | null> {
        let sql = `
                  SELECT *
                  FROM laps
                  WHERE driver_id = ?
                  ORDER BY lap_time_ms ASC
                  LIMIT 1;
                  `;
        var data = (await this.database.getDataPromise(sql, [driver_id])) as Array<LapsI>;

        if (data.length == 1 && data[0] != undefined) {
            let d = data[0];
            let l: LapsI = {
                lap_id: d["lap_id"],
                driver_id: d["driver_id"],
                car_id: d["car_id"],
                track_id: d["track_id"],
                conditions_id: d["conditions_id"],
                lap_time_ms: d["lap_time_ms"],
                date: d["date"],
                league_id: d["league_id"],
            };
            return l;
        }
        return null;
    }

    async insertLap(lap: LapsI) {
        let lapData = [
            lap.driver_id ?? null,
            lap.car_id ?? null,
            lap.track_id ?? null,
            lap.conditions_id ?? null,
            lap.lap_time_ms ?? null,
            lap.date ?? null,
            lap.league_id ?? null,
        ];

        let sql =
            "INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date, league_id) VALUES (?,?,?,?,?,?,?);";
        let data = await this.database.insertUpdateRows(sql, lapData);
        if (data.error === null) return { err: "", inserted: true };
        else return { err: "Error during row insertion. Please try again.", inserted: false };
    }
}
