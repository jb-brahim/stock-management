const cloudinary = require('cloudinary').v2;
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

/**
 * @desc    Upload image to Cloudinary (or return fallback URL)
 * @route   POST /api/upload
 * @access  Private
 */
const uploadImage = async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!image) {
      return errorResponse(res, 400, 'Image data is required');
    }

    // If Cloudinary environment variables are configured
    if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'stockly_products',
        resource_type: 'auto',
      });

      return successResponse(res, 200, 'Image uploaded successfully to Cloudinary', {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        isCloudinary: true,
      });
    }

    // Fallback: If Cloudinary keys are not configured in .env yet, return image
    return successResponse(res, 200, 'Image processed successfully', {
      url: image,
      isCloudinary: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};
