import db from "./database.js";
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
        "subcategory_key"	TEXT NOT NULL UNIQUE,
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
        "key" TEXT NOT NULL UNIQUE,
        "yearly_production"	NUMERIC,
        "yearly_consumption"	NUMERIC,
        "perKilogram_price"	NUMERIC NOT NULL,
        CONSTRAINT "connectTocategory" FOREIGN KEY("category_key") REFERENCES "economic_categories"("key"),
        CONSTRAINT "connectToSubcategory" FOREIGN KEY("subcategory_key") REFERENCES "subcategories"("subcategory_key")
    );`;
    db.exec(queryCreateGoods);
}
function createPopulationCentres(){
    const queryCreatepopulation_centres = `
    CREATE TABLE IF NOT EXISTS "population_centres" (
        "category_key"	TEXT NOT NULL,
        "name"	TEXT NOT NULL,
        "id"	INTEGER NOT NULL,
        "key"	TEXT NOT NULL UNIQUE,
        "population" INTEGER NOT NULL,
        PRIMARY KEY("id"),
        CONSTRAINT "connectToCategory" FOREIGN KEY("category_key") REFERENCES "economic_categories"("key")
    );`;
    db.exec(queryCreatepopulation_centres);
    const queryCreateFacilities = `
    CREATE TABLE IF NOT EXISTS "facilities" (
        "city_id"	INTEGER NOT NULL,
        "facility_id" INTEGER PRIMARY KEY,
        "facility_name" TEXT NOT NULL,
        "production_method_key"	TEXT NOT NULL,
        "facility_amount"	INTEGER NOT NULL,
        CONSTRAINT "connectToCity" FOREIGN KEY("city_id") REFERENCES "population_centres"("id") on delete cascade on update cascade, 
        CONSTRAINT "connectToProductionMethod" FOREIGN KEY("production_method_key") REFERENCES "production_methods"("key") on delete cascade on update cascade
    );`;
    db.exec(queryCreateFacilities);
}
function createProductionMethods(){
    const queryCreateProductionMethods = `
    CREATE TABLE IF NOT EXISTS "production_methods" (
        "category_key"	TEXT NOT NULL,
        "name"	TEXT NOT NULL,
        "key"	TEXT NOT NULL UNIQUE,
        "input_goods"	TEXT,
        "output_goods"	TEXT,
        "expected_employment"	TEXT,
        CONSTRAINT "connectToCategory" FOREIGN KEY("category_key") REFERENCES "economic_categories"("key")
    );`;
    db.exec(queryCreateProductionMethods);
}
function createSessions(){
    const queryCreateSessions = `CREATE TABLE IF NOT EXISTS meta_session (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        csrf_token TEXT NOT NULL,
        created_at INTEGER
    ) STRICT`;
     db.exec(queryCreateSessions);
}
function createUsers(){
    const queryCreateUsers = `CREATE TABLE IF NOT EXISTS meta_users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        permissions TEXT DEFAULT NULL,
        department INTEGER,
        passhash TEXT,
        created_at TEXT,
        CONSTRAINT "departmentConnection" FOREIGN KEY("department") REFERENCES "meta_departments"("id") on delete cascade on update cascade
    )`;
    /**
     * the design philosophy iwth the access controls is that we can have a person who works only on goods, and has editing rights. so they only have the editing rights on the associated department.
     */
    db.exec(queryCreateUsers);
}
function createDepartments(){
    /**
     * many-to-many relationship table. since a department can have multiple jurisdictions, and so can a field of economics.
     */
    const queryCreateDepts = `CREATE TABLE IF NOT EXISTS meta_departments (id INTEGER PRIMARY KEY, department_name TEXT UNIQUE, key TEXT UNIQUE);`
    const queryCreatePivotDeptsToCategories = `CREATE TABLE IF NOT EXISTS meta_department_relations (
    department_key TEXT NOT NULL,
    category_key TEXT NOT NULL,
    CONSTRAINT "connectToCategory" FOREIGN KEY("category_key") REFERENCES "economic_categories"("key") on delete cascade on update cascade, 
    CONSTRAINT "connectToDepartment" FOREIGN KEY("department_key") REFERENCES "meta_departments"("key") on delete cascade on update cascade
    );`;
    db.exec(queryCreateDepts);
    db.exec(queryCreatePivotDeptsToCategories);
}
createCategories();
createProductionMethods();
createPopulationCentres();
createGoods();
createDepartments();
createUsers();
createSessions();
function createDatabases(){
    console.log("Because apparently import statements execute first I had to figure out a method to get the DB created first so I had to resort to not making the creation a function. So here is a log to show the effects that the greed of mankind brings.\n 'there where i have stood the grass [code] will never grow [make sense] again' - attilla the hun")
}
export default {
    createDatabases
}