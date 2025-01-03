const { uploadImageToCloudinary } = require("../utils/imageUploader");


// upload blog banner functionality
exports.uploadBlogBanner = async (req, res) => {
    const banner = req.files.banner;
    const imageData = await uploadImageToCloudinary(banner);

    if (imageData) {
        return res.json({
            success: true,
            message: "Blog banner uploaded successfully",
            uploadUrl: imageData.secure_url,
        });
    }
    
    return res
        .status(500)
        .json({ success: false, message: "Failed to upload blog banner" });
};
