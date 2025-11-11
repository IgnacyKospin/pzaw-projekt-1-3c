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
export function viewFormatter(objectName) {
    const toReturn = [];
    for (let loopHighLevel in objectName) {
        const returnFormatted = {};
        for (let loopElements in objectName[loopHighLevel]) {
            if (Array.isArray(objectName[loopHighLevel][loopElements])) {
                returnFormatted[loopElements] = objectName[loopHighLevel][loopElements];
            }
        }
        toReturn.push({
            id: loopHighLevel,
            name: objectName[loopHighLevel].name,
            contents: returnFormatted
        });
    }
    return toReturn;
}
export default {
    getTab,
    viewFormatter
}