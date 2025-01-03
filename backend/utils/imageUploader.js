const cloudinary = require('cloudinary').v2;
require('dotenv').config();

exports.uploadImageToCloudinary = async (file, height, quality) => {
    const folder = process.env.FOLDER_NAME;
    const options = { folder }
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


exports.generateImageUploadUrl = () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
    return imageName;
}