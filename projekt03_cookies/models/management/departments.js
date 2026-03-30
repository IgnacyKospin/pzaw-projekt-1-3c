import db from "../database.js";
const internal_dboperations = {
    verify_department_access_to_category: db.prepare(`SELECT 1 FROM meta_department_relations WHERE department_key = ? AND category_key = ?`),    
}
export function verify_department_access(department_id, category_id){
    if(internal_dboperations.verify_department_access_to_category().get(department_id, category_id)){
        return true;
    }
    return false;
}
export default {
    verify_department_access
}