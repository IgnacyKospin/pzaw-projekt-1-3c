
import { getStatistics } from "./production_methods.js";
import masterUtil from "./masterUtil.js";
import db from "./database.js";
export function populationCentresConstructor(){
    const preparePopCent = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Population Centres', 'population_centres');`;
    const InsertTempData = `
    INSERT OR IGNORE INTO population_centres (category_key, name, key, population) VALUES ('population_centres', 'Testowo','testowo', 1000000); `
    db.exec(InsertTempData);
    db.exec(preparePopCent);
}
const internal_dboperations = {
    insert_pop_centre: db.prepare(
        `INSERT INTO population_centres (category_key, name, key, population) VALUES ('population_centres', ?, ?, ?);`
    ),
    get_everything: db.prepare(`SELECT * FROM population_centres`)
}
export function exportViews(){
        const rows = internal_dboperations.get_everything.all();
        return rows;
}
export function validateNewObject(newCentre) {
    let errors = [];
    const fields = ["popCentre_name", "key", "popCentre_population"];
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
export function updateEconomicStatistics(populationCentre) {
    updateProduction();
    updateConsumption();

}
export default {
    exportViews,
    populationCentresConstructor,
    validateNewObject,
    addNewObject
}