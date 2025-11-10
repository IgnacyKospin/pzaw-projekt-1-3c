import express from "express";
import goods from "./models/goods.js";
import populationCentres from "./models/population_centres.js";
import productionMethods from "./models/production_methods.js";
import masterUtil from "./models/masterUtil.js";
const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/tabs", (req, res) => {
    res.render("tabs", 
    {
        title: "Economic Categories",
        listOfTabs: [
            {
                title: "Goods",
                categories: goods.exportViews()
            },
            {
                title: "Population Centres",
                categories: populationCentres.exportViews()
            },
            {
                title: "Production Methods",
                categories: productionMethods.exportViews()
            }
        ]
    }
    );
});

app.get("/tabs/:tab_id", (req, res) => {
    const tab = masterUtil.getTab(req.params.tab_id);
    if (tab) {
        res.render("tab", {
            title: tab.name,
        });
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Server slucha on http://localhost:${port}`);
});