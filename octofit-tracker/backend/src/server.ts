import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { connectDatabase } from './config/database.js'
import apiRouter from './routes/api.js'

const app = express()
const port = Number(process.env.PORT) || 8000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'octofit-tracker-api',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

app.use('/api', apiRouter)

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: error.message })
    return
  }

  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    response.status(409).json({ error: 'A record with this unique value already exists' })
    return
  }

  console.error('API request failed:', error)
  response.status(500).json({ error: 'Internal server error' })
})

async function startServer(): Promise<void> {
  await connectDatabase()
  app.listen(port, () => {
    console.log(`OctoFit Tracker API listening on port ${port}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit Tracker API:', error)
  process.exit(1)
})