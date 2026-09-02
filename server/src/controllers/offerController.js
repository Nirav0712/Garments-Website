const prisma = require('../config/db');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res) => {
  try {
    const { all } = req.query;
    const where = {};
    if (!all) {
      where.isActive = true;
    }

    const offers = await prisma.offer.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    console.error('Error getting offers:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching offers' });
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      discountText,
      buttonText,
      buttonUrl,
      image,
      bgImage,
      startDate,
      endDate,
      isActive,
      displayOrder,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Offer title is required' });
    }

    const maxOrder = await prisma.offer.findFirst({ orderBy: { displayOrder: 'desc' } });
    const nextOrder = displayOrder !== undefined ? parseInt(displayOrder) : (maxOrder ? maxOrder.displayOrder + 1 : 1);

    const offer = await prisma.offer.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        discountText: discountText || null,
        buttonText: buttonText || 'Shop Offer',
        buttonUrl: buttonUrl || '/products',
        image: image || null,
        bgImage: bgImage || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        displayOrder: nextOrder,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      offer,
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    return res.status(500).json({ success: false, message: 'Server error creating offer' });
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      discountText,
      buttonText,
      buttonUrl,
      image,
      bgImage,
      startDate,
      endDate,
      isActive,
      displayOrder,
    } = req.body;

    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
        description: description !== undefined ? description : existing.description,
        discountText: discountText !== undefined ? discountText : existing.discountText,
        buttonText: buttonText !== undefined ? buttonText : existing.buttonText,
        buttonUrl: buttonUrl !== undefined ? buttonUrl : existing.buttonUrl,
        image: image !== undefined ? image : existing.image,
        bgImage: bgImage !== undefined ? bgImage : existing.bgImage,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existing.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : existing.displayOrder,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      offer,
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    return res.status(500).json({ success: false, message: 'Server error updating offer' });
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    await prisma.offer.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting offer' });
  }
};

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
