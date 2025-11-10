
import { getStatistics } from "./production_methods.js";
import { updateYearlyProduction } from "./goods.js";
const population_centres = {
    "warszawa": {
        name: "Warszawa",
        population: 1860000,
        facilities: [
            { facility_name: "Steel Mill", facility_amount: 1, production_method: "Bessemer Process"}
        ],
        goods_production: [
            {
                good_name: "Steel", amount: 10
            }   
        ],
        goods_consumption: [
            {
                good_name: "Coal", amount: 30
            }
        ]
    }
}
function updateProduction() {
    for (cityName in population_centres) {
        city = population_centres[cityName];
        arrayProd = {};
        for (facLoop of city.facilities) {
            statistics = getStatistics(facLoop.production_method.toLowerCase().replaceAll(" ", "_"));
            if (!statistics || !statistics.output_goods) continue;
            for (statLoop of statistics.output_goods) {
                totalAmount = statLoop.amount * facLoop.facility_amount;
                arrayProd[statLoop.name] = (arrayProd[statLoop.name] || 0) + totalAmount;
            }
        }
        city.goods_production = Object.entries(arrayProd).map(([good_name, amount]) => ({
            good_name,
            amount
        }));
    }
}
function updateConsumption(){
        for (cityName in population_centres) {
        city = population_centres[cityName];
        arrayProd = {};
        for (facLoop of city.facilities) {
            statistics = getStatistics(facLoop.production_method.toLowerCase().replaceAll(" ", "_"));
            if (!statistics || !statistics.input_goods) continue;
            for ( tatLoop of statistics.input_goods) {
                totalAmount = statLoop.amount * facLoop.facility_amount;
                arrayProd[statLoop.name] = (arrayProd[statLoop.name] || 0) + totalAmount;
            }
        }
        city.goods_consumption = Object.entries(arrayProd).map(([good_name, amount]) => ({
            good_name,
            amount
        }));
    }
}
export function exportViews(){
    var toReturn = [];
    for(let loopCentres in population_centres){
        toReturn.push(        
            {
                id: loopCentres,
                name: population_centres[loopCentres].name 
            }
        )
    }
    return toReturn;
}
export function updateEconomicStatistics(populationCentre) {
    updateProduction();
    updateConsumption();
    updateYearlyProduction()
}
export default {
    exportViews
}