import db from "./database.js";
import goodsImport from "./goods.js";
import populationCentresImport from "./population_centres.js";
import productionMethodsImport from "./production_methods.js";
export function getTab(tabCategory, tabId) {
    const query1 = ("SELECT * FROM " + tabCategory + " WHERE key = '" + tabId + "';");
    const query = db.prepare(query1);
    const result = query.get();
    console.log("kwerenda result:");
    console.log(result);
    return result;
    
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
export function handleNew(tab, newData, res) {
    let totalHandler = {};
    console.log("Nowe dane");
    console.log(newData);
    switch (newData.category) {
        case "goods":
            totalHandler.errors = goodsImport.validateNewObject(newData, tab);
            break;
    }
    if (totalHandler.errors.length === 0) {
        switch (newData.category) {
            case "goods":
                newData.subcategory_key = tab.subcategory_key;
                goodsImport.addNewObject(newData);
                break;
        }
        res.redirect(`/tabs/${tabId}/${tab.id}`);
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