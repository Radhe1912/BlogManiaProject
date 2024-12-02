const { validateToken } = require("../services/authentication");

// this will check if the user exists by checking the value of cookie

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const cookieValue = req.cookies[cookieName];
        if(!cookieValue){
            return next();
        }

        try{
            const userPayload = validateToken(cookieValue);
            req.user = userPayload;
        }catch(error){

        }
        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie,
}