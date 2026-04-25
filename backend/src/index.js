import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import searchRoutes from './routes/searchRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: "*" }))
app.use(express.json())


connectDB()

app.use('/api', searchRoutes)


app.get('/health', (req, res) => {
    res.status(200).json({ message: 'MedCost AI Backend Running 🚀' })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})