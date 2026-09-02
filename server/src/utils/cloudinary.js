const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath, folder = 'garments') => {
    try {
        if (!localFilePath) return null;

        // Upload image to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: folder,
        });

        // Remove local file after successful upload
        try {
            fs.unlinkSync(localFilePath);
        } catch (err) {
            console.warn('Failed to delete temporary local file', err);
        }

        return response.secure_url;
    } catch (error) {
        // Attempt to clean up temp file even if Cloudinary fails
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (err) { }

        console.error('Cloudinary Upload Error:', error);
        return null;
    }
};

const deleteFromCloudinary = async (publicUrl) => {
    try {
        if (!publicUrl || !publicUrl.includes('cloudinary.com')) return null;

        // Extract public ID from URL
        // Format usually: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<filename>.<ext>
        const urlParts = publicUrl.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const filenameBody = lastPart.split('.')[0];

        let publicId = filenameBody;

        // Attempt to extract folder structure if present
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
            // urlParts[uploadIndex+1] is usually version
            // The rest is folder/filename
            const folderParts = urlParts.slice(uploadIndex + 2, urlParts.length - 1);
            if (folderParts.length > 0) {
                publicId = `${folderParts.join('/')}/${filenameBody}`;
            }
        }

        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        return null;
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};
