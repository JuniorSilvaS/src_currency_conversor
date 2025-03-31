require('dotenv').config();
const { neon } = require("@neondatabase/serverless");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const sql = neon(process.env.DATABASE_URL);

const version = async (req, res) => {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).json({ version });

};

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name) {
        return res.status(400).json({ msg: "the name is required" });
    };
    if (!email) {
        return res.status(400).json({ msg: "the email is required" });
    };
    if (!password) {
        return res.status(400).json({ msg: "the password is required" });
    };
    if (name.length <= 3 || name.length >= 30) {
        return res.status(400).json({ msg: "the name user required more that 3 and less that 100 caracters" });
    };
    if (!email.includes('@')) {
        return res.status(400).json({ msg: "the email is invalid you need to put a valid email" });
    };
    if (name.length <= 3 || name.length >= 100) {
        return res.status(400).json({ msg: "the name user required more that 3 and less that 100 caracters" });
    };

    try {
        const userExits = await sql`
            SELECT id FROM users WHERE email = ${email}
        `;

        if (userExits.length > 0) {
            return res.status(400).json({ msg: "this user already exists" });
        };

        const salt = 10;
        const passwordWithHash = await bcrypt.hash(password, salt);

        await sql`
            INSERT INTO "users"
                (name , email , password, avatar)
                    values (${name},  ${email}, ${passwordWithHash}, ${process.env.AVATAR_USER_DEFAULT})
        `;
        return res.status(201).json({ msg: "user create with successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ msg: "an internal error server" });
    };
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExits = await sql`
        SELECT id FROM users WHERE email = ${email}
        `;
        if (userExits.length === 0) {
            return res.status(400).json({ msg: "user not found" });
        };
        const passwordFromDataBase = await sql`
        SELECT password FROM users WHERE email = ${email}
        `;
        const passwordMatch = await bcrypt.compare(password, passwordFromDataBase[0].password);
        if (!passwordMatch) {
            return res.status(400).json({ msg: "the password's incorrect" });
        };
        const user = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;

        const token = jwt.sign({
            user
        }, process.env.SECRET_JWT,
        );
        return res.status(200).json({ token });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ msg: "internal error server." });
    };
};

const profileUser = async (req, res) => {
    const token = req.header('Authorization');
    const user = jwt.verify(token, process.env.SECRET_JWT);
    return res.status(201).json({ user });
};

module.exports = {
    version,
    createUser,
    loginUser,
    profileUser
};