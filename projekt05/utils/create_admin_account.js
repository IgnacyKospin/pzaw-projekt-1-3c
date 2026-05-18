import user from "../models/management/user.js";
var args = process.argv.slice(2);
let username = args[0] || "John Administrator";
let password = args[1] || "ManILoveEconomicPlanning";
var perms = {
    admin: "yes"
}
user.create_user(username, password, perms);
console.log("access the admin account at username: '" + username + "' with the password '"+ password+ "'");