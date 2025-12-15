//the database creation is stored here because i think it is too complex for it to be in several files spread out so i'll just call it 
import db from "./database.js";
import goods from "./goods.js";
import population_centres from "./population_centres.js";
import production_methods from "./production_methods.js";
export function fillDatabasesWithBaseInfo(){
    goods.goodsConstructor(); 
    population_centres.populationCentresConstructor();
    production_methods.productionMethodsConstructor();
}
export default{
    fillDatabasesWithBaseInfo
};