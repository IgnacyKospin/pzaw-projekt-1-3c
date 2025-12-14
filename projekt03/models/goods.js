import masterUtil from "./masterUtil.js";
import db from "./database.js";
const internal_dboperations = {
    insert_good: db.prepare(
        `INSERT INTO goods (category_key, subcategory_key, name, key, perKilogram_price) VALUES ('goods', ?, ?, ?, ?);`
    ),
    get_good_category: db.prepare(
        `SELECT subcategory_key FROM goods WHERE name LIKE ?;`
    ),
    does_category_exist: db.prepare(`
        SELECT 1 FROM subcategories WHERE subcategory_key LIKE ? AND category_key = 'goods';
        `),
    get_everything: db.prepare(`SELECT * FROM goods`)
}
function getGoodCategory(good_name) {
    return internal_dboperations.get_good_category.get(good_name);
}
export function formatContents() {
    const rows = internal_dboperations.get_everything.all();
    const contents = {};
    for (const row of rows) {
        const subcategory = row.subcategory_key;
        if (!contents[subcategory]) {
            contents[subcategory] = [];
        }
        contents[subcategory].push({
            name: row.name,
            key: row.key,
            yearly_production: row.yearly_production,
            yearly_consumption: row.yearly_consumption,
            perKilogram_price: row.perKilogram_price
        });
    }
    return contents;
}

function validateNewObject(newGood) {
    let errors = [];
    const fields = ["name", "kilogram_price", "category"];
    for (let field of fields) {
        if (!newGood[field]) {
            errors.push(`Missing ${field}`);
        } else if (field == "kilogram_price" && isNaN(Number(newGood.kilogram_price))) {
            errors.push("Kilogram price not a number");
        }
    }
    const category = internal_dboperations.does_category_exist.get(newGood.categoryKey);
    if (category) {
        const exists = category.goods.some(g => g.name === newGood.name);
        if (exists) {
            errors.push(`${newGood.name} already exists in ${category.name}`);
        }
    } else {
        errors.push(`Invalid category: ${newGood.category}`);
    }
    return errors;
}
export function addNewObject(newObj){
    internal_dboperations.insert_good.get(newObj.categoryKey, newObj.name, newObj.key, newObj.kilogram_price);
}
export function goodsConstructor(){
    /*
    trying to call this creation in this file resulted in errors so I have decided to outsource category creation to the master db file
    */
    const prepareGoods = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Goods', 'goods');
    INSERT OR IGNORE INTO subcategories VALUES ('goods', 'industrial_goods', 'Industrial Goods'), ('goods', 'agrarian_goods', 'Agrarian Goods');`;
    db.exec(prepareGoods);
}
export default {
    validateNewObject,
    addNewObject,
    goodsConstructor
}