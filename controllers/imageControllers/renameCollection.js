const { sendResponse } = require('../help/response');
const db = require('../mysql/query');

exports.handler = async function (event) {
    try {
        let body = await JSON.parse(event.body);
        let { image_id, newName } = body;
        await db.do('update image set name=? where image_id=?', [newName, image_id]);
        return sendResponse(200, true, 'updated');
    } catch (error) {
        return sendResponse(500, false, error.message);
    }
}