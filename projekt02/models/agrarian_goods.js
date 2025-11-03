const agrarian_goods = {
    "grain": {
        name: "Grain",
        yearly_production: 100,
        yearly_consumption: 50,
        kilogram_price: 0.16
    },
    "meat": {
        name: "Meat",
        yearly_production: 50,
        yearly_consumption: 25,
        kilogram_price: 10
    }
}
//production minus consumption
export function getBalance(good_name) {
    let balance = agrarian_goods[good_name].yearly_production - agrarian_goods[good_name].yearly_consumption;
    return balance;
}
//counts from population centres the total production
export function updateYearlyProduction(good_name) {
    //todo
    agrarian_goods[good_name].yearly_production = calcResult;
}
export default {
    getBalance,
    updateYearlyProduction
}