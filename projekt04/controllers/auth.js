import dept from "../models/management/departments.js";
import user from "../models/management/user.js";
import session from "../models/management/session.js";
import { verify } from "argon2";
export function login_needed (req, res, next) {
    if(res.locals.user == null){
        res.redirect("../login");
        console.log("this here session of the fiend known as" + session.id + " is bloody unauthorised! depart post haste my good sir and login thyself!");
        return;
    }
    next();
}
export function admin_gate(req, res, next) {
  if(admin_only(res)){
    next();
  }
  else{
    console.log("user tried to go to admin only. failed.");
    return res.status(403).send();
  }
}
export function verify_department_access(user_department_id, tab_category){
  let user_department = dept.id_to_key(user_department_id);
  return dept.verify_department_access(user_department, tab_category);
}
export function verify_create_access(permissions){
  if(permissions.admin == "yes" || permissions.create == "yes"){
    return true;
  }
  return false;
}
export function verify_update_access(permissions){
  if(permissions.admin == "yes" || permissions.update == "yes"){
    return true;
  }
  return false;
}
export function verify_delete_access(permissions){
  if(permissions.admin == "yes" || permissions.delete == "yes"){
    return true;
  }
  return false;
}
function admin_only(res) {
  if (res.locals.user.permissions.admin == "yes"){
    return true;
  }
  return false;
}
/**
 * 
 * assigns 'can do [x]' params that take into consideration department and permissions. to either display or not display forms.
 */
export function verify_form_permissions(req, res, next){
  res.locals.canUpdateHere = (verify_department_access(res.locals.user.department, req.params.tab_category) && verify_update_access(res.locals.user.permissions));
  res.locals.canCreateHere = (verify_department_access(res.locals.user.department, req.params.tab_category) && verify_create_access(res.locals.user.permissions));
  res.locals.canDeleteHere = (verify_department_access(res.locals.user.department, req.params.tab_category) && verify_delete_access(res.locals.user.permissions));
  next();
}
export async function login_handle(req, res) {
  const form = req.body;
  var error = false;
  if (form) {
    console.log(form.username);
    let user_id = await user.checkPassword(form.username, form.password);
    if (user_id == null) {
      console.log("Incorrect username and or password");
      error = true;
    } else {
      session.createSession(user_id, res);
      res.redirect("/tabs");
      return;
    }
  }
  res.render("login/login", ({error: error}));
}

export async function signup_handle(req, res){
    const form = req.body;
    var err = [];
    if(form){
      if(!form.username.match(/^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)){
        err.push("INcorrect username");
      }
      if(!form.password.match(/^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)){
        err.push("Incorrect password");
      }
      if(user.get_by_name(form.username)){
        err.push("Username taken.");
      }
    }

    if(err.length > 0){
      res.render("login/signup", ({errors: err}));
    }
    let userr = await user.create_user(form.username, form.password);
    console.log(userr);
    session.createSession(userr.id, res);
    res.redirect("/tabs");
}
export function logout(res){
  if (res.locals.user != null) {
    session.murder_session(res);
  }
  res.redirect("/");
}
export default {
  login_needed,
  admin_gate,
  login_handle,
  signup_handle,
  verify_department_access,
  verify_create_access,
  verify_update_access,
  verify_delete_access,
  verify_form_permissions,
  logout,
}