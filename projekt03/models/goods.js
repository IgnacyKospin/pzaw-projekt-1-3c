import masterUtil from "./masterUtil.js";
import db from "./database.js";
const internal_dboperations = {
    insert_good: db.prepare(
        `INSERT INTO goods VALUES ('goods', ?, ?, ?, 0, 0, ?);`
    ),
    get_good_category: db.prepare(
        `SELECT subcategory_key FROM goods WHERE name LIKE ?;`
    ),
    does_category_exist: db.prepare(`
        SELECT 1 FROM subcategories WHERE subcategory_key LIKE ? AND category_key = 'goods';
        `),
    get_everything: db.prepare(`SELECT * FROM goods`),
    does_something_like_this_exist: db.prepare(`
        SELECT 1 FROM goods WHERE subcategory_key LIKE ? and key LIKE ?;
        `),
    get_all_names: db.prepare(`SELECT name, key FROM goods;`)
}
function getGoodCategory(good_name) {
    return internal_dboperations.get_good_category.get(good_name);
}
export function exportViews() {
    const rows = internal_dboperations.get_everything.all();
    return rows;
}
export function getAllGoods(){
    return internal_dboperations.get_all_names.all();
}
function validateNewObject(newGood) {
    let errors = [];
    const fields = ["name", "key", "kilogram_price", "category"];
    for (let field of fields) {
        if (!newGood[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "kilogram_price" && isNaN(Number(newGood.kilogram_price))) {
            errors.push("Kilogram price not a number");
        }
    }
    //console.log(newGood);
    const category = internal_dboperations.does_category_exist.get(newGood.subcategory_key);
    if (category[1] == 1) {
        const exists = internal_dboperations.does_something_like_this_exist.get(newGood.subcategory_key, newGood.name);
        //console.log(exists);
        if (exists == null) {
        }
        else{
            errors.push(`${newGood.name} already exists in ${category.name}`);
        }
    } else {
        errors.push(`Invalid category: ${newGood.category}`);
    }
       //console.log(category);
    return errors;
}
export function addNewObject(newObj){
    internal_dboperations.insert_good.get(newObj.subcategory_key, newObj.name, newObj.key, newObj.kilogram_price);
    //console.log("now obj:" + newObj);
}
export function goodsConstructor(){
    /*
    trying to call this creation in this file resulted in errors so I have decided to outsource category creation to the master db file
    */
    const prepareGoods = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Goods', 'goods');
    INSERT OR IGNORE INTO subcategories VALUES ('goods', 'industrial_goods', 'Industrial Goods'), ('goods', 'agrarian_goods', 'Agrarian Goods');`;
    //this is temporary so i can see how this very nice thing works
    const InsertTempData = `
    INSERT OR IGNORE INTO goods VALUES ('goods', 'industrial_goods', 'coal', 'coal', 0, 0, 1); `
    db.exec(InsertTempData);
    db.exec(prepareGoods);
}
export default {
    validateNewObject,
    addNewObject,
    goodsConstructor,
    exportViews,
    getAllGoods
}