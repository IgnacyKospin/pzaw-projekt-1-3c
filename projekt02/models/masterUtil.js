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
    for (let loopHighLevel in objectName.contents) {
        const returnFormatted = {};
        for (let loopElements in objectName.contents[loopHighLevel]) {
            if (Array.isArray(objectName.contents[loopHighLevel][loopElements])) {
                returnFormatted[loopElements] = objectName.contents[loopHighLevel][loopElements];
            }
        }
        toReturn.push({
            id: loopHighLevel,
            name: objectName.contents[loopHighLevel].name,
            category: objectName.id,
            contents: returnFormatted
        });
    }
    return toReturn;
}
export default {
    getTab,
    viewFormatter
}