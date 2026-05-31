import db from "./database.js";
import production_methods from "./production_methods.js";
const internal_dboperations = {
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
    });
    console.log(total_inputs);
}
export function test_tester(){
    theGreatEconomicUpdater();
}
export default {
    export_categories,
    test_tester
}