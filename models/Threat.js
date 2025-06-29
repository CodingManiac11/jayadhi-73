const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  // Basic Threat Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: [
      'malware',
      'phishing',
      'ransomware',
      'ddos',
      'sql_injection',
      'xss',
      'privilege_escalation',
      'data_breach',
      'insider_threat',
      'social_engineering',
      'zero_day',
      'apt',
      'botnet',
      'crypto_mining',
      'other'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['network', 'application', 'endpoint', 'data', 'user', 'cloud', 'iot'],
    required: true
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low', 'info'],
    required: true
  },
  status: {
    type: String,
    enum: ['detected', 'investigating', 'contained', 'resolved', 'false_positive', 'escalated'],
    default: 'detected'
  },

  // AI Detection Details
  aiDetection: {
    detectedBy: {
      type: String,
      enum: ['ml_model', 'rule_based', 'manual', 'external_feed'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    result: {
      type: String,
      enum: ['anomaly', 'normal'],
      required: true
    },
    modelVersion: String,
    detectionTime: {
      type: Date,
      default: Date.now
    },
    falsePositiveProbability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.1
    },
    indicators: [{
      type: String,
      enum: ['network_traffic', 'file_behavior', 'user_activity', 'system_logs', 'api_calls'],
      required: true
    }],
    signatures: [{
      name: String,
      description: String,
      confidence: Number
    }]
  },

  // Technical Details
  technicalDetails: {
    sourceIP: {
      type: String,
      trim: true
    },
    destinationIP: {
      type: String,
      trim: true
    },
    sourcePort: Number,
    destinationPort: Number,
    protocol: {
      type: String,
      enum: ['tcp', 'udp', 'icmp', 'http', 'https', 'ftp', 'ssh', 'other']
    },
    userAgent: String,
    requestMethod: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
    },
    requestURL: String,
    payload: String,
    fileHash: String,
    fileName: String,
    fileSize: Number,
    processName: String,
    processId: Number,
    commandLine: String,
    registryKeys: [String],
    networkConnections: [{
      remoteIP: String,
      remotePort: Number,
      localPort: Number,
      protocol: String
    }]
  },

  // Affected Assets
  affectedAssets: [{
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    },
    impact: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical']
    },
    status: {
      type: String,
      enum: ['affected', 'isolated', 'quarantined', 'cleaned', 'restored']
    },
    notes: String
  }],

  // Impact Assessment
  impact: {
    businessImpact: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    dataImpact: {
      type: String,
      enum: ['none', 'confidentiality', 'integrity', 'availability', 'all'],
      default: 'none'
    },
    financialImpact: {
      estimatedLoss: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    operationalImpact: {
      downtime: Number, // in minutes
      affectedUsers: Number,
      affectedSystems: Number
    },
    reputationImpact: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical'],
      default: 'none'
    }
  },

  // Response and Mitigation
  response: {
    automatedActions: [{
      action: {
        type: String,
        enum: ['block_ip', 'quarantine_file', 'isolate_endpoint', 'reset_password', 'disable_account', 'update_firewall']
      },
      executedAt: {
        type: Date,
        default: Date.now
      },
      success: Boolean,
      details: String
    }],
    manualActions: [{
      action: String,
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedAt: Date,
      completedAt: Date,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'failed']
      },
      notes: String
    }],
    containmentTime: Date,
    resolutionTime: Date,
    rootCause: String,
    lessonsLearned: String
  },

  // Compliance and Reporting
  compliance: {
    reportable: {
      type: Boolean,
      default: false
    },
    regulatoryRequirements: [{
      regulation: String,
      requirement: String,
      status: {
        type: String,
        enum: ['compliant', 'non_compliant', 'pending_review']
      }
    }],
    notificationSent: {
      type: Boolean,
      default: false
    },
    notificationRecipients: [{
      name: String,
      email: String,
      role: String,
      notifiedAt: Date
    }]
  },

  // Insurance and Claims
  insurance: {
    claimable: {
      type: Boolean,
      default: false
    },
    claimAmount: Number,
    claimStatus: {
      type: String,
      enum: ['not_filed', 'filed', 'under_review', 'approved', 'denied', 'paid']
    },
    claimNumber: String,
    insurer: String,
    policyNumber: String,
    claimFiledAt: Date,
    claimResolvedAt: Date
  },

  // Timeline and Events
  timeline: [{
    event: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    details: String,
    evidence: [{
      type: String,
      url: String,
      description: String
    }]
  }],

  // Relationships
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedThreats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Threat'
  }],

  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['p1', 'p2', 'p3', 'p4'],
    default: 'p3'
  },
  sla: {
    responseTime: Number, // in minutes
    resolutionTime: Number, // in minutes
    breached: Boolean
  },
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

