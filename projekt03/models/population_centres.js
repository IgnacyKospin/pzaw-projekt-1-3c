
import { getStatistics } from "./production_methods.js";
import masterUtil from "./masterUtil.js";
import db from "./database.js";
export function populationCentresConstructor(){
    const preparePopCent = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Population Centres', 'population_centres');`;
    db.exec(preparePopCent);
}
const internal_dboperations = {
    insert_pop_centre: db.prepare(
        `INSERT INTO cities (category_key, name, key) VALUES ('population_centres', ?, ?);`
    ),
    get_everything: db.prepare(`SELECT * FROM cities`)
}
export function exportViews(){
        const rows = internal_dboperations.get_everything.all();
        return rows;
}
export function updateEconomicStatistics(populationCentre) {
    updateProduction();
    updateConsumption();

}
export default {
    exportViews,
    populationCentresConstructor
}