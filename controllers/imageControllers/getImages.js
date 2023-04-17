const { sendResponse } = require('../help/response');
const db = require('../mysql/query');
const { authentication } = require('../help/auth');

exports.handler = async function (event) {
    try {
        const decoded = await authentication(event.headers.Authorization);
        if (!decoded) return sendResponse(400, false, 'Login first');
        let images = await db.do('select * from image where user_id=?', [decoded.userId]);
        if (!images.length) return sendResponse(200, true, 'No images found');
        const ids = images.map(e => e.image_id);
        let urls = await db.do(`select * from image_url where image_id in (${ids.join()})`);
        for (let e of urls) {
            let index = images.findIndex(obj => obj.image_id == e.image_id);
            if (images[index].urls) images[index].urls.push(e);
            else images[index].urls = [e];
        }
        images = images.reverse();
        return sendResponse(200, true, 'success', images);
    } catch (error) {
        return sendResponse(500, false, error.message);
    }
}