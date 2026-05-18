export function validateCSRF(csrf_token, res){
    if (csrf_token != res.locals.session.csrf_token){
        return false;
    }
    return true;
}
export default validateCSRF;