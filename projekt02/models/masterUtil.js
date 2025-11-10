import goodsImport from "./goods.js";
import populationCentresImport from "./population_centres.js";
import productionMethodsImport from "./production_methods.js";
export function getTab(tabId) {
    const allTabs = [
        ...goodsImport.exportViews(),
        ...populationCentresImport.exportViews(),
        ...productionMethodsImport.exportViews()
    ];
    const found = allTabs.find(tab => tab.id == tabId);
    return found || null;
}
export default {
    getTab,
}