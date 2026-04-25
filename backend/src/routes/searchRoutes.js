import express from 'express'
import { searchHospitals } from '../controllers/searchController.js'

const router = express.Router()

router.post('/search', searchHospitals)

export default router