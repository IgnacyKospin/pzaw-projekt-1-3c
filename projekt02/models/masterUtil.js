import goodsImport from "./goods.js";
import populationCentresImport from "./population_centres.js";
function hasTab(tabId) {
    const collections = [
        goodsImport.exportViews(),
        populationCentresImport.exportViews()
    ];
    for (const collection of collections) {
        if (collection.some(item => item.id === tabId)) {
            return true;
        }
    }
    return false;
}
export function getTab(tabId) {
    const allTabs = [
        ...goodsImport.exportViews(),
        ...populationCentresImport.exportViews()
    ];
    const found = allTabs.find(tab => tab.id === tabId);
    return found || null;
}
export default {
    getTab
}