import goods from "../models/goods.js";
import population_centres from "../models/population_centres.js";
import production_methods from "../models/production_methods.js";
const test_goods = {
    coal: {
        subcategory_key: "industrial_goods",
        name: "Coal",
        key: "coal",
        kilogram_price: 6
    },
    steel: {
        subcategory_key: "industrial_goods",
        name: "Steel",
        key: "steel",
        kilogram_price: 20
    },
    iron: {
        subcategory_key: "industrial_goods",
        name: "Iron",
        key: "iron",
        kilogram_price: 5
    },
    grain: {
        subcategory_key: "agrarian_goods",
        name: "Grain",
        key: "grain",
        kilogram_price: 5
    }
};
const test_population_centres = {
    testowo: {
        popCentre_name: "Testowo",
        key: "testowo",
        popCentre_population: 3,
    }
}
const test_production_methods = {
    bessemer_process: {
        prodMed_name: "Bessemer Process",
        key: "bessemer_process",
        inputGoods: ['coal', 'iron'],
        inputAmount: [20, 40],
        outputGoods: ['steel'],
        outputAmount: [100],
        prodMed_employment: 20
    }
}
    console.log("Populating with test data");
    Object.keys(test_goods).forEach(element => {
        const elementToBrowse = test_goods[element];
        goods.addNewObject(elementToBrowse);
    });
    Object.keys(test_population_centres).forEach(element => {
        const elementToBrowse = test_population_centres[element];
        population_centres.addNewObject(elementToBrowse);
    });
    Object.keys(test_production_methods).forEach(element => {
        const elementToBrowse = test_production_methods[element];
        production_methods.addNewObject(elementToBrowse);
    });