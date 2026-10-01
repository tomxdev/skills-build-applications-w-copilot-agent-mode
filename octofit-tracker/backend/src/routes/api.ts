import { Router } from 'express'
import mongoose from 'mongoose'
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js'

const router = Router()
const activityPointMultipliers = { running: 2, walking: 1, strength: 1.5 } as const

router.get('/', (request, response) => {
  const apiBaseUrl = request.app.locals.apiBaseUrl as string
  response.json({
    baseUrl: apiBaseUrl,
    users: `${apiBaseUrl}/api/users`,
    teams: `${apiBaseUrl}/api/teams`,
    activities: `${apiBaseUrl}/api/activities`,
    leaderboard: `${apiBaseUrl}/api/leaderboard`,
    workouts: `${apiBaseUrl}/api/workouts`,
  })
})

router.get('/users', async (_request, response) => {
  response.json(await User.find().sort({ username: 1 }))
})

router.post('/users', async (request, response) => {
  const user = await User.create({
    username: request.body.username,
    email: request.body.email,
    displayName: request.body.displayName,
  })
  response.status(201).json(user)
})

router.get('/teams', async (_request, response) => {
  response.json(await Team.find().populate('members', 'username displayName').sort({ name: 1 }))
})

router.post('/teams', async (request, response) => {
  const team = await Team.create({
    name: request.body.name,
    description: request.body.description,
    members: request.body.members ?? [],
  })
  response.status(201).json(await team.populate('members', 'username displayName'))
})

router.get('/activities', async (request, response) => {
  const filter = request.query.userId ? { user: request.query.userId } : {}
  response.json(await Activity.find(filter).populate('user', 'username displayName').sort({ date: -1 }))
})

router.post('/activities', async (request, response) => {
  const { userId, activityType, durationMinutes, distanceKm, date } = request.body
  const multiplier = activityPointMultipliers[activityType as keyof typeof activityPointMultipliers]
  const duration = Number(durationMinutes)

  if (!mongoose.Types.ObjectId.isValid(userId) || !multiplier || !Number.isFinite(duration) || duration < 1) {
    response.status(400).json({ error: 'Valid userId, activityType, and durationMinutes are required' })
    return
  }

  if (!await User.exists({ _id: userId })) {
    response.status(404).json({ error: 'User not found' })
    return
  }

  const activity = await Activity.create({
    user: userId,
    activityType,
    durationMinutes: duration,
    distanceKm,
    points: Math.round(duration * multiplier),
    date,
  })
  response.status(201).json(await activity.populate('user', 'username displayName'))
})

router.get('/leaderboard', async (_request, response) => {
  interface LeaderboardEntry {
    _id: mongoose.Types.ObjectId
    username: string
    points: number
    activityCount: number
  }

  const entries = await Activity.aggregate<LeaderboardEntry>([
    { $group: { _id: '$user', points: { $sum: '$points' }, activityCount: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'profile' } },
    { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    { $project: { username: { $ifNull: ['$profile.username', 'Unknown'] }, points: 1, activityCount: 1 } },
    { $sort: { points: -1, activityCount: -1, username: 1 } },
  ])

  const rankedEntries = entries.map((entry, index) => ({
    user: entry._id,
    username: entry.username,
    points: entry.points,
    activityCount: entry.activityCount,
    rank: index + 1,
  }))

  if (rankedEntries.length > 0) {
    await Leaderboard.bulkWrite(
      rankedEntries.map((entry) => ({
        updateOne: { filter: { user: entry.user }, update: { $set: entry }, upsert: true },
      })),
    )
  }
  await Leaderboard.deleteMany({ user: { $nin: rankedEntries.map((entry) => entry.user) } })
  response.json(rankedEntries)
})

router.get('/workouts', async (request, response) => {
  const filter: Record<string, string> = {}
  if (request.query.level) filter.level = String(request.query.level)
  if (request.query.activityType) filter.activityType = String(request.query.activityType)
  response.json(await Workout.find(filter).sort({ level: 1, title: 1 }))
})

router.post('/workouts', async (request, response) => {
  const workout = await Workout.create({
    title: request.body.title,
    description: request.body.description,
    activityType: request.body.activityType,
    level: request.body.level,
    durationMinutes: request.body.durationMinutes,
  })
  response.status(201).json(workout)
})

router.get('/workouts/suggestions', async (request, response) => {
  const userId = String(request.query.userId ?? '')
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    response.status(400).json({ error: 'A valid userId is required' })
    return
  }

  const user = await User.findById(userId)
  if (!user) {
    response.status(404).json({ error: 'User not found' })
    return
  }

  const since = new Date()
  since.setDate(since.getDate() - 30)
  const [summary] = await Activity.aggregate<{ totalMinutes: number }>([
    { $match: { user: user._id, date: { $gte: since } } },
    { $group: { _id: null, totalMinutes: { $sum: '$durationMinutes' } } },
  ])
  const level = (summary?.totalMinutes ?? 0) >= 300
    ? 'advanced'
    : (summary?.totalMinutes ?? 0) >= 120
      ? 'intermediate'
      : 'beginner'

  response.json({ level, workouts: await Workout.find({ level }).sort({ title: 1 }) })
})

export default router