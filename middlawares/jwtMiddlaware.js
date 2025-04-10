require('dotenv').config();
const jwt = require('jsonwebtoken');

async function jwtMiddlaware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ msg: "the token is required" });
    };
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        console.log(decoded);
        req.user = decoded.user;
        next();
    }catch(e) {
        res.status(400).json({ msg :  "invalid token" });
    };
    
};

module.exports = jwtMiddlaware;