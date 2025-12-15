import masterUtil from "./masterUtil.js";
import db from "./database.js";
export function productionMethodsConstructor(){
    const prepareProdMet = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Production Methods', 'production_methods');`;
    const insertTestData = `
    INSERT OR IGNORE INTO production_methods VALUES ('production_methods', 'testPM', 'testPMkey', 'coal:60;', 'steel:20;', 20)`;
    db.exec(insertTestData);
    db.exec(prepareProdMet);
}
const internal_dboperations = {
    insert_pm: db.prepare(
        `INSERT INTO production_methods (category_key, name, key, input_goods, output_goods, expected_employment) VALUES ('production_methods', ?, ?, ?, ?, ?);`
    ),
    get_everything: db.prepare(`SELECT * FROM production_methods`)
}
function formatInputOutput(arrNames, arrNumbers){
    let formatted = {};
    console.log(arrNames);
    for (let i = 0; i < arrNames.length; i++) {
        const name = arrNames[i];
        const value = Number(arrNumbers[i]);
        if (formatted[name] === undefined) {
            formatted[name] = value;
        } else {
            formatted[name] += value;
        }
    }
    let result = "";
    console.log(formatted);
    Object.keys(formatted).forEach(function(cat){
        result += (cat + ":" + result[cat] + ";");
    });
    return result;
}
export function getStatistics(processName){
    return production_methods.contents[processName];
}
export function exportViews() {
    const rows = internal_dboperations.get_everything.all();
    return rows;
}
export function validateNewObject(newCentre) {
    let errors = [];
    /*
    const fields = ["popCentre_name", "key", "popCentre_population"];
    for (let field of fields) {
        if (!newCentre[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "popCentre_population" && isNaN(Number(newCentre.popCentre_population))) {
            errors.push("Population not a number");
        }
    }
        */
    return errors;
}
export function addNewObject(newObj){
    console.log("Nowy obj");
    console.log(newObj);
    let inputFormat = formatInputOutput(newObj.inputGoods, newObj.inputAmount);
    let outputFormat = formatInputOutput(newObj.outputGoods, newObj.outputAmount);
    internal_dboperations.insert_pm.get(newObj.prodMed_name, newObj.key, inputFormat, outputFormat, newObj.prodMed_employment);
    //console.log("now obj:" + newObj);
}
export default {
    exportViews,
    productionMethodsConstructor,
    addNewObject,
    validateNewObject
}