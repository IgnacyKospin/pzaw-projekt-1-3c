import db from "./database.js";
import production_methods from "./production_methods.js";
import goods from "./goods.js";
const internal_dboperations = {
    /**
     * to ensure proper cartelisation of models, i decided that this should only read. ergo the goods will be polluted with more operations
     */
    get_all_categories: db.prepare("SELECT name, key FROM economic_categories;"),
    aggregate_facilities_resource_movement: db.prepare("SELECT production_method_key, expected_employment, input_goods, output_goods, SUM(facility_amount) as amount_sum FROM facilities JOIN production_methods ON facilities.production_method_key = production_methods.key GROUP BY production_method_key")
}
export function export_categories(){
    return internal_dboperations.get_all_categories.all();
}
/**
 * This aggregates the total production and consumption of all facilities, and updates their respective goods entry.
 */
function theGreatEconomicUpdater(){
    let fat_result = internal_dboperations.aggregate_facilities_resource_movement.all(); 
    let total_inputs = {};
    let total_outputs = {};
    fat_result.forEach(row => {
        const multiplier = parseFloat(row.amount_sum);
        let inputs = production_methods.parseInputsOutputs(row.input_goods);
        let outputs = production_methods.parseInputsOutputs(row.output_goods);
        console.log(inputs);
        Object.entries(inputs).forEach(([key, value]) => {
            if (key in total_inputs) {
                total_inputs[key] += value * multiplier;
            } else {
                total_inputs[key] = value * multiplier;
            }
        });
        Object.entries(outputs).forEach(([key, value]) => {
            if (key in total_outputs) {
                total_outputs[key] += value * multiplier;
            } else {
                total_outputs[key] = value * multiplier;
            }
        });
    });
        Object.entries(total_inputs).forEach(([key, value]) => {
            goods.set_consumption(key, value)
        });
        Object.entries(total_outputs).forEach(([key, value]) => {
            goods.set_production(key, value)
        });
    console.log(total_inputs);
    console.log(total_outputs);
}
export function test_tester(){
    theGreatEconomicUpdater();
}
export default {
    export_categories,
    test_tester
}