const prisma = require('../config/db');
const slugify = require('slugify');

// Generate unique collection slug
const createUniqueCollectionSlug = async (name, currentId = null) => {
  let baseSlug = slugify(name, { lower: true, strict: true }) || 'collection';
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (!existing || (currentId && existing.id === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${count}`;
    count++;
  }
};

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
const getCollections = async (req, res) => {
  try {
    const { all } = req.query;
    const where = {};
    if (!all) {
      where.isActive = true;
    }

    const collections = await prisma.collection.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return res.status(200).json({ success: true, collections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching collections' });
  }
};

// @desc    Create collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = async (req, res) => {
  try {
    const { name, description, image, badge, displayOrder, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }

    const slug = await createUniqueCollectionSlug(name);

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        badge: badge || null,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({ success: true, message: 'Collection created successfully', collection });
  } catch (error) {
    console.error('Error creating collection:', error);
    return res.status(500).json({ success: false, message: 'Server error creating collection' });
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, badge, displayOrder, isActive } = req.body;

    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    let slug = existing.slug;
    if (name && name !== existing.name) {
      slug = await createUniqueCollectionSlug(name, id);
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        slug,
        description: description !== undefined ? description : existing.description,
        image: image !== undefined ? image : existing.image,
        badge: badge !== undefined ? badge : existing.badge,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : existing.displayOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    return res.status(200).json({ success: true, message: 'Collection updated successfully', collection });
  } catch (error) {
    console.error('Error updating collection:', error);
    return res.status(500).json({ success: false, message: 'Server error updating collection' });
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    await prisma.collection.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting collection' });
  }
};

module.exports = {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
};
