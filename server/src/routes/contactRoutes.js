const express = require('express');
const router = express.Router();
const {
  submitContact,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitContact);

router.route('/inquiries')
  .get(protect, adminOnly, getInquiries);

router.route('/inquiries/:id')
  .patch(protect, adminOnly, updateInquiryStatus)
  .delete(protect, adminOnly, deleteInquiry);

module.exports = router;
