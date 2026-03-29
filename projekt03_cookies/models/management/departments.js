import db from "../database.js";
const internal_dboperations = {
    verify_department_access_to_category: db.prepare(`SELECT 1 FROM "meta_department_relations WHERE department_id = ? AND category_id = ?`),
    
}