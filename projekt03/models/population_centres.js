
import { getStatistics } from "./production_methods.js";
import masterUtil from "./masterUtil.js";
import db from "./database.js";
export function populationCentresConstructor(){
    const preparePopCent = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Population Centres', 'population_centres');`;
    const InsertTempData = `
    INSERT OR IGNORE INTO population_centres (category_key, name, key) VALUES ('population_centres', 'Testowo','testowo'); `
    db.exec(InsertTempData);
    db.exec(preparePopCent);
}
const internal_dboperations = {
    insert_pop_centre: db.prepare(
        `INSERT INTO population_centres (category_key, name, key) VALUES ('population_centres', ?, ?);`
    ),
    get_everything: db.prepare(`SELECT * FROM population_centres`)
}
export function exportViews(){
        const rows = internal_dboperations.get_everything.all();
        return rows;
}
function validateNewObject(newGood) {
    let errors = [];
    const fields = ["name", "key", "kilogram_price", "category"];
    for (let field of fields) {
        if (!newGood[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "kilogram_price" && isNaN(Number(newGood.kilogram_price))) {
            errors.push("Kilogram price not a number");
        }
    }
    //console.log(newGood);
    const category = internal_dboperations.does_category_exist.get(newGood.subcategory_key);
    if (category[1] == 1) {
        const exists = internal_dboperations.does_something_like_this_exist.get(newGood.subcategory_key, newGood.name);
        //console.log(exists);
        if (exists == null) {
        }
        else{
            errors.push(`${newGood.name} already exists in ${category.name}`);
        }
    } else {
        errors.push(`Invalid category: ${newGood.category}`);
    }
       //console.log(category);
    return errors;
}
export function addNewObject(newObj){
    internal_dboperations.insert_pop_centre.get(city_name, city_key)
    //console.log("now obj:" + newObj);
}
export function updateEconomicStatistics(populationCentre) {
    updateProduction();
    updateConsumption();

}
export default {
    exportViews,
    populationCentresConstructor
}