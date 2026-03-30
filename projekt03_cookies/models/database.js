/**
 * i am in a prison of my own making
 */
const db_path = "./db.sqlite";
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(db_path, {readBigInts: true});
/**they call me an enjiner the way i put bandaid solutions to locked database errors */
db.exec(`PRAGMA journal_mode = WAL`);
db.exec(`PRAGMA busy_timeout = 5000;`);

export default db;