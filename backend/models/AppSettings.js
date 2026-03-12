import mongoose from 'mongoose';

const appSettingsSchema = new mongoose.Schema({
    registrationOpen: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('AppSettings', appSettingsSchema);
