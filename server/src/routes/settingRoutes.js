const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getThemeSettings,
  updateThemeSettings,
} = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getSettings)
  .put(protect, adminOnly, updateSettings);

router.route('/theme')
  .get(getThemeSettings)
  .put(protect, adminOnly, updateThemeSettings);

module.exports = router;
