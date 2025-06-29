const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Asset = require('../models/Asset');
const Threat = require('../models/Threat');
const Training = require('../models/Training');

// GET /api/compliance - Dynamic compliance tracker
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orgId = req.user.organization && req.user.organization._id ? req.user.organization._id : req.user.organization;
    const requirements = [];
    let met = 0, total = 0;

    // 1. All critical assets must have antivirus and firewall enabled
    const criticalAssets = await Asset.find({ organization: orgId, category: 'critical' });
    let allCriticalSecured = true;
    for (const asset of criticalAssets) {
      if (!asset.security?.antivirusInstalled || !asset.security?.firewallEnabled) {
        allCriticalSecured = false;
        break;
      }
    }
    total++;
    if (criticalAssets.length === 0 || allCriticalSecured) {
      requirements.push('All critical assets have antivirus and firewall enabled.');
      met++;
    } else {
      requirements.push('Some critical assets are missing antivirus or firewall.');
    }

    // 2. No unresolved critical or high threats
    const unresolvedThreats = await Threat.countDocuments({ organization: orgId, severity: { $in: ['critical', 'high'] }, status: { $ne: 'resolved' } });
    total++;
    if (unresolvedThreats === 0) {
      requirements.push('No unresolved critical or high threats.');
      met++;
    } else {
      requirements.push('Resolve all critical or high threats.');
    }

    // 3. All assets must have a recent security scan (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const assetsNoRecentScan = await Asset.countDocuments({ organization: orgId, $or: [ { 'security.lastSecurityScan': { $exists: false } }, { 'security.lastSecurityScan': { $lt: thirtyDaysAgo } } ] });
    total++;
    if (assetsNoRecentScan === 0) {
      requirements.push('All assets have a recent security scan.');
      met++;
    } else {
      requirements.push('Some assets are missing a recent security scan.');
    }

    // 4. All assets must be categorized
    const uncategorizedAssets = await Asset.countDocuments({ organization: orgId, $or: [ { category: { $exists: false } }, { category: null } ] });
    total++;
    if (uncategorizedAssets === 0) {
      requirements.push('All assets are categorized.');
      met++;
    } else {
      requirements.push('Some assets are not categorized.');
    }

    // 5. At least one employee security training completed (real)
    const trainingCount = await Training.countDocuments({ type: 'security' });
    total++;
    if (trainingCount > 0) {
      requirements.push('At least one employee security training completed.');
      met++;
    } else {
      requirements.push('No employee security training completed.');
    }

    // Compliance score
    const compliance = Math.round((met / total) * 100);
    res.json({ compliance, requirements });
  } catch (err) {
    res.status(500).json({ compliance: 0, requirements: ['Unable to calculate compliance'] });
  }
});

module.exports = router; 