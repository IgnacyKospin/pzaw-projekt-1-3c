import db from "./database.js";
import { randomBytes } from "node:crypto";
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
    res.local.session = session;
    res.cookie(SESSION_COOKIE, session.id.toString(), {maxAge: ONE_WEEK, httpOnly: true, secure: true,});
    return session;
}