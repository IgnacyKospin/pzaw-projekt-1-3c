import db from "../database.js";
import dept from "./departments.js";
import { randomBytes } from "node:crypto";
import userImport from "./user.js";
const SESSION_COOKIE = "__Host-id";
const ONE_WORK_SHIFT = 1000*60*60*8;
const internal_dboperations = {
    create_session: db.prepare(
        `INSERT INTO meta_session (id, user_id, csrf_token, created_at)
        VALUES (?, ?, ?, ?) RETURNING id, user_id, csrf_token, created_at;`
    ),
    get_session: db.prepare(
        `SELECT id, user_id, csrf_token, created_at from meta_session WHERE id = ?;`
    ),
    delete_session: db.prepare(`DELETE FROm meta_session WHERE id = ?`)
}
export function createSession(user, res){
    let sessionId = randomBytes(8).readBigInt64BE();
    let csrfToken = randomBytes(24).toString("base64");
    let created_at = Date.now();
    let session = internal_dboperations.create_session.get(sessionId, user, csrfToken, created_at);
    res.locals.session = session;
    if(session.user_id == null){
        console.log("null user id.");
        session.user = null;
    }
    else {
        console.log("Not null user id, equivalent to " + session.user_id);
        let test = userImport.get_user(session.user_id);
        test.department_name = dept.id_to_name(test.department);
        console.log(test);
        session.user = test;
    }
    res.cookie(SESSION_COOKIE, session.id.toString(), {maxAge: ONE_WORK_SHIFT, httpOnly: true, secure: true,});
    return session;
}
function sessionHandler(req, res, next){
    let sessionId = req.cookies[SESSION_COOKIE];
    let session = null;
    if(sessionId != null){
        if(!sessionId.match(/^-?[0-9]+$/)){
            sessionId = null;
        }
        else {
            sessionId = BigInt(sessionId);
        }
    }
    if(sessionId != null) {
        console.log("Session id exists. Setting session to found.");
        session = internal_dboperations.get_session.get(sessionId);
    }
    if(session != null){
        console.log("Existing session assigned.");
        res.locals.session = session;
        if (session.user_id) {
            console.log("Found user id. Assigning user.");
            res.locals.user = userImport.get_user(session.user_id);
            let department_name = dept.id_to_name(res.locals.user.department);
            res.locals.user.department_name = department_name;
        } else {
            res.locals.user = null;
        }
        res.cookie(SESSION_COOKIE, res.locals.session.id.toString(), { maxAge: ONE_WORK_SHIFT, httpOnly: true, secure: true,});
    }
    else{
        console.log("New session being created");
        session = createSession(null, res);
    }
    setImmediate(printUserSession);
    next();
    function printUserSession() {
        console.info(
        "Session:",
        session.id,
        "user:",
        res.locals.user,
        "created at:",
        new Date(Number(session.created_at)).toISOString()
        );
    }
}
export function murder_session(res) {
  let sessionId = res.locals.session.id;
  internal_dboperations.delete_session.run(sessionId);
  res.cookie(SESSION_COOKIE, sessionId.toString(), {
    maxAge: 0,
    httpOnly: true,
    secure: true,
  });
  console.log("Session executed");
}
export default {
    createSession,
    sessionHandler,
    murder_session
}