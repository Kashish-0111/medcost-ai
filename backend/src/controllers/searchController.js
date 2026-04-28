import Hospital from '../models/Hospital.js'
import Search from '../models/Search.js'
import { geminiModel } from '../config/gemini.js'
import client from '../config/ai.js'

// AI se procedure detect karo
// const detectProcedure = async (userQuery) => {
//     try {
//         const prompt = `
// You are a medical AI assistant. 
// User query: "${userQuery}"

// Task: Extract the medical procedure or surgery from this query.
// Return ONLY a JSON object like this:
// {
//     "procedure": "Heart Surgery",
//     "confidence": 85,
//     "suggestions": ["Pre-surgery cardiac evaluation recommended", "Post-surgery physiotherapy needed"],
//     "alternativeNames": ["Cardiac Surgery", "Open Heart Surgery"]
// }

// If query is already a procedure name, just map it correctly.
// If query is in Hindi or mixed language, understand and map to English medical term.
// Only return JSON, no other text.`

//         const result = await geminiModel.generateContent(prompt)
//         const text = result.response.text()
//         const clean = text.replace(/```json|```/g, '').trim()
//         return JSON.parse(clean)
//     } catch (err) {
//         console.log('Gemini Error:', err.message)
//         return { procedure: userQuery, confidence: 50, suggestions: [], alternativeNames: [] }
//     }
// }

const detectProcedure = async (userQuery) => {
    try {
        const response = await client.chat.completions.create({
            model: 'nvidia/nemotron-3-super-120b-a12b:free',
            messages: [
                {
                    role: 'user',
                    content: `You are a medical AI assistant.
User query: "${userQuery}"

Extract the medical procedure from this query.
Map this query to ONE of these exact procedures only:
- Heart Surgery
- Brain Surgery
- Knee Replacement
- Cancer
- Orthopedic
- Spine Surgery
- Liver Transplant
- Pediatric Surgery

Return ONLY a JSON object:
{
    "procedure": "Heart Surgery",
    "confidence": 85,
    "suggestions": ["tip 1", "tip 2"],
    "alternativeNames": ["Cardiac Surgery"]
}

Only return JSON, no other text.`
                }
            ]
        })

        const text = response.choices[0].message.content
        const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim()
        return JSON.parse(clean)
    } catch (err) {
        console.log('AI Error:', err.message)
        return { procedure: userQuery, confidence: 50, suggestions: [], alternativeNames: [] }
    }
}
// Hospital Ranking Algorithm
const calculateScore = (hospital, budget) => {
    const clinicalScore = (hospital.successRate / 100) * 30

    let costScore = 0
    if (budget) {
        if (hospital.costRange.min <= budget) {
            costScore = 25
        } else if (hospital.costRange.min <= budget * 1.2) {
            costScore = 15
        }
    } else {
        costScore = 15
    }

    const ratingScore = (hospital.rating / 5) * 15
    const accreditationScore =
        hospital.accreditation === 'JCI' ? 10 :
        hospital.accreditation === 'NABH' ? 8 :
        hospital.accreditation === 'ISO' ? 5 : 0
    const reputationScore = ratingScore + accreditationScore
    const capacityScore = Math.min(hospital.totalBeds / 500, 1) * 20

    return (clinicalScore + costScore + reputationScore + capacityScore).toFixed(2)
}

// Cost Estimation
const estimateCost = (hospital) => {
    const base = hospital.costRange.min
    const max = hospital.costRange.max

    return {
        surgery: { min: Math.round(base * 0.65), max: Math.round(max * 0.65) },
        hospital: { min: Math.round(base * 0.20), max: Math.round(max * 0.20) },
        medicines: { min: Math.round(base * 0.10), max: Math.round(max * 0.10) },
        buffer: { min: Math.round(base * 0.05), max: Math.round(max * 0.05) },
        total: { min: base, max: max }
    }
}

// Search hospitals
export const searchHospitals = async (req, res) => {
    try {
        const { procedure, city, budget } = req.body

        if (!procedure || !city) {
            return res.status(400).json({ error: 'Procedure and city are required!' })
        }

        // AI se procedure detect karo
        const aiResult = await detectProcedure(procedure)
        console.log('AI Result:', aiResult)

        // AI detected procedure se search karo
        const searchTerms = [aiResult.procedure, ...(aiResult.alternativeNames || [])]

        let hospitals = []
        for (const term of searchTerms) {
            const found = await Hospital.find({
                city: { $regex: city, $options: 'i' },
                specializations: { $regex: term, $options: 'i' }
            })
            hospitals = [...hospitals, ...found]
        }

        // Duplicates remove karo
        hospitals = hospitals.filter((h, index, self) =>
            index === self.findIndex(t => t._id.toString() === h._id.toString())
        )

        if (hospitals.length === 0) {
            return res.status(404).json({ 
                error: `No hospitals found for "${aiResult.procedure}" in ${city}!`,
                aiDetected: aiResult.procedure
            })
        }

        // Score calculate karo
        const rankedHospitals = hospitals
            .map(hospital => ({
                hospital,
                score: parseFloat(calculateScore(hospital, budget)),
                costEstimate: estimateCost(hospital)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)

        // Search history save karo
        await Search.create({
            procedure: aiResult.procedure,
            city,
            budget,
            results: rankedHospitals.map(r => ({
                hospitalName: r.hospital.name,
                score: r.score,
                estimatedCost: r.costEstimate
            }))
        })

        res.status(200).json({
            userQuery: procedure,
            aiDetectedProcedure: aiResult.procedure,
            confidence: aiResult.confidence,
            suggestions: aiResult.suggestions,
            city,
            totalFound: hospitals.length,
            topHospitals: rankedHospitals
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}