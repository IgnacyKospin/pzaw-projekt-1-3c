import db from "./database.js";
const internal_dboperations = {
    get_all_categories: db.prepare("SELECT name, key FROM economic_categories;"),
    aggregate_facilities_resource_movement: db.prepare("SELECT * FROM facilities JOIN production_methods ON facilities.production_method_key = production_methods.key;")
}
export function export_categories(){
    return internal_dboperations.get_all_categories.all();
}
/**
 * This aggregates the total production and consumption of all facilities, and updates their respective goods entry.
 */
function theGreatEconomicUpdater(){
 //process for when i do this during the evening: get aggregate_facilities_resource_movement, convert them through production_methods function (i think?), multiply each by facility level, merge input/output, update goods.
}
export default {
    export_categories
}