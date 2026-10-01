import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
  },
  { timestamps: true },
)

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: '' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0, default: 0 },
    points: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
)

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, required: true },
    points: { type: Number, required: true, min: 0 },
    activityCount: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    activityType: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema)
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema)
export const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema)
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema)