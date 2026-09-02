const prisma = require('../config/db');

// @desc    Get all page content blocks or by page
// @route   GET /api/content
// @access  Public
const getContent = async (req, res) => {
  try {
    const { page } = req.query;
    const where = {};
    if (page) {
      where.page = page;
    }

    const items = await prisma.pageContent.findMany({ where });

    // Format as a convenient dictionary keyed by sectionKey
    const dictionary = {};
    items.forEach((item) => {
      let parsedMeta = item.meta;
      try {
        if (typeof item.meta === 'string') {
          parsedMeta = JSON.parse(item.meta);
        }
      } catch (e) {
        parsedMeta = item.meta;
      }

      dictionary[item.sectionKey] = {
        id: item.id,
        sectionKey: item.sectionKey,
        page: item.page,
        title: item.title,
        subtitle: item.subtitle,
        content: item.content,
        image: item.image,
        meta: parsedMeta,
        updatedAt: item.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: dictionary,
      list: items,
    });
  } catch (error) {
    console.error('Error getting content:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching CMS content' });
  }
};

// @desc    Update / Upsert content section
// @route   PUT /api/content/:sectionKey
// @access  Private/Admin
const updateContent = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { title, subtitle, content, image, meta, page } = req.body;

    const metaString = typeof meta === 'object' ? JSON.stringify(meta) : meta;

    const updated = await prisma.pageContent.upsert({
      where: { sectionKey },
      update: {
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        content: content !== undefined ? content : undefined,
        image: image !== undefined ? image : undefined,
        meta: metaString !== undefined ? metaString : undefined,
        page: page || undefined,
      },
      create: {
        sectionKey,
        page: page || 'home',
        title: title || null,
        subtitle: subtitle || null,
        content: content || null,
        image: image || null,
        meta: metaString || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      content: updated,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return res.status(500).json({ success: false, message: 'Server error updating CMS content' });
  }
};

// @desc    Bulk update multiple sections
// @route   POST /api/content/bulk
// @access  Private/Admin
const bulkUpdateContent = async (req, res) => {
  try {
    const { sections } = req.body; // Array of { sectionKey, title, subtitle, content, image, meta, page }

    if (!Array.isArray(sections)) {
      return res.status(400).json({ success: false, message: 'Invalid sections array' });
    }

    const results = [];
    for (const sec of sections) {
      const metaString = typeof sec.meta === 'object' ? JSON.stringify(sec.meta) : sec.meta;
      const resItem = await prisma.pageContent.upsert({
        where: { sectionKey: sec.sectionKey },
        update: {
          title: sec.title,
          subtitle: sec.subtitle,
          content: sec.content,
          image: sec.image,
          meta: metaString,
        },
        create: {
          sectionKey: sec.sectionKey,
          page: sec.page || 'home',
          title: sec.title || null,
          subtitle: sec.subtitle || null,
          content: sec.content || null,
          image: sec.image || null,
          meta: metaString || null,
        },
      });
      results.push(resItem);
    }

    return res.status(200).json({
      success: true,
      message: 'Bulk content updated successfully',
      count: results.length,
    });
  } catch (error) {
    console.error('Error bulk updating content:', error);
    return res.status(500).json({ success: false, message: 'Server error updating CMS sections' });
  }
};

module.exports = {
  getContent,
  updateContent,
  bulkUpdateContent,
};
