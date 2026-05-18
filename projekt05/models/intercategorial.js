import db from "./database.js";
const internal_dboperations = {
    get_all_categories: db.prepare("SELECT name, key FROM economic_categories;")
}
export function export_categories(){
    return internal_dboperations.get_all_categories.all();
}
export default {
    export_categories
}