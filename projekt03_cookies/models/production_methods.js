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
    get_everything: db.prepare(`SELECT * FROM production_methods`),
    does_something_like_this_exist: db.prepare(`SELECT 1 FROM production_methods WHERE key = ?`),
    kill: db.prepare(
        `DELETE FROM production_methods WHERE key = ?;`
    ),
    edit: db.prepare(
        `
        UPDATE production_methods SET name = ?, input_goods = ?, output_goods = ?, expected_employment = ? WHERE key = ?;
        `
    )
}
function formatInputOutput(arrNames, arrNumbers){
    //arrays -> storage format
    if(typeof arrNames !== 'object'){
        arrNames = [arrNames];
        arrNumbers = [arrNumbers];
    }
    let formatted = {};
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
    Object.keys(formatted).forEach(function(cat){
        result += (cat + ":" + formatted[cat] + ";");
    });
    return result;
}
export function deletePM(idToKill){
    internal_dboperations.kill.get(idToKill);
}
export function parseInputsOutputs(contents){
    //storage format -> object
    const array = contents.split(";");
    array.pop();
    let objectToReturn = {}
    for(let i = 0; i < array.length; i++){
            let temp = array[i].split(":");
            objectToReturn[temp[0]] = temp[1];
    }
    return objectToReturn;
}
export function exportViews() {
    const rows = internal_dboperations.get_everything.all();
    return rows;
}
export function validateNewObject(newMethod) {
    let errors = [];
    const fields = ["prodMed_name", "key", "prodMed_employment"];
    const specialFields = ["outputAmount", "inputAmount"];
    if((internal_dboperations.does_something_like_this_exist.get(newMethod.key)[1]) !== undefined){
        errors.push("A key like this already exists");
        }
    for (let field of fields) {
        if (!newMethod[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "prodMed_employment" && isNaN(Number(newMethod.prodMed_employment))) {
            errors.push("Employment not a number");
        }
    }
    for(let field of specialFields){
        if(Array.isArray(newMethod[field])){
            for(let x = 0; x < newMethod[field].length; x++){
                if(isNaN(Number(newMethod[field][x]))){
                    console.log(newMethod[field][x]);
                    errors.push("A good input or output value is not a number")
                }
            }
        }
        else{
            if(isNaN(Number(newMethod[field]))){
                errors.push("A good input or output value is not a number")
            }
        }
    }
    return errors;
}
export function validateEditObject(newMethod) {
    let errors = [];
    const fields = ["prodMed_name", "prodMed_employment"];
    const specialFields = ["outputAmount", "inputAmount"];
    for (let field of fields) {
        if (!newMethod[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "prodMed_employment" && isNaN(Number(newMethod.prodMed_employment))) {
            errors.push("Employment not a number");
        }
    }
    for(let field of specialFields){
        if(Array.isArray(newMethod[field])){
            for(let x = 0; x < newMethod[field].length; x++){
                if(isNaN(Number(newMethod[field][x]))){
                    console.log(newMethod[field][x]);
                    errors.push("A good input or output value is not a number")
                }
            }
        }
        else{
            if(isNaN(Number(newMethod[field]))){
                errors.push("A good input or output value is not a number")
            }
        }
    }
    return errors;
}
export function addNewObject(newObj){
    let inputFormat = formatInputOutput(newObj.inputGoods, newObj.inputAmount);
    let outputFormat = formatInputOutput(newObj.outputGoods, newObj.outputAmount);
    internal_dboperations.insert_pm.get(newObj.prodMed_name, newObj.key, inputFormat, outputFormat, newObj.prodMed_employment);
    //console.log("now obj:" + newObj);
}
export function editObject(newObj, key){
    let inputFormat = formatInputOutput(newObj.inputGoods, newObj.inputAmount);
    let outputFormat = formatInputOutput(newObj.outputGoods, newObj.outputAmount);
    const res = internal_dboperations.edit.get(newObj.prodMed_name, inputFormat, outputFormat, newObj.prodMed_employment, key);
}
export default {
    exportViews,
    productionMethodsConstructor,
    addNewObject,
    validateNewObject,
    parseInputsOutputs,
    deletePM,
    validateEditObject,
    editObject
}