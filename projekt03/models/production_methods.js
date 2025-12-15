import masterUtil from "./masterUtil.js";
import db from "./database.js";
export function productionMethodsConstructor(){
    const prepareProdMet = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Production Methods', 'production_methods');`;
    db.exec(prepareProdMet);
}
const internal_dboperations = {
    insert_pm: db.prepare(
        `INSERT INTO production_methods (category_key, name, key, input_goods, output_goods, expected_employment) VALUES ('production_methods', ?, ?, ?, ?, ?);`
    ),
    get_everything: db.prepare(`SELECT * FROM production_methods`)
}
export function getStatistics(processName){
    return production_methods.contents[processName];
}
export function exportViews() {
    const rows = internal_dboperations.get_everything.all();
    return rows;
}
export default {
    exportViews,
    productionMethodsConstructor
}