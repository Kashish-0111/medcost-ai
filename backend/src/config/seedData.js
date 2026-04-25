import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Hospital from '../models/Hospital.js'

dotenv.config()

const hospitals = [
    {
        name: "AIIMS Delhi",
        city: "Delhi",
        specializations: ["Heart Surgery", "Brain Surgery", "Knee Replacement", "Cancer", "Orthopedic"],
        rating: 4.8,
        totalBeds: 2500,
        costRange: { min: 150000, max: 400000 },
        address: "Ansari Nagar, New Delhi",
        contact: "011-26588500",
        accreditation: "NABH",
        successRate: 95
    },
    {
        name: "Fortis Hospital Delhi",
        city: "Delhi",
        specializations: ["Heart Surgery", "Knee Replacement", "Spine Surgery", "Cancer"],
        rating: 4.5,
        totalBeds: 1000,
        costRange: { min: 200000, max: 600000 },
        address: "Vasant Kunj, New Delhi",
        contact: "011-42776222",
        accreditation: "JCI",
        successRate: 92
    },
    {
        name: "Apollo Hospital Delhi",
        city: "Delhi",
        specializations: ["Heart Surgery", "Brain Surgery", "Knee Replacement", "Liver Transplant"],
        rating: 4.6,
        totalBeds: 1500,
        costRange: { min: 250000, max: 700000 },
        address: "Sarita Vihar, New Delhi",
        contact: "011-71791090",
        accreditation: "JCI",
        successRate: 93
    },
    {
        name: "Max Hospital Delhi",
        city: "Delhi",
        specializations: ["Heart Surgery", "Orthopedic", "Cancer", "Knee Replacement"],
        rating: 4.4,
        totalBeds: 800,
        costRange: { min: 180000, max: 500000 },
        address: "Saket, New Delhi",
        contact: "011-26515050",
        accreditation: "NABH",
        successRate: 90
    },
    {
        name: "Kokilaben Hospital Mumbai",
        city: "Mumbai",
        specializations: ["Heart Surgery", "Brain Surgery", "Cancer", "Knee Replacement"],
        rating: 4.7,
        totalBeds: 1200,
        costRange: { min: 300000, max: 800000 },
        address: "Andheri West, Mumbai",
        contact: "022-42696969",
        accreditation: "JCI",
        successRate: 94
    },
    {
        name: "Lilavati Hospital Mumbai",
        city: "Mumbai",
        specializations: ["Heart Surgery", "Orthopedic", "Spine Surgery", "Cancer"],
        rating: 4.5,
        totalBeds: 900,
        costRange: { min: 250000, max: 650000 },
        address: "Bandra West, Mumbai",
        contact: "022-26751000",
        accreditation: "NABH",
        successRate: 91
    },
    {
        name: "Manipal Hospital Bangalore",
        city: "Bangalore",
        specializations: ["Heart Surgery", "Brain Surgery", "Knee Replacement", "Cancer"],
        rating: 4.6,
        totalBeds: 1400,
        costRange: { min: 200000, max: 550000 },
        address: "HAL Airport Road, Bangalore",
        contact: "080-25024444",
        accreditation: "JCI",
        successRate: 93
    },
    {
        name: "Narayana Health Bangalore",
        city: "Bangalore",
        specializations: ["Heart Surgery", "Pediatric Surgery", "Cancer", "Orthopedic"],
        rating: 4.7,
        totalBeds: 2000,
        costRange: { min: 120000, max: 350000 },
        address: "Bommasandra, Bangalore",
        contact: "080-71222222",
        accreditation: "NABH",
        successRate: 96
    }
]

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB Connected ✔')

        await Hospital.deleteMany()
        await Hospital.insertMany(hospitals)

        console.log(' Hospital data seeded successfully!')
        process.exit(0)
    } catch (err) {
        console.log('Error:', err.message)
        process.exit(1)
    }
}

seedDB()