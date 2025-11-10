
const goods = {
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
function getGoodCategory(good_name) {
    for (const categoryKey of Object.keys(goods)) {
        const category = goods[categoryKey];
        if (category.goods.some(g => g.name.toLowerCase() === good_name.toLowerCase())) {
            return categoryKey;
        }
    }
    return null;
}
//production minus consumption
export function getBalance(good_name) {
    const categoryKey = getGoodCategory(good_name);
    const good = goods[categoryKey].goods.find(g => g.name.toLowerCase() === good_name.toLowerCase());
    return good.yearly_production - good.yearly_consumption;
}

//counts from population centres the total production
export function updateYearlyProduction() {
    for (const categoryKey in goods) {
        for (const g of goods[categoryKey].goods) {
            g.yearly_production = 0;
        }
    }
    for (cityName in population_centres) {
        city = population_centres[cityName];
        if (!city.goods_production) continue;

        for (prod of city.goods_production) {
            goodKey = Object.keys(industrial_goods).find(
                key => industrial_goods[key].name.toLowerCase() === prod.good_name.toLowerCase()
            );
            if (goodKey) {
                industrial_goods[goodKey].yearly_production += prod.amount;
            }
        }
    }
}

/*

exterior server utility below

*/ 
export function exportViews(){
    var toReturn = [];
    for(let loopGoods in goods){
        toReturn.push(        
            {
                id: loopGoods,
                name: goods[loopGoods].name 
            }
        )
    }
    return toReturn;
}
export default {
    getBalance,
    updateYearlyProduction,
    exportViews
}