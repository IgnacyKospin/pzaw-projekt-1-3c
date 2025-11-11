import masterUtil from "./masterUtil.js";
const production_methods = {
    "bessemer_process": {
        name: "Bessemer Process",
        input_goods: [
            {
                name: "Iron", amount: 60
            },
            {
                name: "Coal", amount: 30
            }
        ],
        output_goods: [
            {
                name: "Steel", amount: 90
            }
        ],
        expected_employment: [
            {
                position: "Shopkeeper", amount: 500
            },
            {
                position: "Labourer", amount: 3000
            },
            {
                position: "Machinist", amount: 1250
            },
            {
                position: "Engineer", amount: 750
            }
        ]
    }
}
export function getStatistics(processName){
    return production_methods[processName];
}
export function exportViews(){
    return masterUtil.viewFormatter(production_methods);
}
export default {
    exportViews
}