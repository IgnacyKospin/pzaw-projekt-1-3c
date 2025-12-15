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
    console.log(tabs);
    if (tabs) {
        res.render("tab", {
            category: tabs.category_key,
            title: tabs.name,
            tab_id: tabs.key,
            contents: tabs
        });
    } else {
        res.sendStatus(404);
    }

})
app.post("/tabs/:tab_category/:tab_id/addData", (req, res) => {
    const tabs = masterUtil.getTab(req.params.tab_category, req.params.tab_id);
    if (!tabs) return res.sendStatus(404);
    masterUtil.handleNew(tabs, req.body, res);
});

app.listen(port, () => {
    console.log(`Server slucha on http://localhost:${port}`);
});
