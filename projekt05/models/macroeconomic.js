import db from "./database.js";
import goods from "./goods.js";
const internal_dboperations = {
    goods_amount: db.prepare("SELECT COUNT(*) as sum FROM goods;"),
    get_most_valuable: db.prepare("SELECT key, name, unit_price, yearly_production, yearly_consumption, yearly_production*unit_price AS worth FROM goods ORDER BY worth LIMIT ?;"),
    get_highest_deficit: db.prepare("SELECT key, name, unit_price, yearly_production, yearly_consumption, (yearly_production - yearly_consumption) as yearly_balance from goods order by yearly_balance ASC limit ?")
};
/**
 * 
 * aggregates the sum of all production and consumption, returns that and the balance of production/consumption.
 */
function aggregate_goods_value(){
    let all_goods = goods.exportViews();
    let total_sell_value = 0;
    let total_buy_value = 0;
    all_goods.forEach(good => {
        total_sell_value += Number(good.yearly_production) * Number(good.unit_price);
        total_buy_value += Number(good.yearly_consumption) * Number(good.unit_price);
    });
    const market_balance = total_sell_value - total_buy_value;
    return {
        "sell_order_value": total_sell_value,
        "buy_order_value": total_buy_value,
        "market_balance": market_balance
    }
}
/**
 * returns the most valuable produced goods (after consumption)
 */
function get_most_valuable_produced_goods(top){
    let most_valuable = internal_dboperations.get_most_valuable.all(top);
    return {"most_valuable": most_valuable};
}
/**
 * returns the goods with the highest deficit
 */
function get_highest_deficit_goods(top){
    let highest_deficits = internal_dboperations.get_highest_deficit.all(top);
    return {"highest_deficits": highest_deficits};
}
export function return_macroeconomic_overview(){
    const top = Math.ceil(Number(internal_dboperations.goods_amount.get().sum / 2n));
    console.log(top);
    let most_valuable = get_most_valuable_produced_goods(top);
    let highest_deficits = get_highest_deficit_goods(top);
    let total_value = aggregate_goods_value();
    return {...most_valuable, ...highest_deficits, ...total_value};
}
export default {
    return_macroeconomic_overview
}