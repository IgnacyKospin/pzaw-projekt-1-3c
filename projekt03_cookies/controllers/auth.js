import dept from "../models/management/departments.js";
export function login_needed (req, res, next) {
    if(res.locals.user == null){
        //res.redirect("http://localhost:1234/");
        console.log("unauthorised! depart post haste my good sir and login thyself!");
        //return;
    }
    next();
}
function verify_editing_access(req, res, next){
    dept.verify_department_access(res.locals.user.department, req.params.tab_category);
}
export default {
    login_needed,

}