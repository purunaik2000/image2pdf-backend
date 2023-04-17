const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: "ap-south-1"
});

module.exports.uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        const s3 = new aws.S3({apiVersion: "2012-10-17"});

        const uploadParams = {
            Bucket: "image-to-pdf-aws",
            Key: Date.now() + file.filename,
            "ContentType": "image/png",
            Body: file.content
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) return reject({ error: err });
            return resolve(data.Location);
        });
    });
}