const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },

  // Organization Information
  organization: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    type: {
      type: String,
      enum: ['startup', 'sme', 'enterprise', 'government'],
      default: 'sme'
    },
    industry: {
      type: String,
      trim: true,
      maxlength: 100
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
      default: '11-50'
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: 'India'
      },
      postalCode: String
    },
    website: {
      type: String,
      trim: true
    }
  },

  // Role and Permissions
  role: {
    type: String,
    enum: ['admin', 'security_admin', 'compliance_officer', 'analyst', 'viewer'],
    default: 'viewer'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_assets',
      'view_threats',
      'manage_threats',
      'view_compliance',
      'manage_compliance',
      'view_insurance',
      'manage_insurance',
      'view_reports',
      'manage_settings'
    ]
  }],

  // Subscription and Billing
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'professional', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'cancelled'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    // stripeCustomerId: String,
    // stripeSubscriptionId: String
  },

  // Security Settings
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: String,
    lastPasswordChange: {
      type: Date,
      default: Date.now
    },
    passwordHistory: [{
      password: String,
      changedAt: {
        type: Date,
        default: Date.now
      }
    }],
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockedUntil: Date,
    apiKeys: [{
      key: String,
      name: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      lastUsed: Date,
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },

  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      },
      threatAlerts: {
        type: Boolean,
        default: true
      },
      complianceReminders: {
        type: Boolean,
        default: true
      },
      systemUpdates: {
        type: Boolean,
        default: true
      }
    },
    dashboard: {
      defaultView: {
        type: String,
        enum: ['overview', 'threats', 'compliance', 'insurance'],
        default: 'overview'
      },
      widgets: [{
        type: String,
        enum: ['threatSummary', 'riskScore', 'complianceStatus', 'recentIncidents', 'assetOverview']
      }]
    }
  },

  // Status and Timestamps
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  lastActivity: Date,

  // Audit Trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for organization display name
userSchema.virtual('orgDisplayName').get(function() {
  return this.organization?.name || 'Unknown Organization';
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'organization.name': 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
      
      // Add to password history
      this.security.passwordHistory.push({
        password: this.password,
        changedAt: new Date()
      });
      
      // Keep only last 5 passwords
      if (this.security.passwordHistory.length > 5) {
        this.security.passwordHistory = this.security.passwordHistory.slice(-5);
      }
      
      this.security.lastPasswordChange = new Date();
    } catch (error) {
      return next(error);
    }
  }
  
  // Set display name if not provided
  if (!this.displayName) {
    this.displayName = this.fullName;
  }
  
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function() {
  return this.security.lockedUntil && this.security.lockedUntil > new Date();
};

userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'admin';
};

userSchema.methods.canAccessFeature = function(feature) {
  const featureAccess = {
    'threat_detection': ['basic', 'professional', 'enterprise'],
    'compliance_tracker': ['professional', 'enterprise'],
    'insurance_module': ['enterprise'],
    'advanced_analytics': ['professional', 'enterprise'],
    'api_access': ['professional', 'enterprise']
  };
  
  return featureAccess[feature]?.includes(this.subscription.plan) || false;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

userSchema.statics.findByOrganization = function(orgName) {
  return this.find({ 'organization.name': orgName });
};

module.exports = mongoose.model('User', userSchema); 