import mongoose from 'mongoose'

const searchSchema = new mongoose.Schema({
    procedure: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    budget: {
        type: Number
    },
    results: [{
        hospitalName: String,
        score: Number,
        estimatedCost: Object
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true })

export default mongoose.model('Search', searchSchema)