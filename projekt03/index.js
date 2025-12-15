/**
 * projekt chyba lamie regulacje tematyki gdyz jest sprzeczny z artykulem 20 konstytucji ale trudno
 */
import express from "express";
import morgan from "morgan";
import createDatabase from "./models/database_creation.js";
createDatabase.createDatabases();
import databaseOps from "./models/database_fill.js";
databaseOps.fillDatabasesWithBaseInfo(); //create the databases

import goods from "./models/goods.js";
import populationCentres from "./models/population_centres.js";
import productionMethods from "./models/production_methods.js";
import masterUtil from "./models/masterUtil.js";
const port = 8000;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(morgan("dev"));

function log_request(req, res, next) {
    console.log(`Request ${req.method} ${req.path}`);
    next();
}
app.use(log_request);
app.get("/tabs", (req, res) => {
    res.render("tabs", 
    {
        title: "Economic Categories",
        listOfTabs: [
            {
                title: "Goods",
                contents: goods.exportViews()
            },
            
            {
                title: "Population Centres",
                contents: populationCentres.exportViews()
            },
            
            {
                title: "Production Methods",
                contents: productionMethods.exportViews()
            }
                
        ]
    }
    );
});
app.get("/tabs/:tab_category/:tab_id", (req, res) =>{
    const tabs = masterUtil.getTab(req.params.tab_category, req.params.tab_id);
    //console.log(tabs);
    if (tabs) {
        console.log(tabs);
        switch(tabs.category_key){
            case("goods"):
                res.render("tabGoods", {
                    category: tabs.category_key,
                    title: tabs.name,
                    tab_id: tabs.key,
                    contents: tabs
                });
                break;
            case("population_centres"):
                res.render("tabPopCentres", {
                    category: tabs.category_key,
                    title: tabs.name,
                    tab_id: tabs.key,
                    contents: tabs
                });
                break;
            case("production_methods"):
                res.render("tabProductionMethods", {
                    category: tabs.category_key,
                    title: tabs.name,
                    tab_id: tabs.key,
                    formattedInputs: productionMethods.parseInputsOutputs(tabs.input_goods),
                    formattedOutputs: productionMethods.parseInputsOutputs(tabs.output_goods),
                    goodsList: goods.getAllGoods(), //so that i didnt have to check in the new pm wether the goods existed it will provide a dropdown. might be inconvenient when its a bigger scale. Too Bad!
                    contents: tabs
                });
                break;
        }
    } else {
        res.sendStatus(404);
    }

})
app.get("/tabs/:tab_category/:tab_id/delete", (req, res) => { //ive decided to do this by get
    const tabs = masterUtil.getTab(req.params.tab_category, req.params.tab_id);
    if (tabs) {
        switch(tabs.category_key){
            case("goods"):
                goods.deleteGD(req.params.tab_id);
                res.redirect(`/tabs`);
                break;
            case("population_centres"):
                populationCentres.deletePC(req.params.tab_id);
                res.redirect(`/tabs`);
                break;
            case("production_methods"):
                productionMethods.deletePM(req.params.tab_id);
                res.redirect(`/tabs`);
                break;
        }
    } else{
        res.sendStatus(404);
    }
})
app.post("/tabs/:tab_category/:tab_id/addData", (req, res) => {
    const tabs = masterUtil.getTab(req.params.tab_category, req.params.tab_id);
    if (!tabs) return res.sendStatus(404);
    masterUtil.handleNew(tabs, req.body, res);
});
app.post("/tabs/:tab_category/:tab_id/editData", (req, res) => {
    const tabs = masterUtil.getTab(req.params.tab_category, req.params.tab_id);
    if (!tabs) return res.sendStatus(404);
    masterUtil.handleEdit(tabs, req.body, res);
});
app.listen(port, () => {
    console.log(`Server slucha on http://localhost:${port}`);
});
