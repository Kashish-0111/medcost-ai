import mongoose from 'mongoose'

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    specializations: [{
        type: String
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalBeds: {
        type: Number,
        default: 0
    },
    costRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 }
    },
    address: {
        type: String
    },
    contact: {
        type: String
    },
    accreditation: {
        type: String,
        enum: ['NABH', 'JCI', 'ISO', 'None'],
        default: 'None'
    },
    successRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, { timestamps: true })

export default mongoose.model('Hospital', hospitalSchema)