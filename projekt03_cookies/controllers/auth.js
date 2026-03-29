export function login_needed (req, res, next) {
    if(res.locals.user == null){
        res.redirect("http://localhost:1234/");
        console.log("unauthorised! depart post haste my good sir and login thyself!");
        return;
    }
    next();
}
function verify_editing_access(req, res, next){

}
export default {
    login_needed,

}