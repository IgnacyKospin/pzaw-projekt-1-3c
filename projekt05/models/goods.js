import masterUtil from "./masterUtil.js";
import csrfCheck from "../utils/validation.js";
import db from "./database.js";
const internal_dboperations = {
    insert_good: db.prepare(
        `INSERT INTO goods VALUES ('goods', ?, ?, 0, 0, ?);`
    ),
    set_production: db.prepare("UPDATE goods SET yearly_production = ? WHERE key = ?;"),
    set_consumption: db.prepare("UPDATE goods SET yearly_consumption = ? WHERE key = ?;"),
    get_everything: db.prepare(`SELECT * FROM goods`),
    does_something_like_this_exist: db.prepare(`
        SELECT 1 FROM goods WHERE key LIKE ?;
        `),
    get_all_names: db.prepare(`SELECT name, key FROM goods;`),
    kill: db.prepare(`DELETE FROM goods WHERE key = ?;`),
    get_name: db.prepare(`SELECT name FROM goods WHERE key = ?;`),
    edit: db.prepare(`UPDATE goods SET name = ?, unit_price = ? WHERE key = ?;`)
}
export function deleteGD(idToKill){
    internal_dboperations.kill.get(idToKill);
}
export function set_production(key, production){
    internal_dboperations.set_production.get(production, key);
}
export function set_consumption(key, consumption){
    internal_dboperations.set_consumption.get(consumption, key);
}
export function exportViews() {
    const rows = internal_dboperations.get_everything.all();
    return rows;
}
export function getAllGoods(){
    return internal_dboperations.get_all_names.all();
}
function validateNewObject(newGood, res) {
    let errors = [];
    const fields = ["name", "key", "kilogram_price", "category"];
    if (!csrfCheck(newGood.csrf_token, res)){
        errors.push("Failed csrf verification.");
    }
    else{
        console.log("CSRF validation succesful for " + newGood.csrf_token);
    }
    if((internal_dboperations.does_something_like_this_exist.get(newGood.key)) !== undefined){
        errors.push("A key like this already exists");
    }
    for (let field of fields) {
        if (!newGood[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "kilogram_price" && isNaN(Number(newGood.kilogram_price))) {
            errors.push("Kilogram price not a number");
        }
    }
    //console.log(newGood);
    return errors;
}
function validateEditObject(newGood) {
    let errors = [];
    const fields = ["name", "kilogram_price", "category"];
    for (let field of fields) {
        if (!newGood[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "kilogram_price" && isNaN(Number(newGood.kilogram_price))) {
            errors.push("Kilogram price not a number");
        }
    }
    return errors;
}
export function addNewObject(newObj){
    internal_dboperations.insert_good.get(newObj.name, newObj.key, newObj.kilogram_price);
    //console.log("now obj:" + newObj);
}
export function editObject(newObj, key){
    console.log(newObj.name, newObj.kilogram_price, key);
    internal_dboperations.edit.get(newObj.name, newObj.kilogram_price, key);
}
export function substituteKeysForName(theGreatObject){
    Object.keys(theGreatObject).forEach(function(key) {
        console.log(key);
        theGreatObject[internal_dboperations.get_name.get(key).name] = theGreatObject[key];
        delete theGreatObject[key];
    });
    return theGreatObject;
}
export default {
    validateNewObject,
    addNewObject,
    exportViews,
    getAllGoods,
    deleteGD,
    validateEditObject,
    editObject,
    set_production,
    set_consumption,
    substituteKeysForName
}