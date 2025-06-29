# Cybersecurity AI Platform

A comprehensive, India-focused SaaS solution designed to empower startups and MSMEs to protect their digital assets effectively. The platform leverages cutting-edge machine learning models trained on Indian cyber threat data to detect anomalies, automate threat response, and provide continuous risk visibility.

## 🚀 Features

### 1. AI Threat Detection & Incident Response
- **Localized Machine Learning Models**: Trained on Indian cyber threat patterns
- **Anomaly Detection**: Real-time monitoring of network traffic, user behavior, and system logs
- **Automated Mitigation**: Predefined actions like IP blocking and file quarantining
- **Multi-channel Alerts**: Email, SMS, and app notifications
- **Incident Forensics**: Attack timeline visualization and asset tracking

### 2. Cyber Risk Dashboard
- **Asset Management**: Comprehensive inventory with risk attributes
- **Risk Scoring Engine**: Dynamic risk calculation based on vulnerabilities and threats
- **Visual Analytics**: Intuitive charts and heatmaps
- **Customizable Alerts**: Configurable risk level thresholds
- **Benchmarking**: Industry comparison and gap analysis

### 3. Compliance Tracker
- **Regulation Mapping**: IT Act, CERT-In guidelines, and data privacy rules
- **Self-Audit Module**: Interactive checklists and questionnaires
- **Document Repository**: Centralized compliance evidence storage
- **Automated Reminders**: Audit and training deadline notifications
- **Compliance Reports**: Exportable summaries for regulators

### 4. Cyber Insurance Readiness Module
- **Risk Quantification**: Security posture to insurance criteria mapping
- **Policy Matching**: AI-powered insurance recommendations
- **Claims Facilitation**: Formatted incident reports and evidence
- **Cost-Benefit Insights**: Premium vs. mitigation investment analysis
- **Integration APIs**: Real-time risk updates for insurers

### 5. User-Friendly Pricing
- **Freemium Access**: Essential monitoring for startups
- **Tiered Subscriptions**: Advanced features for MSMEs and larger firms
- **Simple Onboarding**: Guided setup wizards and contextual help
- **Multi-Device Support**: Responsive web and mobile applications
- **Customer Support**: Dedicated assistance and training

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Firebase Auth** for authentication
- **Socket.io** for real-time communications
- **TensorFlow.js** for AI/ML models
- **Redis** for caching and sessions

### Frontend
- **React.js** with TypeScript
- **Material-UI** for components
- **Chart.js** for data visualization
- **Socket.io-client** for real-time updates
- **Axios** for API communication

### AI/ML
- **TensorFlow.js** for threat detection models
- **Natural** for NLP processing
- **Custom anomaly detection algorithms**
- **Indian cyber threat datasets**

### DevOps & Security
- **Helmet.js** for security headers
- **Rate limiting** and input validation
- **JWT tokens** for API security
- **Data encryption** at rest and in transit

## 📋 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis
- Firebase project setup

### Backend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cybersecurity_ai

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=24h

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Redis
REDIS_URL=redis://localhost:6379

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Payment (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# AI/ML Models
AI_MODEL_PATH=./models/threat_detection_model
ANOMALY_THRESHOLD=0.8
```

## 🏗️ Project Structure

```
cybersecurity-ai-platform/
├── server.js                 # Main server file
├── package.json
├── .env.example
├── README.md
├── config/                   # Configuration files
│   ├── database.js
│   ├── firebase.js
│   └── redis.js
├── models/                   # Database models
│   ├── User.js
│   ├── Asset.js
│   ├── Threat.js
│   ├── Incident.js
│   ├── Compliance.js
│   └── Subscription.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── assets.js
│   ├── threats.js
│   ├── compliance.js
│   ├── insurance.js
│   └── admin.js
├── middleware/               # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   ├── rateLimit.js
│   └── errorHandler.js
├── services/                 # Business logic
│   ├── aiService.js
│   ├── threatDetection.js
│   ├── complianceService.js
│   ├── insuranceService.js
│   ├── notificationService.js
│   └── riskScoring.js
├── utils/                    # Utility functions
│   ├── logger.js
│   ├── encryption.js
│   ├── validators.js
│   └── helpers.js
├── ai/                       # AI/ML models and data
│   ├── models/
│   ├── datasets/
│   ├── training/
│   └── inference/
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
└── docs/                     # Documentation
    ├── api.md
    ├── deployment.md
    └── security.md
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📊 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Assets
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Threats
- `GET /api/threats` - Get threat alerts
- `POST /api/threats` - Report new threat
- `PUT /api/threats/:id` - Update threat status
- `GET /api/threats/analytics` - Threat analytics

### Compliance
- `GET /api/compliance/checklist` - Get compliance checklist
- `POST /api/compliance/audit` - Submit audit results
- `GET /api/compliance/reports` - Generate compliance reports

### Insurance
- `GET /api/insurance/risk-profile` - Get risk profile
- `POST /api/insurance/policy-match` - Get policy recommendations
- `POST /api/insurance/claims` - Submit insurance claim

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@cybersecurity-ai.com or join our Slack channel.

## 🔒 Security

If you discover any security-related issues, please email security@cybersecurity-ai.com instead of using the issue tracker.

---

**Built with ❤️ for India's growing digital economy** 