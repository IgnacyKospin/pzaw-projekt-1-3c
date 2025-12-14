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
export function viewFormatter(category) {
    /*
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
    */
    switch(category){
        case 'goods':
            return goods.formatContents();
    }
}
export function handleNew(tab, newData, res) {
    let totalHandler = {};
    switch (tab.category) {
        case "goods":
            totalHandler.errors = goodsImport.validateNewObject(newData);
            break;
    }
    if (totalHandler.errors.length === 0) {
        switch (tab.category) {
            case "goods":
                goodsImport.addNewObject(newData);
                break;
        }
        res.redirect(`/tabs/${tab.id}`);
    } else {
        res.status(400).render("add_new", {
            errors: totalHandler.errors,
            title: "New Obj",
            contents: tab.contents,
            category: tab.category,
            tab_id: tab.id
        });
    }
}

export default {
    getTab,
    viewFormatter,
    handleNew
}