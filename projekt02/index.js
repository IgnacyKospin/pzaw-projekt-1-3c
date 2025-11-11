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

app.get("/tabs/:tab_id", (req, res) => {
    const tabs = masterUtil.getTab(req.params.tab_id);
    if (tabs) {
        res.render("tab", {
            category: tabs.category,
            title: tabs.name,
            contents: tabs.contents
        });
    } else {
        res.sendStatus(404);
    }
});
/*app.post("/tabs:/:tab_id/addData", (req, res) => {
    const tabs = masterUtil.getTab(req.params.tab_id);
    if (!tabs) {
        res.sendStatus(404);
    } 
    else {
        let card_data = {
            front: req.body.front,
            back: req.body.back,
            category_id: category_id
        };
        var errors = masterUtil.validateData(card_data, category_id);
        if(errors.length == 0){
            res.redirect(`/tabs/${tabs.id}`);
        }
        else{
            res.status(400);
            res.render("new_card", {
                errors,
                title: "Nowa fiszka",
                front: req.body.front,
                back: req.body.back,
                category: {
                    id: category_id,
                },
            });
        }
    }
});*/
app.listen(port, () => {
    console.log(`Server slucha on http://localhost:${port}`);
});