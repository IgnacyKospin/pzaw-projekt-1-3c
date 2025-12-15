//the database creation is stored here because i think it is too complex for it to be in several files spread out so i'll just call it 
import db from "./database.js";
import goods from "./goods.js";
import population_centres from "./population_centres.js";
import production_methods from "./production_methods.js";
export function fillDatabasesWithBaseInfo(){
    goods.goodsConstructor(); 
    population_centres.populationCentresConstructor();
    production_methods.productionMethodsConstructor();
}
export default{
    fillDatabasesWithBaseInfo
};
const test_goods = {
    coal: {
        subcategory: "industrial_goods",
        name: "Coal",
        key: "coal",
        perKilogramPrice: 6
    },
    steel: {
        subcategory: "industrial_goods",
        name: "Steel",
        key: "steel",
        perKilogramPrice: 20
    },
    iron: {
        subcategory: "industrial_goods",
        name: "Iron",
        key: "iron",
        perkilogramPrice: 5
    },
    grain: {
        subcategory: "agrarian_goods",
        name: "Grain",
        key: "grain",
        perKilogramPrice: 5
    }
}
if (process.env.FILL_UP) {
    console.log("Populating with test data");
    Object.keys(test_goods).forEach(element => {
        const elementToBrowse = test_goods[element];
        goods.addNewObject(elementToBrowse.subcategory, elementToBrowse.name, elementToBrowse.key, elementToBrowse.perKilogramPrice);
    });
}