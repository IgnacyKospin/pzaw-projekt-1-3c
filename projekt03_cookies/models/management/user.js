import db from "../database.js";
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
    create_user: db.prepare(`INSERT INTO meta_users (username, passhash, created_at) VALUES (?, ?, ?) returning id as id;`),
    get_user: db.prepare(`SELECT id, username, department from meta_users where id = ?;`),
    alter_permissions_and_dept: db.prepare(`UPDATE meta_users SET department = ?, permissions = ? WHERE id = ?`),
    get_idpasshash: db.prepare(`SELECT id, passhash from meta_users where username = ?`),
    get_by_name: db.prepare(`SELECT id, username from meta_users where username = ?`)
}
export function get_user(id) {
    return internal_dboperations.get_user.get(id);
}
export async function checkPassword(username, password) {
  let auth_data = internal_dboperations.get_idpasshash.get(username);
  if (auth_data != null) {
    if (await argon2.verify(auth_data.passhash, password, HASH_PARAMS)) {
      return auth_data.id;
    }
  }
  return null;
}
export async function create_user(username, password){
    if(internal_dboperations.get_by_name.get(username)){
        return null;
    }
    const created_at = Date.now();
    const passhash = await argon2.hash(password, HASH_PARAMS);
    return internal_dboperations.create_user.get(username, passhash, created_at);
}
export default {
    get_user,
    checkPassword,
    create_user
}