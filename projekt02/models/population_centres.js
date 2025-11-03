import "production_methods.js";
const population_centres = {
    "Warszawa": {
        name: "Warszawa",
        population: 1860000,
        employed: 10,
        dependants: 10,
        detailed_employment: [
            {
                job: "Labourer",
                amount: 10
            }
        ],
        facilities: [
            { facility_name: "Steel Mill", facility_amount: 1, production_method: "Bessemer Process", employees: 10 }
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
function updateProduction(productionSum){
    //todo: have this collect all the production methods production times facility_amount for all in facilities, sum up for all goods, update goods_production
}
function updateConsumption(consumptionSum){
    //todo: do what updateProduction but for consumtion instead of production
}
export function updateEconomicStatistics(populationCentre){
    //collect both production and consumption sum from production methods times facility amoutn for all in facilites, pass to updateProduction and updateConsumption.
    productionSum = [];
    consumptionSum = [];
    for(let facilities_loop of population_centres[populationCentre].facilities){
        current_pm = getStatistics(facilities_loop.production_method);
        for(let input_loop of current_pm.input_goods){
            consumptionSum.append() = input_loop;
        }
        for(let output_loop of current_pm.output_goods){
            productionSum.append() = output_loop;
        }
    }
    //todo: remove duplicate key objects, sum their values for both arrays then call both updateProduction and updateConsumption.
    //todo add lodash if can
}
export function updateEmployment(){
    //todo: have this collect all employment stats from all the production methods times facilities for all in facilities, sum up, update employed and detailed_employment
}