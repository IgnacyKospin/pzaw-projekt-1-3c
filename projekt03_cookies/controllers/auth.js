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
  let nextUrl = req.query.next;
  const form = req.body;
  if (nextUrl) {
    form.action = `/login?next=${encodeURIComponent(nextUrl)}`;
  }

  if (form) {
    console.log(form.username);
    let user_id = await user.checkPassword(form.username, form.password);
    if (user_id == null) {
      console.log("Incorrect username and or password");
    } else {
      session.createSession(user_id, res);
      res.redirect(nextUrl);
      return;
    }
  }
  res.render("login/login");
}

export async function signup_handle(req, res){
    const form = req.body;
    let userr = await user.create_user(form.username, form.password);
    return userr;
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