const prisma = require('../config/db');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : 'Inquiry from Product List Store',
        message: message.trim(),
        status: 'UNREAD',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our specialist will respond shortly.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

// @desc    Get contact inquiries
// @route   GET /api/contact/inquiries
// @access  Private/Admin
const getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) {
      where.status = status;
    }

    const pageNum = parseInt(page);
    const take = parseInt(limit);
    const skip = (pageNum - 1) * take;

    const [total, inquiries, unreadCount] = await Promise.all([
      prisma.contactSubmission.count({ where }),
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.contactSubmission.count({ where: { status: 'UNREAD' } }),
    ]);

    return res.status(200).json({
      success: true,
      total,
      unreadCount,
      page: pageNum,
      totalPages: Math.ceil(total / take) || 1,
      inquiries,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching inquiries' });
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/contact/inquiries/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // UNREAD, READ, REPLIED, ARCHIVED

    const validStatuses = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: 'Inquiry status updated',
      inquiry: updated,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return res.status(500).json({ success: false, message: 'Server error updating inquiry' });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/contact/inquiries/:id
// @access  Private/Admin
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contactSubmission.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting inquiry' });
  }
};

module.exports = {
  submitContact,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
};
