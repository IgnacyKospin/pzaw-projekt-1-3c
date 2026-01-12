
import masterUtil from "./masterUtil.js";
import db from "./database.js";
export function populationCentresConstructor(){
    const preparePopCent = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Population Centres', 'population_centres');`;
    db.exec(preparePopCent);
}
const internal_dboperations = {
    insert_pop_centre: db.prepare(
        `INSERT INTO population_centres (category_key, name, key, population) VALUES ('population_centres', ?, ?, ?);`
    ),
    get_everything: db.prepare(`SELECT * FROM population_centres`),
    does_something_like_this_already_exist: db.prepare(`SELECT 1 from population_centres WHERE key = ?`),
    kill: db.prepare(`DELETE FROM population_centres WHERE key = ?`),
    edit: db.prepare(`UPDATE population_centres SET name = ?, population = ? WHERE key = ?`),
    get_matching_facilities: db.prepare(`SELECT * FROM facilities where city_id = ?`),
    get_city_by_key: db.prepare(`SELECT id from population_centres WHERE key = ?`),
    insert_facility: db.prepare(`INSERT INTO facilities VALUES (?, ?, ?, ?, ?)`) //ive decided to have it here since its only used for pop centres
}
export function exportViews(){
        const rows = internal_dboperations.get_everything.all();
        return rows;
}
export function getFacilities(cityId){
    return internal_dboperations.get_matching_facilities.all(cityId);
}
export function deletePC(idToKill){
    internal_dboperations.kill.get(idToKill);
}
export function validateNewObject(newCentre) {
    let errors = [];
    const fields = ["popCentre_name", "key", "popCentre_population"];
    if((internal_dboperations.does_something_like_this_already_exist.get(newCentre.key))[1] !== undefined){
        errors.push("A key like this already exists");
    }
    for (let field of fields) {
        if (!newCentre[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "popCentre_population" && isNaN(Number(newCentre.popCentre_population))) {
            errors.push("Population not a number");
        }
    }
    return errors;
}
export function validateEditObject(newCentre) {
    let errors = [];
    const fields = ["popCentre_name", "popCentre_population"];
    for (let field of fields) {
        if (!newCentre[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "popCentre_population" && isNaN(Number(newCentre.popCentre_population))) {
            errors.push("Population not a number");
        }
    }
    return errors;
}
export function addNewObject(newObj){
    const city_name = newObj.popCentre_name;
    const city_key = newObj.key;
    const city_population = newObj.popCentre_population;
    internal_dboperations.insert_pop_centre.get(city_name, city_key, city_population)
    //console.log("now obj:" + newObj);
}
export function editObject(newObj, key){

    internal_dboperations.edit.get(newObj.popCentre_name, newObj.popCentre_population, key)
}
export function handleNewFacility(parameters, newObj, res){
    /**
     * this doesn't have verification because i managed my time very badly
     */
    const targetCity = internal_dboperations.get_city_by_key.get(parameters.tab_id);
    internal_dboperations.insert_facility.get(targetCity.id, newObj.key, newObj.name, newObj.productionMethod_key, newObj.facility_amount);
    res.redirect(`/tabs/${newObj.category}/${parameters.tab_id}`);
}
export default {
    exportViews,
    populationCentresConstructor,
    validateNewObject,
    addNewObject,
    deletePC,
    validateEditObject,
    editObject,
    getFacilities,
    handleNewFacility
}