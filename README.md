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

## 🔐 Authentication (No Firebase)

- User authentication is handled using JWT (JSON Web Tokens).
- User credentials are securely stored in MongoDB.
- On login, the backend issues a JWT signed with your `JWT_SECRET`.
- Protected API routes require the JWT in the `Authorization: Bearer <token>` header.
- No Firebase or third-party auth is required.

## 📋 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis

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
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://adityautsav1901:ziYcGJFCpzmuQABT@cyber.kjw2phk.mongodb.net/
# JWT
JWT_SECRET=fcf1671b3947b6d6dd55c1acf78671255b4e3e377493f11948117c32afedb134
JWT_EXPIRE=24h



# Redis
REDIS_URL=redis://localhost:6379

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=adityautsav123456@gmail.com
SMTP_PASS=admin123



# AI/ML Models
AI_MODEL_PATH=./models/threat_detection_model
ANOMALY_THRESHOLD=0.8

# Encryption
ENCRYPTION_KEY=b19ac0c39fbe6871034738789023152b6aa58df09308a4f8b69aa56cdfa2cc62```

## 🏗️ Project Structure

```
cybersecurity-ai-platform/
├── server.js                 # Main server file
├── package.json
├── .env.example
├── README.md
├── config/                   # Configuration files
│   ├── database.js
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

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

### Assets
- `GET /api/assets` - List assets
- `POST /api/assets` - Add asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Threats
- `GET /api/threats` - List threats
- `POST /api/threats` - Add threat
- `PUT /api/threats/:id` - Update threat
- `DELETE /api/threats/:id` - Delete threat

### Compliance
- `GET /api/compliance` - List compliance tasks
- `POST /api/compliance` - Add compliance task
- `PUT /api/compliance/:id` - Update compliance task
- `DELETE /api/compliance/:id` - Delete compliance task

### Insurance
- `GET /api/insurance` - Get insurance readiness and requirements
- `POST /api/insurance/assessments` - Add assessment
- `PUT /api/insurance/assessments/:id` - Update assessment
- `DELETE /api/insurance/assessments/:id` - Delete assessment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 🆘 Support

For support, email adityautsav1901@gmail.com




