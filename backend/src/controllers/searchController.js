import Hospital from '../models/Hospital.js'
import Search from '../models/Search.js'

// Hospital Ranking Algorithm
const calculateScore = (hospital, budget) => {
    // 1. Clinical Score (30%) — specialization + success rate
    const clinicalScore = (hospital.successRate / 100) * 30

    // 2. Cost Score (25%) — budget ke andar hai?
    let costScore = 0
    if (budget) {
        if (hospital.costRange.min <= budget) {
            costScore = 25
        } else if (hospital.costRange.min <= budget * 1.2) {
            costScore = 15 // thoda upar hai but consider karo
        }
    } else {
        costScore = 15 // budget nahi diya toh neutral
    }

    // 3. Reputation Score (25%) — rating + accreditation
    const ratingScore = (hospital.rating / 5) * 15
    const accreditationScore = 
        hospital.accreditation === 'JCI' ? 10 :
        hospital.accreditation === 'NABH' ? 8 :
        hospital.accreditation === 'ISO' ? 5 : 0
    const reputationScore = ratingScore + accreditationScore

    // 4. Capacity Score (20%) — beds available
    const capacityScore = Math.min(hospital.totalBeds / 500, 1) * 20

    return (clinicalScore + costScore + reputationScore + capacityScore).toFixed(2)
}

// Cost Estimation
const estimateCost = (hospital, procedure) => {
    const base = hospital.costRange.min
    const max = hospital.costRange.max

    return {
        surgery: {
            min: Math.round(base * 0.65),
            max: Math.round(max * 0.65)
        },
        hospital: {
            min: Math.round(base * 0.20),
            max: Math.round(max * 0.20)
        },
        medicines: {
            min: Math.round(base * 0.10),
            max: Math.round(max * 0.10)
        },
        buffer: {
            min: Math.round(base * 0.05),
            max: Math.round(max * 0.05)
        },
        total: {
            min: base,
            max: max
        }
    }
}

// Search hospitals
export const searchHospitals = async (req, res) => {
    try {
        const { procedure, city, budget } = req.body

        if (!procedure || !city) {
            return res.status(400).json({ error: 'Procedure and city are required!' })
        }

        // City ke hospitals dhundho
        const hospitals = await Hospital.find({
            city: { $regex: city, $options: 'i' },
            specializations: { $regex: procedure, $options: 'i' }
        })

        if (hospitals.length === 0) {
            return res.status(404).json({ error: 'No hospitals found for this procedure in your city!' })
        }

        // Score calculate karo aur sort karo
        const rankedHospitals = hospitals
            .map(hospital => ({
                hospital,
                score: parseFloat(calculateScore(hospital, budget)),
                costEstimate: estimateCost(hospital, procedure)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5) // Top 5

        // Search history save karo
        await Search.create({
            procedure,
            city,
            budget,
            results: rankedHospitals.map(r => ({
                hospitalName: r.hospital.name,
                score: r.score,
                estimatedCost: r.costEstimate
            }))
        })

        res.status(200).json({
            procedure,
            city,
            totalFound: hospitals.length,
            topHospitals: rankedHospitals
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}