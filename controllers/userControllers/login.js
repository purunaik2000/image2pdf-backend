const { sendResponse } = require('../help/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../mysql/query');

exports.handler = async (event) => {
    const { email, password } = await JSON.parse(event.body);
    if (!email) return sendResponse(400, false, 'Please provide email');
    if (!password) return sendResponse(400, false, 'Please provide password');
    let user = await db.do(`select * from user where email='${email}'`);
    if (!user.length) return sendResponse(400, false, `${email} is not registered`);
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) return sendResponse(400, false, 'Incorrect password');
    const token = jwt.sign(
        {
            userId: user[0].user_id,
            name: user[0].name
        },
        'secret-signature'
    )
    const data = {
        userId: user[0].user_id,
        name: user[0].name,
        email: user[0].email,
        mobile: user[0].mobile,
        token: token
    }
    return sendResponse(200, true, 'Logged in successfully', data);
}