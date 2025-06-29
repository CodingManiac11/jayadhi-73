const express = require('express');
const router = express.Router();

// Example GET endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Admin route is working!' });
});

module.exports = router; 