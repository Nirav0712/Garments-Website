const prisma = require('../config/db');

const DEFAULT_THEME = {
  primary_color: '#111111',
  secondary_color: '#555555',
  accent_color: '#2563EB',
  background_color: '#FFFFFF',
  surface_color: '#F8F8F8',
  card_background: '#FFFFFF',
  border_color: '#E5E5E5',
  heading_color: '#111111',
  text_color: '#555555',
  button_background: '#111111',
  button_text: '#FFFFFF',
  button_hover: '#333333',
  header_background: '#FFFFFF',
  header_text: '#111111',
  footer_background: '#111111',
  footer_text: '#FFFFFF',
  success_color: '#16A34A',
  warning_color: '#F59E0B',
  error_color: '#DC2626',
  button_radius: '4px',
};

// @desc    Get all site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();

    const settingsMap = {};
    settings.forEach((s) => {
      let val = s.value;
      if (s.type === 'boolean') {
        val = s.value === 'true';
      } else if (s.type === 'json') {
        try {
          val = JSON.parse(s.value);
        } catch (e) {
          val = s.value;
        }
      }
      settingsMap[s.key] = val;
    });

    return res.status(200).json({
      success: true,
      settings: settingsMap,
      raw: settings,
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching site settings' });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const settingsPayload = req.body;

    if (typeof settingsPayload !== 'object' || Array.isArray(settingsPayload)) {
      return res.status(400).json({ success: false, message: 'Invalid settings payload' });
    }

    const updates = [];
    for (const [key, rawValue] of Object.entries(settingsPayload)) {
      const stringValue = typeof rawValue === 'object' ? JSON.stringify(rawValue) : String(rawValue);
      const updatePromise = prisma.siteSetting.upsert({
        where: { key },
        update: { value: stringValue },
        create: {
          key,
          value: stringValue,
          type: typeof rawValue === 'boolean' ? 'boolean' : (typeof rawValue === 'object' ? 'json' : 'text'),
        },
      });
      updates.push(updatePromise);
    }

    await Promise.all(updates);

    const updatedSettings = await prisma.siteSetting.findMany();
    const settingsMap = {};
    updatedSettings.forEach((s) => {
      let val = s.value;
      if (s.type === 'boolean') val = s.value === 'true';
      else if (s.type === 'json') {
        try {
          val = JSON.parse(s.value);
        } catch (e) {
          val = s.value;
        }
      }
      settingsMap[s.key] = val;
    });

    return res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      settings: settingsMap,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

// @desc    Get website theme settings
// @route   GET /api/settings/theme
// @access  Public
const getThemeSettings = async (req, res) => {
  try {
    const themeSetting = await prisma.siteSetting.findUnique({
      where: { key: 'site_theme' },
    });

    let theme = { ...DEFAULT_THEME };
    if (themeSetting && themeSetting.value) {
      try {
        const parsed = JSON.parse(themeSetting.value);
        theme = { ...DEFAULT_THEME, ...parsed };
      } catch (e) {
        console.warn('Could not parse site_theme JSON, using defaults');
      }
    }

    return res.status(200).json({
      success: true,
      theme,
      defaults: DEFAULT_THEME,
    });
  } catch (error) {
    console.error('Error getting theme settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching theme settings' });
  }
};

// @desc    Update website theme settings
// @route   PUT /api/settings/theme
// @access  Private/Admin
const updateThemeSettings = async (req, res) => {
  try {
    const newTheme = req.body;

    if (!newTheme || typeof newTheme !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid theme payload' });
    }

    const mergedTheme = { ...DEFAULT_THEME, ...newTheme };
    const stringified = JSON.stringify(mergedTheme);

    await prisma.siteSetting.upsert({
      where: { key: 'site_theme' },
      update: { value: stringified, type: 'json', group: 'appearance' },
      create: { key: 'site_theme', value: stringified, type: 'json', group: 'appearance' },
    });

    return res.status(200).json({
      success: true,
      message: 'Website theme updated successfully',
      theme: mergedTheme,
    });
  } catch (error) {
    console.error('Error updating theme settings:', error);
    return res.status(500).json({ success: false, message: 'Server error saving theme settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getThemeSettings,
  updateThemeSettings,
  DEFAULT_THEME,
};
