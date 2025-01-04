const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const fs = require('fs');

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

    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        
        // delete the temporary file
        fs.unlinkSync(file.tempFilePath);
        
        return result;
    }
    catch (error) {
        fs.unlinkSync(file.tempFilePath);
        throw error;
    }
}
