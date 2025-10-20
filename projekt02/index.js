import express from "express";
const port = 8000;
const app = express();
const card_categories = ["test1", "test2"];

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/cards/categories/", (req, res) => {
    res.render("categories", {
        title: "Kategorie",
        categories: card_categories,
    });
});

app.listen(port,()=>{
    console.log(`Serwer slucha na http://localhost:${port}`);
});