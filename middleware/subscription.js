const User = require('../models/User');

const requirePremium = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.subscription !== 'premium') {
    return res.status(403).json({ message: 'Upgrade required for this feature.' });
  }

  next();
};

module.exports = requirePremium;
