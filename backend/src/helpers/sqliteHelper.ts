import SQLite from "better-sqlite3";

export default class Database {
    private dbConnection;
    private dbPath;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
        this.dbConnection = new SQLite(dbPath);
        this.dbConnection.exec("PRAGMA foreign_keys = ON;");
    }

    establishDbConnection() {
        this.dbConnection = new SQLite(this.dbPath);
        this.dbConnection.exec("PRAGMA foreign_keys = ON;");
    }

    insertUpdateRows(
        sql: string,
        data: Array<string | number | Buffer | null>
    ): { n_of_changes: number; lastRow: number | bigint; error: unknown | null } {
        try {
            let result = this.dbConnection.prepare(sql).run(data);
            return { n_of_changes: result.changes, lastRow: result.lastInsertRowid, error: null };
        } catch (err) {
            console.error("Error during query execution:", err);
            return { n_of_changes: 0, lastRow: 0, error: err };
        }
    }

    getData(sql: string, data: Array<string | number>) {
        try {
            const result = this.dbConnection.prepare(sql).all(data);
            return result;
        } catch (err) {
            console.error("Error during query execution:", err);
            return err;
        }
    }

    getDataPromise(sql: string, data: Array<string | number | bigint>) {
        return new Promise((success, error) => {
            setTimeout(() => {
                try {
                    const result = this.dbConnection.prepare(sql).all(data);
                    success(result);
                } catch (err) {
                    console.error("Error during query execution:", err);
                    console.log(sql);
                    error(err);
                }
            }, 1);
        });
    }

    closeConnection() {
        this.dbConnection.close();
    }
}
