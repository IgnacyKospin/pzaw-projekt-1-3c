import db from "../database.js";
import { randomBytes } from "node:crypto";

const SESSION_COOKIE = "__Host-id";
const ONE_WEEK = 7*24*60*60*1000;
const internal_dboperations = {
    create_session: db.prepare(
        `INSERT INTO meta_session (id, user_id, created_at)
        VALUES (?, ?, ?) RETURNING id, user_id, created_at;`
    ),
    get_session: db.prepare(
        `SELECT id, user_id, created_at from meta_session WHERE id = ?;`
    )
}
export function createSession(user, res){
    let sessionId = randomBytes(8).readBigInt64BE();
    let created_at = Date.now();
    let session = internal_dboperations.create_session.get(sessionId, user, created_at);
    res.locals.session = session;
    res.cookie(SESSION_COOKIE, session.id.toString(), {maxAge: ONE_WEEK, httpOnly: true, secure: true,});
    return session;
}
function sessionHandler(req, res, next){
    let sessionId = req.cookies[SESSION_COOKIE];
    let session = null;
    if(sessionId){
        sessionId.match(/^-?[0-9]+$/) == true ? sessionId = null : sessionId = BigInt(sessionId);
    }
    if(sessionId != null) {
        session = internal_dboperations.get_session.get(sessionId);
    }
    if(session != null){
        res.locals.session = session;
        res.cookie(SESSION_COOKIE, res.locals.session.id.toString(), { maxAge: ONE_DAY, httpOnly: true, secure: true,});
    }
    else{
        session = createSession(null, res);
    }


}
export default {
    createSession,
    sessionHandler
}