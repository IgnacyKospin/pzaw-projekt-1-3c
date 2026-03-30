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
export function verify_department_access(user_department_id, tab_category){
  let user_department = dept.id_to_key(user_department_id).key;
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
export default {
  login_needed,
  login_handle,
  signup_handle,
  verify_department_access,
  verify_create_access,
  verify_update_access,
  verify_delete_access
}