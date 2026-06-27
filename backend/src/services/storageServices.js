const Imagekit = require('imagekit')
require('dotenv').config()
const client = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

const uploadFile = async (file) => {
    if (!file) return null;
 
    const result = await client.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "Project_Urban_Shop/"
    })
    return result.url;
}

module.exports = uploadFile