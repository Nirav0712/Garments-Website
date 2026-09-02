const fs = require('fs');
const path = require('path');
const prisma = require('../config/db');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get media library list
// @route   GET /api/media
// @access  Private/Admin
const getMedia = async (req, res) => {
  try {
    const { search, page = 1, limit = 30 } = req.query;
    const where = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { originalName: { contains: search.trim() } },
        { altText: { contains: search.trim() } },
      ];
    }

    const pageNum = parseInt(page);
    const take = parseInt(limit);
    const skip = (pageNum - 1) * take;

    const [total, media] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / take) || 1,
      media,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching media library' });
  }
};

// @desc    Upload media file(s)
// @route   POST /api/media/upload
// @access  Private/Admin
const uploadMedia = async (req, res) => {
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const files = req.files || [req.file];
    const uploadedRecords = [];

    const isProduction = process.env.NODE_ENV === 'production';

    for (const file of files) {
      let publicUrl = `/uploads/${file.filename}`;

      if (isProduction) {
        const localPath = path.join(__dirname, '../../uploads', file.filename);
        const cloudUrl = await uploadToCloudinary(localPath, 'garments-media');

        if (!cloudUrl) {
          throw new Error('Failed to upload image to Cloudinary');
        }
        publicUrl = cloudUrl;
      }

      const record = await prisma.media.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          url: publicUrl,
          mimeType: file.mimetype,
          size: file.size,
          altText: req.body.altText || file.originalname.split('.')[0],
        },
      });
      uploadedRecords.push(record);
    }

    return res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      file: uploadedRecords[0],
      files: uploadedRecords,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return res.status(500).json({ success: false, message: 'Server error uploading file' });
  }
};

// @desc    Delete media file
// @route   DELETE /api/media/:id
// @access  Private/Admin
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media record not found' });
    }

    if (media.url && media.url.includes('cloudinary.com')) {
      await deleteFromCloudinary(media.url);
    } else {
      // Try deleting physical file
      const filePath = path.join(__dirname, '../../uploads', media.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Could not delete physical file:', err.message);
        }
      }
    }

    await prisma.media.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting media' });
  }
};

module.exports = {
  getMedia,
  uploadMedia,
  deleteMedia,
};
