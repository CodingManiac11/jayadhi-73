const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Asset = require('../models/Asset');
const Threat = require('../models/Threat');

// GET /api/insurance - Return dynamic insurance readiness data
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orgId = req.user.organization && req.user.organization._id ? req.user.organization._id : req.user.organization;
    // Count assets for this organization
    const assetCount = await Asset.countDocuments({ organization: orgId });
    // Count resolved threats for this organization
    const resolvedThreats = await Threat.countDocuments({ organization: orgId, status: 'resolved' });
    // Example: requirements based on user/org data
    const requirements = [];
    if (assetCount === 0) requirements.push('Add your first asset');
    if (assetCount > 0 && assetCount < 3) requirements.push('Add more assets to improve coverage');
    if (resolvedThreats === 0) requirements.push('Resolve detected threats');
    requirements.push('Incident response plan');
    requirements.push('Employee security training');
    // Readiness score: 100% if all requirements except base are met, else lower
    let readiness = 100;
    if (assetCount === 0) readiness -= 30;
    else if (assetCount < 3) readiness -= 10;
    if (resolvedThreats === 0) readiness -= 20;
    res.json({ readiness, requirements });
  } catch (err) {
    res.status(500).json({ readiness: 0, requirements: ['Unable to calculate readiness'] });
  }
});

module.exports = router; 