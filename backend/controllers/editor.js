const { uploadImageToCloudinary } = require("../utils/imageUploader");


// upload blog image functionality
exports.uploadBlogImage = async (req, res) => {
    const img = req.files.banner;
    const imageData = await uploadImageToCloudinary(img);

    if (imageData) {
        return res.json({
            success: true,
            message: "Image uploaded successfully",
            uploadUrl: imageData.secure_url,
        });
    }
    
    return res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });
};
