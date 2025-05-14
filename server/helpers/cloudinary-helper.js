const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error("Error while uploading to cloudinary", error);
    throw new Error("Error while uploading to cloudinary");
  }
};

const uploadVideoToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video'
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Error while uploading video to cloudinary", error);
    throw new Error("Error while uploading video to cloudinary");
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
      await cloudinary.uploader.destroy(publicId);
  } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
  }
};

module.exports = { uploadToCloudinary, uploadVideoToCloudinary, deleteFromCloudinary };