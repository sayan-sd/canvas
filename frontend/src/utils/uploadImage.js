import axios from 'axios';

export const uploadImage = async (file) => {
    try {
        // create FormData object (as BE take form files)
        const formData = new FormData();
        formData.append('banner', file);

        const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/editor/get-upload-url`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // return the upload URL if successful
        if (response.data.success) {
            return {
                success: true,
                url: response.data.uploadUrl,
                message: response.data.message,
            };
        } else {
            throw new Error(response.data.message || 'Upload failed');
        }
    }
    catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to upload image',
        };
    }
};