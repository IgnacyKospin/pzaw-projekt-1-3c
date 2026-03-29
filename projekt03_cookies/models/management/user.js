import db from "./database.js";
import argon2 from "argon2";

const PEPPER = process.env.PEPPER;
if(PEPPER == null){
    console.error("Thou hath not madeth thee properteth pepper variable. Thee must follow the instructions");
    process.exit(1);
}
const HASH_PARAMS = {
    secret: Buffer.from(PEPPER, "hex")
}

const internal_dboperations = {
    create_user: db.prepare(`INSERT INTO meta_users (username, passhash, created_at) VALUES (?, ?, ?) returning user_id as id;`),
    get_user: db.prepare(`SELECT id, username from meta_users where id = ?;`)

}
export function get_user(id) {
    return internal_dboperations.get_user().get(id);
}