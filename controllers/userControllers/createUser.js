const { sendResponse } = require('../help/response');
const bcrypt = require('bcrypt');
const db = require('../mysql/query');

exports.handler = async (event) => {
    let body = await JSON.parse(event.body);
    let { name, email, mobile, password } = body;
    const fields = ['name', 'email', 'mobile', 'password'];
    for (let field of fields) if (!body[field]) return sendResponse(400, false, `Please provide ${field}`);
    let user = await db.do('select * from user where email=? or mobile=?', [email, mobile]);
    if (user.length) {
        if (user[0].email == email) return sendResponse(400, false, `${email} is already registered`);
        return sendResponse(400, false, `${mobile} is already registered`);
    }
    password = await bcrypt.hash(body.password, 10);
    console.log(password.length);
    const values = [[name, email, mobile, password]];
    const newUser = await db.do('insert into user (name, email, mobile, password) values ?', [values]);
    const data = { userId: newUser.insertId, name, email, mobile };
    return sendResponse(201, true, 'Your profile created successfully', data);
}