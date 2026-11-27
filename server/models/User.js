import mongoose from 'mongoose';
import { CRAFT_SLUGS, LEVELS, levelForExperience } from '../config/constants.js';

const enrolledCraftSchema = new mongoose.Schema(
  {
    craft: { type: String, enum: CRAFT_SLUGS, required: true },
    enrolledAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// A completed step is identified by craft + level + order (stable across re-seeding)
const completedStepSchema = new mongoose.Schema(
  {
    craft: { type: String, enum: CRAFT_SLUGS, required: true },
    level: { type: String, enum: LEVELS, required: true },
    order: { type: Number, required: true, min: 1 },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      match: [/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'],
    },
    username: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    age: { type: Number, required: true, min: 14, max: 100 },
    location: {
      city: { type: String, required: true, trim: true, maxlength: 60 },
      state: { type: String, required: true, trim: true, maxlength: 60 },
    },
    primaryCraft: { type: String, enum: CRAFT_SLUGS, required: true },
    experienceYears: { type: Number, required: true, min: 0, max: 80 },
    bio: { type: String, trim: true, maxlength: 150, default: '' },
    craftStory: { type: String, trim: true, maxlength: 2000, default: '' },
    enrolledCrafts: { type: [enrolledCraftSchema], default: [] },
    completedSteps: { type: [completedStepSchema], default: [] },
  },
  {
    timestamps: true, // createdAt + updatedAt
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
);

userSchema.virtual('level').get(function level() {
  return levelForExperience(this.experienceYears);
});

userSchema.methods.isEnrolled = function isEnrolled(craft) {
  return this.enrolledCrafts.some((e) => e.craft === craft);
};

userSchema.methods.enroll = function enroll(craft) {
  const existing = this.enrolledCrafts.find((e) => e.craft === craft);
  if (existing) existing.lastActivityAt = new Date();
  else this.enrolledCrafts.push({ craft });
  return !existing; // true if newly enrolled
};

export default mongoose.model('User', userSchema);
