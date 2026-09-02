const prisma = require('../config/db');

// @desc    Get all sizes
// @route   GET /api/sizes
// @access  Public
const getSizes = async (req, res) => {
  try {
    const { all } = req.query;
    const where = {};
    if (!all) {
      where.isActive = true;
    }

    const sizes = await prisma.size.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return res.status(200).json({ success: true, sizes });
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching sizes' });
  }
};

// @desc    Create size
// @route   POST /api/sizes
// @access  Private/Admin
const createSize = async (req, res) => {
  try {
    const { name, code, displayOrder, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Size name is required' });
    }

    const existing = await prisma.size.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A size with this name already exists' });
    }

    const size = await prisma.size.create({
      data: {
        name,
        code: code || name,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({ success: true, message: 'Size created successfully', size });
  } catch (error) {
    console.error('Error creating size:', error);
    return res.status(500).json({ success: false, message: 'Server error creating size' });
  }
};

// @desc    Update size
// @route   PUT /api/sizes/:id
// @access  Private/Admin
const updateSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, displayOrder, isActive } = req.body;

    const existing = await prisma.size.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Size not found' });
    }

    const size = await prisma.size.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        code: code !== undefined ? code : existing.code,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : existing.displayOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    return res.status(200).json({ success: true, message: 'Size updated successfully', size });
  } catch (error) {
    console.error('Error updating size:', error);
    return res.status(500).json({ success: false, message: 'Server error updating size' });
  }
};

// @desc    Delete size
// @route   DELETE /api/sizes/:id
// @access  Private/Admin
const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.size.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Size not found' });
    }

    await prisma.size.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Size deleted successfully' });
  } catch (error) {
    console.error('Error deleting size:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting size' });
  }
};

module.exports = {
  getSizes,
  createSize,
  updateSize,
  deleteSize,
};
