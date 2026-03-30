import db from "../database.js";
const internal_dboperations = {
    verify_department_access_to_category: db.prepare(`SELECT 1 FROM meta_department_relations WHERE department_name = ? AND category_key = ?`),    
}
export function verify_department_access(department_name, category_key){
    if(internal_dboperations.verify_department_access_to_category().get(department_name, category_key)){
        return true;
    }
    return false;
}
export default {
    verify_department_access
}