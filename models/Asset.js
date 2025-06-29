const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  // Basic Asset Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: [
      'server',
      'workstation',
      'laptop',
      'mobile_device',
      'network_device',
      'cloud_service',
      'application',
      'database',
      'website',
      'api_endpoint',
      'storage_device',
      'iot_device',
      'other'
    ],
    required: true
  },
  category: {
    type: String,
    enum: [
      'critical',
      'high',
      'medium',
      'low'
    ],
    default: 'medium'
  },

  // Technical Details
  technicalDetails: {
    ipAddress: {
      type: String,
      trim: true
    },
    macAddress: {
      type: String,
      trim: true
    },
    hostname: {
      type: String,
      trim: true
    },
    operatingSystem: {
      type: String,
      trim: true
    },
    version: {
      type: String,
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    serialNumber: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    owner: {
      type: String,
      trim: true
    }
  },

  // Cloud Service Details (if applicable)
  cloudDetails: {
    provider: {
      type: String,
      enum: ['aws', 'azure', 'gcp', 'digitalocean', 'heroku', 'other']
    },
    serviceType: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      trim: true
    },
    instanceId: {
      type: String,
      trim: true
    },
    tags: [{
      key: String,
      value: String
    }]
  },

  // Security Information
  security: {
    encryptionStatus: {
      type: String,
      enum: ['encrypted', 'not_encrypted', 'unknown'],
      default: 'unknown'
    },
    antivirusInstalled: {
      type: Boolean,
      default: false
    },
    firewallEnabled: {
      type: Boolean,
      default: false
    },
    lastSecurityScan: Date,
    securityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    vulnerabilities: [{
      cveId: String,
      severity: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low']
      },
      description: String,
      discoveredAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'false_positive'],
        default: 'open'
      },
      remediation: String
    }],
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non_compliant', 'partial', 'unknown'],
      default: 'unknown'
    }
  },

  // Risk Assessment
  riskAssessment: {
    overallRiskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    riskFactors: {
      exposure: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
      },
      vulnerability: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
      },
      threat: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
      },
      impact: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
      }
    },
    lastAssessment: {
      type: Date,
      default: Date.now
    },
    nextAssessment: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    assessmentHistory: [{
      score: Number,
      factors: {
        exposure: Number,
        vulnerability: Number,
        threat: Number,
        impact: Number
      },
      assessedAt: {
        type: Date,
        default: Date.now
      },
      assessedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },

  // Monitoring and Alerts
  monitoring: {
    isMonitored: {
      type: Boolean,
      default: true
    },
    monitoringType: [{
      type: String,
      enum: ['network', 'system', 'application', 'security', 'performance']
    }],
    alertThresholds: {
      cpuUsage: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
      },
      memoryUsage: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
      },
      diskUsage: {
        type: Number,
        min: 0,
        max: 100,
        default: 85
      },
      networkTraffic: {
        type: Number,
        min: 0,
        default: 1000 // MB/s
      }
    },
    lastMonitoringCheck: Date,
    monitoringStatus: {
      type: String,
      enum: ['online', 'offline', 'warning', 'error'],
      default: 'online'
    }
  },

  // Insurance Information
  insurance: {
    isInsured: {
      type: Boolean,
      default: false
    },
    policyNumber: String,
    coverageAmount: Number,
    premium: Number,
    deductible: Number,
    coverageType: [{
      type: String,
      enum: ['cyber_liability', 'data_breach', 'business_interruption', 'network_security']
    }],
    insurer: String,
    policyStartDate: Date,
    policyEndDate: Date
  },

  // Lifecycle Management
  lifecycle: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'decommissioned'],
      default: 'active'
    },
    acquisitionDate: Date,
    warrantyExpiry: Date,
    endOfLife: Date,
    replacementDate: Date,
    decommissionDate: Date
  },

  // Relationships
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentAsset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  },
  childAssets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  }],
  dependencies: [{
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    },
    dependencyType: {
      type: String,
      enum: ['critical', 'important', 'optional']
    }
  }],

  // Audit Trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for risk level
assetSchema.virtual('riskLevel').get(function() {
  const score = this.riskAssessment.overallRiskScore;
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
});

// Virtual for age
assetSchema.virtual('age').get(function() {
  if (!this.lifecycle.acquisitionDate) return null;
  const now = new Date();
  const diffTime = Math.abs(now - this.lifecycle.acquisitionDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Indexes
assetSchema.index({ organization: 1 });
assetSchema.index({ type: 1 });
assetSchema.index({ category: 1 });
assetSchema.index({ 'riskAssessment.overallRiskScore': -1 });
assetSchema.index({ 'lifecycle.status': 1 });
assetSchema.index({ 'monitoring.isMonitored': 1 });
assetSchema.index({ 'security.complianceStatus': 1 });
assetSchema.index({ createdAt: -1 });

// Pre-save middleware
assetSchema.pre('save', function(next) {
  // Auto-calculate risk score if not manually set
  if (this.isModified('security') || this.isModified('riskAssessment.riskFactors')) {
    this.calculateRiskScore();
  }
  
  next();
});

// Instance methods
assetSchema.methods.calculateRiskScore = function() {
  const factors = this.riskAssessment.riskFactors;
  const baseScore = (factors.exposure + factors.vulnerability + factors.threat + factors.impact) / 4;
  
  // Adjust based on security posture
  let securityMultiplier = 1;
  if (this.security.encryptionStatus === 'encrypted') securityMultiplier *= 0.9;
  if (this.security.antivirusInstalled) securityMultiplier *= 0.95;
  if (this.security.firewallEnabled) securityMultiplier *= 0.95;
  
  // Adjust based on vulnerabilities
  const criticalVulns = this.security.vulnerabilities.filter(v => v.severity === 'critical').length;
  const highVulns = this.security.vulnerabilities.filter(v => v.severity === 'high').length;
  const vulnPenalty = (criticalVulns * 10) + (highVulns * 5);
  
  this.riskAssessment.overallRiskScore = Math.min(100, Math.max(0, baseScore * securityMultiplier + vulnPenalty));
};

assetSchema.methods.addVulnerability = function(vulnerability) {
  this.security.vulnerabilities.push(vulnerability);
  this.calculateRiskScore();
  return this.save();
};

assetSchema.methods.updateVulnerabilityStatus = function(cveId, status) {
  const vuln = this.security.vulnerabilities.find(v => v.cveId === cveId);
  if (vuln) {
    vuln.status = status;
    this.calculateRiskScore();
    return this.save();
  }
  throw new Error('Vulnerability not found');
};

// Static methods
assetSchema.statics.findByRiskLevel = function(level) {
  const scoreRanges = {
    'critical': { $gte: 80 },
    'high': { $gte: 60, $lt: 80 },
    'medium': { $gte: 40, $lt: 60 },
    'low': { $lt: 40 }
  };
  
  return this.find({
    'riskAssessment.overallRiskScore': scoreRanges[level]
  });
};

assetSchema.statics.findByOrganization = function(orgId) {
  return this.find({ organization: orgId }).populate('parentAsset');
};

assetSchema.statics.findCriticalAssets = function(orgId) {
  return this.find({
    organization: orgId,
    $or: [
      { category: 'critical' },
      { 'riskAssessment.overallRiskScore': { $gte: 80 } }
    ]
  });
};

module.exports = mongoose.model('Asset', assetSchema); 