/**
 * i am in a prison of my own making
 */
const db_path = "./db.sqlite";
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(db_path);
export default db;