// Virtual for threat age
threatSchema.virtual('age').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.aiDetection.detectionTime);
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return diffHours;
});

// Virtual for response time
threatSchema.virtual('responseTime').get(function() {
  if (!this.response.containmentTime) return null;
  const diffTime = this.response.containmentTime - this.aiDetection.detectionTime;
  return Math.ceil(diffTime / (1000 * 60)); // in minutes
});

// Virtual for resolution time
threatSchema.virtual('resolutionTime').get(function() {
  if (!this.response.resolutionTime) return null;
  const diffTime = this.response.resolutionTime - this.aiDetection.detectionTime;
  return Math.ceil(diffTime / (1000 * 60)); // in minutes
});

// Indexes
threatSchema.index({ organization: 1 });
threatSchema.index({ type: 1 });
threatSchema.index({ severity: 1 });
threatSchema.index({ status: 1 });
threatSchema.index({ 'aiDetection.detectionTime': -1 });
threatSchema.index({ 'aiDetection.confidence': -1 });
threatSchema.index({ 'technicalDetails.sourceIP': 1 });
threatSchema.index({ 'technicalDetails.destinationIP': 1 });
threatSchema.index({ createdAt: -1 });

// Pre-save middleware
threatSchema.pre('save', function(next) {
  // Auto-set priority based on severity
  if (this.isModified('severity')) {
    const priorityMap = {
      'critical': 'p1',
      'high': 'p2',
      'medium': 'p3',
      'low': 'p4',
      'info': 'p4'
    };
    this.priority = priorityMap[this.severity];
  }

  // Add to timeline if status changes
  if (this.isModified('status')) {
    this.timeline.push({
      event: `Status changed to ${this.status}`,
      timestamp: new Date(),
      details: `Threat status updated to ${this.status}`
    });
  }

  next();
});

// Instance methods
threatSchema.methods.addTimelineEvent = function(event, details, actor) {
  this.timeline.push({
    event,
    details,
    actor,
    timestamp: new Date()
  });
  return this.save();
};

threatSchema.methods.updateStatus = function(newStatus, notes) {
  this.status = newStatus;
  if (notes) {
    this.notes.push({
      content: notes,
      createdAt: new Date()
    });
  }
  return this.save();
};

threatSchema.methods.addAffectedAsset = function(assetId, impact, status) {
  this.affectedAssets.push({
    asset: assetId,
    impact: impact || 'low',
    status: status || 'affected'
  });
  return this.save();
};

// Static methods
threatSchema.statics.findBySeverity = function(severity) {
  return this.find({ severity });
};

threatSchema.statics.findActiveThreats = function(orgId) {
  return this.find({
    organization: orgId,
    status: { $in: ['detected', 'investigating', 'contained'] }
  });
};

threatSchema.statics.findByDateRange = function(orgId, startDate, endDate) {
  return this.find({
    organization: orgId,
    'aiDetection.detectionTime': {
      $gte: startDate,
      $lte: endDate
    }
  });
};

threatSchema.statics.getThreatStats = async function(orgId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        organization: mongoose.Types.ObjectId(orgId),
        'aiDetection.detectionTime': { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          type: '$type',
          severity: '$severity',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Threat', threatSchema); 