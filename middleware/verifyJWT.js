const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    if(!authHeaders) {
        return res.sendStatus(401);
    } else {
        console.log(authHeaders)
    }

    const token = authHeaders.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decode) => {
            if (err) return res.sendStatus(403); //Invalid Token
            req.user == decode.username;
            next()
        }
    )
}

module.exports = verifyJWT