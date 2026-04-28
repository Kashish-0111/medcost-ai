import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return ;
    this.password = await bcrypt.hash(this.password, 10)
    
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)