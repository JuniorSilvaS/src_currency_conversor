require('dotenv').config();
const jwt = require('jsonwebtoken');

async function jwtMiddlaware(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).json({ msg: "the token is required" });
    };
    try {
        jwt.verify(token, process.env.SECRET_JWT);
        next();
    }catch(e) {
        res.status(400).json({ msg :  "invalid token" });
    };
    
};

module.exports = jwtMiddlaware;