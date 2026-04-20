import user from "../models/management/user.js";
let username = "John Administrator";
let password = "ManILoveEconomicPlanning";
var perms = {
    admin: "yes"
}
user.create_user(username, password, perms);
console.log("access the admin account at username: '" + username + "' with the password '"+ password+ "'");