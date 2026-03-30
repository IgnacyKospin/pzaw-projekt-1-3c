import db from "../database.js";
const internal_dboperations = {
    verify_department_access_to_category: db.prepare(`SELECT 1 FROM meta_department_relations WHERE department_key = ? AND category_key = ?`),    
    get_department_key_by_id: db.prepare(`SELECT key FROM meta_departments WHERE id = ?`),
    get_department_name_by_id: db.prepare(`SELECT department_name from meta_departments WHERE id = ?`)
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
    var result = internal_dboperations.get_department_key_by_id.get(id);
    if(!result || result.key === undefined){
        return null;
    }
    else{
        return result.key
    }
}
export function id_to_name(id){
    let result =  internal_dboperations.get_department_name_by_id.get(id);
    if(!result || result.department_name === undefined){
        return null;
    }
    else{
        return result.department_name
    }
}
export default {
    verify_department_access,
    id_to_key,
    id_to_name
}