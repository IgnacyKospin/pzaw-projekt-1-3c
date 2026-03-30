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
const DEFAULT_PERMISSIONS = {
    admin: "no",
    update: "no",
    create: "no",
    delete: "no",
}

const internal_dboperations = {
    create_user: db.prepare(`INSERT INTO meta_users (username, passhash, permissions, created_at) VALUES (?, ?, ?, ?) returning id as id;`),
    get_user: db.prepare(`SELECT id, username, department, permissions from meta_users where id = ?;`),
    alter_permissions: db.prepare(`UPDATE meta_users SET permissions = ? WHERE id = ?`),
    get_idpasshash: db.prepare(`SELECT id, passhash from meta_users where username = ?`),
    get_by_name: db.prepare(`SELECT id, username from meta_users where username = ?`),
    get_permissions: db.prepare(`SELECT permissions from meta_users where id = ?`),
    get_all: db.prepare(`SELECT id, username, department, permissions, created_at from meta_users`)
}
export function get_user(id) {

    var user = internal_dboperations.get_user.get(id);
    user.permissions = process_permissions(user.permissions);
    return user;
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
    const permissions_db_format = process_permissions(DEFAULT_PERMISSIONS);
    if(internal_dboperations.get_by_name.get(username)){
        return null;
    }
    const created_at = Date.now();
    const passhash = await argon2.hash(password, HASH_PARAMS);
    return internal_dboperations.create_user.get(username, passhash, permissions_db_format, created_at);
}
export function get_permissions(id){
    const permissions = internal_dboperations.get_permissions.get(id);
    return process_permissions(permissions);
}
export function get_all_users(){
    const users = internal_dboperations.get_all.all();
    return users.map(user => ({
        ...user,
        permissions: process_permissions(user.permissions),
        department_id: user.department
    }));
}
/**
 * 
 * either processes a object into a database-ready format, or the database format into an object. assumes the data is provided correctly in case of string->object
 */
function process_permissions(permissions){
    var result;
    if(typeof permissions === "object"){
        result = Object.entries(permissions).map(([key, value]) => `${key}:${value}`).join(";");
    }
    else{
        result = Object.fromEntries(permissions.split(";").map(pair => {const [key, value] = pair.split(":"); return [key, value];}));
    }
    return result;
}
export default {
    get_user,
    checkPassword,
    create_user,
    get_permissions,
    get_all_users
}