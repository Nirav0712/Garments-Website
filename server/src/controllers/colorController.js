const prisma = require('../config/db');

// @desc    Get all colors
// @route   GET /api/colors
// @access  Public
const getColors = async (req, res) => {
  try {
    const { all } = req.query;
    const where = {};
    if (!all) {
      where.isActive = true;
    }

    const colors = await prisma.color.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return res.status(200).json({ success: true, colors });
  } catch (error) {
    console.error('Error fetching colors:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching colors' });
  }
};

// @desc    Create color
// @route   POST /api/colors
// @access  Private/Admin
const createColor = async (req, res) => {
  try {
    const { name, hexCode, displayOrder, isActive } = req.body;
    if (!name || !hexCode) {
      return res.status(400).json({ success: false, message: 'Color name and HEX code are required' });
    }

    const existing = await prisma.color.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A color with this name already exists' });
    }

    const color = await prisma.color.create({
      data: {
        name,
        hexCode: hexCode.startsWith('#') ? hexCode : `#${hexCode}`,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({ success: true, message: 'Color created successfully', color });
  } catch (error) {
    console.error('Error creating color:', error);
    return res.status(500).json({ success: false, message: 'Server error creating color' });
  }
};

// @desc    Update color
// @route   PUT /api/colors/:id
// @access  Private/Admin
const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hexCode, displayOrder, isActive } = req.body;

    const existing = await prisma.color.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }

    const color = await prisma.color.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        hexCode: hexCode !== undefined ? (hexCode.startsWith('#') ? hexCode : `#${hexCode}`) : existing.hexCode,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : existing.displayOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    return res.status(200).json({ success: true, message: 'Color updated successfully', color });
  } catch (error) {
    console.error('Error updating color:', error);
    return res.status(500).json({ success: false, message: 'Server error updating color' });
  }
};

// @desc    Delete color
// @route   DELETE /api/colors/:id
// @access  Private/Admin
const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.color.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }

    await prisma.color.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Color deleted successfully' });
  } catch (error) {
    console.error('Error deleting color:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting color' });
  }
};

module.exports = {
  getColors,
  createColor,
  updateColor,
  deleteColor,
};
