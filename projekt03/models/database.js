//the database creation is stored here because i think it is too complex for it to be in several files spread out so i'll just call it 
const db_path = "./db.sqlite";
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(db_path);
function createCategories(){
    const queryCategories = `
    CREATE TABLE IF NOT EXISTS "economic_categories" (
        "name"	TEXT NOT NULL,
        "key"	TEXT NOT NULL UNIQUE,
        "id"	INTEGER NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
    );`;
    db.exec(queryCategories);
    const querySubcategories = `
    CREATE TABLE IF NOT EXISTS "subcategories" (
        "category_key"	TEXT NOT NULL,
        "subcategory_key"	TEXT NOT NULL,
        "subcategory_name"	TEXT NOT NULL,
        PRIMARY KEY("subcategory_key"),
        CONSTRAINT "connectToCategory" FOREIGN KEY("category_key") REFERENCES "economic_categories"("key")
    );`;
    db.exec(querySubcategories);
}
function createGoods(){
    const queryCreateGoods = `
    CREATE TABLE IF NOT EXISTS "goods" (
        "category_key"	TEXT,
        "subcategory_key"	TEXT NOT NULL,
        "name"	TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "yearly_production"	NUMERIC,
        "yearly_consumption"	NUMERIC,
        "perKilogram_price"	NUMERIC NOT NULL,
        CONSTRAINT "connectTocategory" FOREIGN KEY("category_key") REFERENCES "",
        CONSTRAINT "connectToSubcategory" FOREIGN KEY("subcategory_key") REFERENCES ""
    );`;
    db.exec(queryCreateGoods);
}
function createPopulationCentres(){
    const queryCreateCities = `
    CREATE TABLE IF NOT EXISTS "cities" (
        "category_key"	TEXT NOT NULL,
        "name"	TEXT NOT NULL,
        "id"	INTEGER NOT NULL,
        "key"	TEXT NOT NULL,
        PRIMARY KEY("id"),
        CONSTRAINT "connectToCategory" FOREIGN KEY("category_key") REFERENCES ""
    );`;
    db.exec(queryCreateCities);
    const queryCreateFacilities = `
    CREATE TABLE IF NOT EXISTS "facilities" (
        "city_id"	INTEGER NOT NULL,
        "facility_key" TEXT NOT NULL,
        "facility_name" TEXT NOT NULL,
        "production_method_key"	TEXT NOT NULL,
        "facility_amount"	INTEGER NOT NULL,
        CONSTRAINT "connectToCity" FOREIGN KEY("city_id") REFERENCES "cities"("id"),
        CONSTRAINT "connectToProductionMethod" FOREIGN KEY("production_method_key") REFERENCES ""
    );`;
    db.exec(queryCreateFacilities);
}
function createProductionMethods(){
    const queryCreateProductionMethods = `
    CREATE TABLE IF NOT EXISTS "production_methods" (
        "category_key"	TEXT NOT NULL,
        "name"	TEXT NOT NULL,
        "key"	TEXT NOT NULL,
        "input_goods"	TEXT,
        "output_goods"	TEXT,
        "expected_employment"	TEXT,
        CONSTRAINT "connectToCategory" FOREIGN KEY("category_key") REFERENCES ""
    );`;
    db.exec(queryCreateProductionMethods);
}
export function createDatabases(){
    //i tried to follow the order that the commands were in the sql export file
    createPopulationCentres();
    createCategories();
    createGoods();
    createProductionMethods();
}
export default{
    createDatabases
};