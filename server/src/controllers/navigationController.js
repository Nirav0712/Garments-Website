const prisma = require('../config/db');

// @desc    Get navigation items (Header and Footer)
// @route   GET /api/navigation
// @access  Public
const getNavigation = async (req, res) => {
  try {
    const { all } = req.query;
    const where = {};
    if (!all) {
      where.isActive = true;
    }

    const items = await prisma.navigationItem.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    const header = items.filter((item) => item.location === 'HEADER');
    const footer = items.filter((item) => item.location === 'FOOTER');

    // Group footer items by column
    const footerColumns = {};
    footer.forEach((item) => {
      const col = item.column || 'General';
      if (!footerColumns[col]) {
        footerColumns[col] = [];
      }
      footerColumns[col].push(item);
    });

    return res.status(200).json({
      success: true,
      header,
      footer,
      footerColumns,
      items,
    });
  } catch (error) {
    console.error('Error getting navigation:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching navigation' });
  }
};

// @desc    Create navigation item
// @route   POST /api/navigation
// @access  Private/Admin
const createNavigationItem = async (req, res) => {
  try {
    const { label, url, location, displayOrder, isActive, column } = req.body;

    if (!label || !url) {
      return res.status(400).json({ success: false, message: 'Label and URL are required' });
    }

    const item = await prisma.navigationItem.create({
      data: {
        label,
        url,
        location: location || 'HEADER',
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        column: column || (location === 'FOOTER' ? 'Explore Products' : null),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Navigation item created successfully',
      item,
    });
  } catch (error) {
    console.error('Error creating navigation item:', error);
    return res.status(500).json({ success: false, message: 'Server error creating navigation link' });
  }
};

// @desc    Update navigation item
// @route   PUT /api/navigation/:id
// @access  Private/Admin
const updateNavigationItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, url, location, displayOrder, isActive, column } = req.body;

    const existing = await prisma.navigationItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Navigation item not found' });
    }

    const item = await prisma.navigationItem.update({
      where: { id },
      data: {
        label: label !== undefined ? label : existing.label,
        url: url !== undefined ? url : existing.url,
        location: location !== undefined ? location : existing.location,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : existing.displayOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        column: column !== undefined ? column : existing.column,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Navigation item updated successfully',
      item,
    });
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return res.status(500).json({ success: false, message: 'Server error updating navigation link' });
  }
};

// @desc    Delete navigation item
// @route   DELETE /api/navigation/:id
// @access  Private/Admin
const deleteNavigationItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.navigationItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Navigation item not found' });
    }

    await prisma.navigationItem.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Navigation item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting navigation link' });
  }
};

module.exports = {
  getNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
};
