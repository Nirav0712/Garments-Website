const prisma = require('../config/db');

// @desc    Get all hero slides
// @route   GET /api/hero-slides
// @access  Public
const getHeroSlides = async (req, res) => {
  try {
    const { all } = req.query;
    const where = {};
    if (!all) {
      where.isActive = true;
    }

    const slides = await prisma.heroSlide.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: slides.length,
      slides,
    });
  } catch (error) {
    console.error('Error getting hero slides:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching hero slides' });
  }
};

// @desc    Create new hero slide
// @route   POST /api/hero-slides
// @access  Private/Admin
const createHeroSlide = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      badge,
      description,
      buttonText,
      buttonUrl,
      image,
      overlayOpacity,
      textPosition,
      displayOrder,
      isActive,
    } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required for hero slide' });
    }

    const maxOrderSlide = await prisma.heroSlide.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const nextOrder = displayOrder !== undefined ? parseInt(displayOrder) : (maxOrderSlide ? maxOrderSlide.displayOrder + 1 : 1);

    const slide = await prisma.heroSlide.create({
      data: {
        title,
        subtitle: subtitle || null,
        badge: badge || null,
        description: description || null,
        buttonText: buttonText || 'Explore Products',
        buttonUrl: buttonUrl || '/products',
        image,
        overlayOpacity: overlayOpacity !== undefined ? parseFloat(overlayOpacity) : 0.4,
        textPosition: textPosition || 'left',
        displayOrder: nextOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      slide,
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return res.status(500).json({ success: false, message: 'Server error creating hero slide' });
  }
};

// @desc    Update hero slide
// @route   PUT /api/hero-slides/:id
// @access  Private/Admin
const updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      badge,
      description,
      buttonText,
      buttonUrl,
      image,
      overlayOpacity,
      textPosition,
      displayOrder,
      isActive,
    } = req.body;

    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
        badge: badge !== undefined ? badge : existing.badge,
        description: description !== undefined ? description : existing.description,
        buttonText: buttonText !== undefined ? buttonText : existing.buttonText,
        buttonUrl: buttonUrl !== undefined ? buttonUrl : existing.buttonUrl,
        image: image !== undefined ? image : existing.image,
        overlayOpacity: overlayOpacity !== undefined ? parseFloat(overlayOpacity) : existing.overlayOpacity,
        textPosition: textPosition !== undefined ? textPosition : existing.textPosition,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : existing.displayOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Hero slide updated successfully',
      slide,
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return res.status(500).json({ success: false, message: 'Server error updating hero slide' });
  }
};

// @desc    Delete hero slide
// @route   DELETE /api/hero-slides/:id
// @access  Private/Admin
const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    await prisma.heroSlide.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Hero slide deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting hero slide' });
  }
};

// @desc    Reorder hero slides
// @route   PUT /api/hero-slides/reorder
// @access  Private/Admin
const reorderHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body;

    if (!Array.isArray(slides)) {
      return res.status(400).json({ success: false, message: 'Invalid slides array' });
    }

    for (const item of slides) {
      await prisma.heroSlide.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      });
    }

    const updatedSlides = await prisma.heroSlide.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return res.status(200).json({
      success: true,
      message: 'Hero slides reordered successfully',
      slides: updatedSlides,
    });
  } catch (error) {
    console.error('Error reordering slides:', error);
    return res.status(500).json({ success: false, message: 'Server error reordering slides' });
  }
};

module.exports = {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
};
