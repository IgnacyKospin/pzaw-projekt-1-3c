
import { getStatistics } from "./production_methods.js";
import masterUtil from "./masterUtil.js";
export function populationCentresConstructor(){
    const preparePopCent = `
    INSERT OR IGNORE INTO economic_categories (name, key) VALUES ('Population Centres', 'population_centres');`;
    db.exec(preparePopCent);
}
const population_centres = {
    name: "Population Centres",
    id: "population_centres",
    supportsAdding: false,
    contents: {
        "warszawa": {
            name: "Warszawa",
            data: [
                {
                    population: 1960000,
                    unemployed: 1000
                }
            ],
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
}
export function exportViews(){
    return masterUtil.viewFormatter(population_centres);
}
export function updateEconomicStatistics(populationCentre) {
    updateProduction();
    updateConsumption();

}
export default {
    exportViews,
    populationCentresConstructor
}