import db from "../database.js";
const internal_dboperations = {
    verify_department_access_to_category: db.prepare(`SELECT 1 FROM meta_department_relations WHERE department_key = ? AND category_key = ?`),    
    get_department_key_by_id: db.prepare(`SELECT key FROM meta_departments WHERE id = ?`)
}
export function verify_department_access(department_key, category_key){
    console.log(department_key);
    console.log(category_key);
    if(internal_dboperations.verify_department_access_to_category.get(department_key, category_key)){
        return true;
    }
    return false;
}
export function id_to_key(id){
    return internal_dboperations.get_department_key_by_id.get(id);
}
export default {
    verify_department_access,
    id_to_key
}