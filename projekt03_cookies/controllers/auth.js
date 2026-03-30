import dept from "../models/management/departments.js";
import user from "../models/management/user.js";
import session from "../models/management/session.js";
export function login_needed (req, res, next) {
    if(res.locals.user == null){
        res.redirect("../login");
        console.log("this here session of the fiend known as" + session.id + " is bloody unauthorised! depart post haste my good sir and login thyself!");
        return;
    }
    next();
}
function verify_editing_access(req, res, next){
  return dept.verify_department_access(res.locals.user.department, req.params.tab_category);
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
    signup_handle
}