import masterUtil from "./masterUtil.js";
import { DatabaseSync } from "node:sqlite";
const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

/*const internal_dboperations = {
    insert_good_category: db.prepare(
        `
            INSERT INTO 
        `

    ),
    insert_good: db.prepare(

    )
}
*/
const goods = {
    name: "Goods",
    id: "goods",
    supportsAdding: true,
    contents: {
        "industrial_goods" : {
            name: "Industrial Goods",
            goods: [
                {
                    name: "Steel",
                    yearly_production: 100,
                    yearly_consumption: 50,
                    kilogram_price: 0.16
                },
                {
                    name: "Coal",
                    yearly_production: 50,
                    yearly_consumption: 25,
                    kilogram_price: 10
                }
            ]
        },
        "agrarian_goods" : {
            name: "Agrarian Goods",
            goods: [
                {
                    name: "Grain",
                    yearly_production: 100,
                    yearly_consumption: 50,
                    kilogram_price: 0.16
                },
                {
                    name: "Meat",
                    yearly_production: 50,
                    yearly_consumption: 25,
                    kilogram_price: 10
                }
            ]
        }
    }
}
function getGoodCategory(good_name) {
    for (const categoryKey of Object.keys(goods)) {
        const category = goods.contents[categoryKey];
        if (category.goods.some(g => g.name.toLowerCase() === good_name.toLowerCase())) {
            return categoryKey;
        }
    }
    return null;
}
//production minus consumption
export function getBalance(good_name) {
    const categoryKey = getGoodCategory(good_name);
    const good = goods.contents[categoryKey].goods.find(g => g.name.toLowerCase() === good_name.toLowerCase());
    return good.yearly_production - good.yearly_consumption;
}

//counts from population centres the total production
export function updateYearlyProduction() {
    for (const categoryKey in goods) {
        for (const g of goods.contents[categoryKey].goods) {
            g.yearly_production = 0;
        }
    }
    for (cityName in population_centres.contents) {
        city = population_centres.contents[cityName];
        if (!city.goods_production) continue;

        for (prod of city.goods_production) {
            goodKey = Object.keys(industrial_goods).find(
                key => industrial_goods.contents[key].name.toLowerCase() === prod.good_name.toLowerCase()
            );
            if (goodKey) {
                industrial_goods.contents[goodKey].yearly_production += prod.amount;
            }
        }
    }
}
export function exportViews(){
    return masterUtil.viewFormatter(goods);
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
    const category = goods.contents[newGood.category];
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
    const newCategory = newObj.category;
    const toStore = {
        name: newObj.name,
        yearly_production: 0,
        yearly_consumption: 0,
        kilogram_price: Number(newObj.kilogram_price)
    };
    goods.contents[newCategory].goods.push(toStore);
}
export default {
    getBalance,
    updateYearlyProduction,
    exportViews,
    validateNewObject,
    addNewObject
}