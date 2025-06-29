const mongoose = require('mongoose');
const axios = require('axios');
const Threat = require('../models/Threat');

// Update this with your MongoDB connection string
const MONGO_URI = 'mongodb+srv://adityautsav1901:ziYcGJFCpzmuQABT@cyber.kjw2phk.mongodb.net/';

const severityMap = { critical: 500, high: 300, medium: 50, low: 20, info: 10 };

async function updateThreats() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const threats = await Threat.find({ "aiDetection.result": { $exists: false } });
  console.log(`Found ${threats.length} threats missing aiDetection.result`);

  for (const threat of threats) {
    try {
      const riskScore = severityMap[threat.severity] || 10;
      let aiResult = "normal";
      let confidence = 60;

      // Call your AI microservice
      const aiRes = await axios.post('http://localhost:8001/predict', { risk_score: riskScore });
      aiResult = aiRes.data.result || "normal";
      confidence = aiResult === "anomaly" ? 95 : 60;

      // Force anomaly for demo if riskScore is high (same as backend logic)
      if (riskScore >= 100) {
        aiResult = "anomaly";
        confidence = 99;
      }

      // Update the threat
      threat.aiDetection.result = aiResult;
      threat.aiDetection.confidence = confidence;
      // Optionally update indicators if needed
      if (!threat.aiDetection.indicators) {
        threat.aiDetection.indicators = ['network_traffic'];
      }
      await threat.save();
      console.log(`Updated threat ${threat._id}: result=${aiResult}`);
    } catch (err) {
      console.error(`Failed to update threat ${threat._id}:`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log('Done!');
}

updateThreats();